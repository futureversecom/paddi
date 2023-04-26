// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import '../src/Challenge.sol';
import {MockASTO} from '../src/MockASTO.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract ChallengeTest is Test {
    using ECDSA for bytes32;

    // Events copied from Challenge.sol
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

    Challenge public challenge;
    MockASTO public asto;

    // Cheat codes are state changing methods called from the address:
    // 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D
    address user1 = address(0x86599B800E23036D761f43D7516092447295659f); // Random address for testing
    address user2 = address(0x823556202e86763853b40e9cDE725f412e294689); // Random address for testing
    address feeAddr = address(0x6b96056DACa7Cc251453743185b592cfFb7e44F5); // Random address for testing

    uint256 private pk =
        0xabfa816b2d044fca73f609721c7811b3876e69f915a5398bdb88b3ce5bf28a61;

    function setUp() public {
        asto = new MockASTO();
        challenge = new Challenge(address(asto), vm.addr(pk), feeAddr, 0);

        // Give ASTO
        vm.prank(user1);
        asto.faucet();
        vm.prank(user2);
        asto.faucet();

        // Add allowance
        vm.prank(user1);
        asto.approve(address(challenge), 100);
        vm.prank(user2);
        asto.approve(address(challenge), 100);
    }

    function testOpenContest() public {
        bytes32 contestHash = bytes32('xyz');
        uint256 beforeBal = asto.balanceOf(user1);

        vm.expectEmit(true, true, true, true);
        emit ContestOpened(user1, user2, 50, contestHash);
        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );

        assertEq(asto.balanceOf(user1), beforeBal - 50);
        Contest memory contest = challenge.getContest(contestHash);
        assertState(contest.state, ContestState.OPEN);
        assertEq(contest.initiator, user1);
        assertEq(contest.acceptor, user2);
        assertEq(contest.potHalf, 50);
    }

    function testOpenContestBadAcceptor() public {
        vm.expectRevert(InvalidCaller.selector);
        vm.prank(user1);
        challenge.openContest(
            user1,
            50,
            bytes32('xyz'),
            _signStandard(ContestState.OPEN, user1, bytes32('xyz'))
        );
    }

    function testOpenContestInvalidStates() public {
        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            bytes32('xyz'),
            _signStandard(ContestState.OPEN, user1, bytes32('xyz'))
        );

        // Open contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.openContest(
            user1,
            50,
            bytes32('xyz'),
            _signStandard(ContestState.OPEN, user2, bytes32('xyz'))
        );

        // Close contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.closeContest(
            user1,
            bytes32('xyz'),
            _signStandard(ContestState.CLOSED, user1, bytes32('xyz'))
        );
    }

    function testOpenContestSignature() public {
        // Bad caller
        vm.expectRevert(InvalidSignature.selector);
        challenge.openContest(
            user2,
            50,
            bytes32('xyz'),
            _signStandard(ContestState.OPEN, user1, bytes32('xyz'))
        );

        // Bad contestHash
        vm.expectRevert(InvalidSignature.selector);
        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            bytes32('xyz'),
            _signStandard(ContestState.OPEN, user1, bytes32('abc'))
        );

        // Bad ContestState
        vm.expectRevert(InvalidSignature.selector);
        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            bytes32('xyz'),
            _signStandard(ContestState.CLOSED, user1, bytes32('xyz'))
        );
    }

    function testAcceptContest() public {
        bytes32 contestHash = bytes32('xyz');

        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );

        uint256 beforeBal = asto.balanceOf(user2);

        vm.expectEmit(true, true, true, true);
        emit ContestAccepted(user1, user2, 50, bytes32('xyz'));
        vm.prank(user2);
        challenge.acceptContest(contestHash);

        assertEq(asto.balanceOf(user2), beforeBal - 50);
        Contest memory contest = challenge.getContest(contestHash);
        assertState(contest.state, ContestState.ACCEPTED);
        assertEq(contest.initiator, user1);
        assertEq(contest.acceptor, user2);
        assertEq(contest.potHalf, 50);
    }

    function testAcceptContestAny() public {
        bytes32 contestHash = bytes32('xyz');

        vm.prank(user1);
        challenge.openContest(
            address(0),
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );

        uint256 beforeBal = asto.balanceOf(user2);

        vm.expectEmit(true, true, true, true);
        emit ContestAccepted(user1, user2, 50, bytes32('xyz'));
        vm.prank(user2);
        challenge.acceptContest(contestHash);

        assertEq(asto.balanceOf(user2), beforeBal - 50);
        Contest memory contest = challenge.getContest(contestHash);
        assertState(contest.state, ContestState.ACCEPTED);
        assertEq(contest.initiator, user1);
        assertEq(contest.acceptor, user2);
        assertEq(contest.potHalf, 50);
    }

    function testAcceptContestInvalidAcceptor() public {
        // Specific acceptor, invalid
        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            bytes32('xyz'),
            _signStandard(ContestState.OPEN, user1, bytes32('xyz'))
        );
        vm.expectRevert(InvalidCaller.selector);
        challenge.acceptContest(bytes32('xyz'));

        // Open acceptor, initiator
        vm.prank(user1);
        challenge.openContest(
            address(0),
            50,
            bytes32('abc'),
            _signStandard(ContestState.OPEN, user1, bytes32('abc'))
        );
        vm.expectRevert(InvalidCaller.selector);
        vm.prank(user1);
        challenge.acceptContest(bytes32('abc'));
    }

    function testAcceptedContestInvalidStates() public {
        bytes32 contestHash = bytes32('xyz');
        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );
        vm.prank(user2);
        challenge.acceptContest(contestHash);

        // Open contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.openContest(
            user1,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user2, contestHash)
        );

        // Revoke contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user1);
        challenge.revokeContest(contestHash);

        // Accept contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.acceptContest(contestHash);
    }

    function testRevokeContest() public {
        bytes32 contestHash = bytes32('xyz');
        uint256 beforeBal = asto.balanceOf(user1);

        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );

        vm.expectEmit(true, true, true, true);
        emit ContestRevoked(user1, contestHash);
        vm.prank(user1);
        challenge.revokeContest(contestHash);

        assertEq(asto.balanceOf(user1), beforeBal);
        Contest memory contest = challenge.getContest(contestHash);
        assertState(contest.state, ContestState.REVOKED);
        assertEq(contest.initiator, user1);
        assertEq(contest.acceptor, user2);
        assertEq(contest.potHalf, 50);
    }

    function testRevokeContestInvalidStates() public {
        bytes32 contestHash = bytes32('xyz');
        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );
        vm.prank(user1);
        challenge.revokeContest(contestHash);

        // Open contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.openContest(
            user1,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user2, contestHash)
        );

        // Revoke contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user1);
        challenge.revokeContest(contestHash);

        // Accept contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.acceptContest(contestHash);

        // Close contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.closeContest(
            user1,
            contestHash,
            _signStandard(ContestState.CLOSED, user1, contestHash)
        );
    }

    function testCloseContest() public {
        bytes32 contestHash = bytes32('xyz');

        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );
        vm.prank(user2);
        challenge.acceptContest(contestHash);

        uint256 user1BalBefore = asto.balanceOf(user1);
        uint256 user2BalBefore = asto.balanceOf(user2);

        vm.expectEmit(true, true, true, true);
        emit ContestClosed(user1, user2, 100, bytes32('xyz'));
        challenge.closeContest(
            user1,
            contestHash,
            _signStandard(ContestState.CLOSED, user1, contestHash)
        );

        assertEq(asto.balanceOf(user1), user1BalBefore + 100);
        assertEq(asto.balanceOf(user2), user2BalBefore);
        Contest memory contest = challenge.getContest(contestHash);
        assertState(contest.state, ContestState.CLOSED);
        assertEq(contest.initiator, user1);
        assertEq(contest.acceptor, user2);
        assertEq(contest.potHalf, 50);
    }

    function testCloseContestWithFee() public {
        bytes32 contestHash = bytes32('xyz');

        challenge.setFeeDetails(feeAddr, 1000); // 10%

        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );
        vm.prank(user2);
        challenge.acceptContest(contestHash);

        uint256 user1BalBefore = asto.balanceOf(user1);
        uint256 user2BalBefore = asto.balanceOf(user2);
        uint256 feeAddrBalBefore = asto.balanceOf(feeAddr);

        vm.expectEmit(true, true, true, true);
        emit ContestClosed(user1, user2, 90, bytes32('xyz'));
        challenge.closeContest(
            user1,
            contestHash,
            _signStandard(ContestState.CLOSED, user1, contestHash)
        );

        assertEq(asto.balanceOf(user1), user1BalBefore + 90);
        assertEq(asto.balanceOf(user2), user2BalBefore);
        assertEq(asto.balanceOf(feeAddr), feeAddrBalBefore + 10);
        Contest memory contest = challenge.getContest(contestHash);
        assertState(contest.state, ContestState.CLOSED);
        assertEq(contest.initiator, user1);
        assertEq(contest.acceptor, user2);
        assertEq(contest.potHalf, 50);
    }

    function testCloseContestSignature() public {
        bytes32 contestHash = bytes32('xyz');

        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );
        vm.prank(user2);
        challenge.acceptContest(contestHash);

        // Bad winner
        vm.expectRevert(InvalidSignature.selector);
        challenge.closeContest(
            user2,
            contestHash,
            _signStandard(ContestState.CLOSED, user1, contestHash)
        );

        // Bad contestHash
        vm.expectRevert(InvalidSignature.selector);
        challenge.closeContest(
            user1,
            contestHash,
            _signStandard(ContestState.CLOSED, user1, bytes32('abc'))
        );

        // Bad ContestState
        vm.expectRevert(InvalidSignature.selector);
        challenge.closeContest(
            user1,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );
    }

    function testClosedContestInvalidStates() public {
        bytes32 contestHash = bytes32('xyz');
        vm.prank(user1);
        challenge.openContest(
            user2,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user1, contestHash)
        );
        vm.prank(user2);
        challenge.acceptContest(contestHash);
        challenge.closeContest(
            user1,
            contestHash,
            _signStandard(ContestState.CLOSED, user1, contestHash)
        );

        // Open contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.openContest(
            user1,
            50,
            contestHash,
            _signStandard(ContestState.OPEN, user2, contestHash)
        );

        // Revoke contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user1);
        challenge.revokeContest(contestHash);

        // Accept contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.acceptContest(contestHash);

        // Close contest fails
        vm.expectRevert(InvalidContestState.selector);
        vm.prank(user2);
        challenge.closeContest(
            user1,
            contestHash,
            _signStandard(ContestState.CLOSED, user1, contestHash)
        );
    }

    //
    // Helpers
    //

    function assertState(ContestState actual, ContestState expected) private {
        assertEq(uint8(actual), uint8(expected));
    }

    function _signStandard(
        ContestState state,
        address addr,
        bytes32 contestHash
    ) private view returns (bytes memory) {
        return _sign(abi.encodePacked(state, addr, contestHash), pk);
    }

    function _sign(bytes memory data, uint256 _pk)
        internal
        pure
        returns (bytes memory)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;
        (v, r, s) = vm.sign(_pk, keccak256(data).toEthSignedMessageHash());
        return abi.encodePacked(r, s, v);
    }
}
