// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ComputeManagerSimple} from 'protocol-core/contracts/samples/ComputeManagerSimple.sol';

/**
 * An implementation of the Compute Manager for Pong.
 */
contract PongComputeManager is ComputeManagerSimple {
    address public completer;
    string internal constant MUST_BE_CALLED_BY_COMPLETER =
        'Must be called by completer';

    constructor(address computeRequestManager_, address completer_)
        ComputeManagerSimple(computeRequestManager_)
    {
        completer = completer_;
    }

    modifier onlyCompleter() {
        if (msg.sender != completer)
            revert InvalidCaller(
                MUST_BE_CALLED_BY_COMPLETER,
                completer,
                msg.sender
            );
        _;
    }

    /**
     * Get the disbursement information for given compute option.
     * @param index The given compute option index.
     * @param amount The amount of ASTO to be distributed.
     * @return addresses The addresses to distribute to.
     * @return amounts The amount to distribute to each address.
     * @dev The total amounts must be less or equal to the input amount.
     * @dev This function must return even when a compute option is no longer valid.
     */
    function getComputeOptionDisbursement(uint256 index, uint256 amount)
        public
        view
        override
        validComputeIndex(index)
        returns (address[] memory addresses, uint256[] memory amounts)
    {
        // Completer takes it all
        addresses = new address[](1);
        addresses[0] = completer;
        amounts = new uint256[](1);
        amounts[0] = amount;
        return (addresses, amounts);
    }

    /**
     * Complete a compute request.
     * @param computeId The compute id to update.
     * @notice Only callable by the completer.
     */
    function completeCompute(uint256 computeId)
        external
        override
        onlyCompleter
    {
        return computeRequestManager.completeCompute(computeId);
    }
}
