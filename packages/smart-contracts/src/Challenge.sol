// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

error InvalidSignature();
error InvalidContestState();
error InvalidCaller();
error InvalidParams();
error PaymentFailed(uint256 amount);

enum ContestState {
    OPEN,
    ACCEPTED,
    CLOSED,
    REVOKED
}

struct Contest {
    ContestState state;
    address initiator;
    address acceptor;
    uint256 potHalf; // Half of the pot
}

/**
 * A contract that allows one player to challenge another.
 * Note: Challenge details are managed off chain and signed by the host server.
 */
contract Challenge is Ownable {
    using ECDSA for bytes32;

    address public _signer;
    IERC20 public immutable ASTO;
    address public feeAddress;
    // Fee is charged in basis points
    uint256 public feeBasis;

    mapping(bytes32 => Contest) public contests;

    event ContestOpened(
        address initiator,
        address acceptor,
        uint256 potHalf,
        bytes32 indexed contestHash
    );
    event ContestAccepted(
        address initiator,
        address acceptor,
        uint256 potHalf,
        bytes32 indexed contestHash
    );
    event ContestClosed(
        address winner,
        address loser,
        uint256 winnings,
        bytes32 indexed contestHash
    );
    event ContestRevoked(address initiator, bytes32 indexed contestHash);

    constructor(
        address asto,
        address signer_,
        address feeAddress_,
        uint256 feeBasis_
    ) Ownable() {
        ASTO = IERC20(asto);
        _signer = signer_;
        feeBasis = feeBasis_;
        feeAddress = feeAddress_;
    }

    /**
     * Checks if the signature matches data signed by the signer.
     * @param data The data to sign.
     * @param signature The expected signed data.
     * @dev Reverts if the signature is invalid.
     */
    modifier signed(bytes memory data, bytes memory signature) {
        address dataSigner = keccak256(data).toEthSignedMessageHash().recover(
            signature
        );
        if (dataSigner != _signer) revert InvalidSignature();
        _;
    }

    /**
     * Create an open contest.
     * @param acceptor The acceptor of the challenge. If address(0), anyone can accept.
     * @param potHalf The amount added to the pot by the initiator.
     * @param contestHash The contest hash.
     * @param signature The server signed contest hash.
     */
    function openContest(
        address acceptor,
        uint256 potHalf,
        bytes32 contestHash,
        bytes calldata signature
    )
        external
        signed(
            abi.encodePacked(ContestState.OPEN, msg.sender, contestHash),
            signature
        )
    {
        address msgSender = msg.sender;
        if (acceptor == msgSender) {
            // Caller can't be acceptor
            revert InvalidCaller();
        }
        if (contests[contestHash].initiator != address(0)) {
            // Already opened
            revert InvalidContestState();
        }
        // Take ASTO
        takeAstoAmount(msgSender, potHalf);
        // Create contest
        contests[contestHash] = Contest(
            ContestState.OPEN,
            msgSender,
            acceptor,
            potHalf
        );
        emit ContestOpened(msgSender, acceptor, potHalf, contestHash);
    }

    /**
     * Revoke an open contest.
     * @param contestHash The contest to revoke.
     * @notice This must be called on an open contest.
     * @notice This must be called by the initiator of the contest.
     * @dev Returns ASTO to the initiator.
     */
    function revokeContest(bytes32 contestHash) external {
        Contest storage contest = contests[contestHash];
        // Check state
        if (contest.state != ContestState.OPEN) {
            revert InvalidContestState();
        }
        address msgSender = msg.sender;
        if (contest.initiator != msgSender) {
            revert InvalidCaller();
        }
        // Send back ASTO
        ASTO.transfer(msgSender, contest.potHalf);
        // Close it
        contest.state = ContestState.REVOKED;
        emit ContestRevoked(contest.initiator, contestHash);
    }

    /**
     * Accepts an open contest.
     * @param contestHash The contest hash.
     */
    function acceptContest(bytes32 contestHash) external {
        Contest storage contest = contests[contestHash];
        // Check state
        if (contest.state != ContestState.OPEN) {
            revert InvalidContestState();
        }
        address msgSender = msg.sender;
        // Check acceptor
        if (contest.initiator == msgSender) {
            revert InvalidCaller();
        } else if (contest.acceptor == address(0)) {
            contest.acceptor = msgSender;
        } else if (contest.acceptor != msgSender) {
            revert InvalidCaller();
        }
        // Take pot
        takeAstoAmount(msgSender, contest.potHalf);
        // Update state
        contest.state = ContestState.ACCEPTED;
        emit ContestAccepted(
            contest.initiator,
            contest.acceptor,
            contest.potHalf,
            contestHash
        );
    }

    /**
     * Marks a contest as won. Sends the winner the winnings.
     * @param winner The winner of the contest.
     * @param contestHash The contest hash.
     * @param signature The server signed contest hash.
     */
    function closeContest(
        address winner,
        bytes32 contestHash,
        bytes calldata signature
    )
        external
        signed(
            abi.encodePacked(ContestState.CLOSED, winner, contestHash),
            signature
        )
    {
        Contest storage contest = contests[contestHash];
        // Check state
        if (contest.state != ContestState.ACCEPTED) {
            revert InvalidContestState();
        }

        // Validate addresses
        address loser;
        if (contest.initiator == winner) {
            loser = contest.acceptor;
        } else if (contest.acceptor == winner) {
            loser = contest.initiator;
        } else {
            revert InvalidParams();
        }

        // Calculate winnings
        uint256 winnings = contest.potHalf * 2;
        uint256 fee = (winnings * feeBasis) / 10000;
        winnings -= fee;
        // Send winnings and fee
        ASTO.transfer(winner, winnings);
        ASTO.transfer(feeAddress, fee);
        // Update state
        contest.state = ContestState.CLOSED;
        emit ContestClosed(winner, loser, winnings, contestHash);
    }

    //
    // Admin
    //

    function setSigner(address signer_) external onlyOwner {
        _signer = signer_;
    }

    function setFeeDetails(address feeAddress_, uint256 feeBasis_)
        external
        onlyOwner
    {
        feeBasis = feeBasis_;
        feeAddress = feeAddress_;
    }

    //
    // Internal
    //

    /**
     * Take ASTO from the given address.
     * @param from The address to take from.
     * @param amount The amount to take.
     */
    function takeAstoAmount(address from, uint256 amount) internal {
        bool success = ASTO.transferFrom(from, address(this), amount);
        if (!success) revert PaymentFailed(amount);
    }

    /**
     * Get the contest.
     * @param contestHash The contest hash.
     * @return contest The contest.
     */
    function getContest(bytes32 contestHash)
        external
        view
        returns (Contest memory contest)
    {
        return contests[contestHash];
    }
}
