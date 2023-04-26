// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {MemoryTreeEnumerable} from 'protocol-core/contracts/samples/MemoryTreeEnumerable.sol';

error InvalidBrainAddress(address expected, address actual);

/**
 * An implementation of the Memory Tree interface for Pong.
 * This implementation ensures only one brain address is used.
 */
contract PongMemoryTree is MemoryTreeEnumerable {
    address private immutable BRAIN_ADDRESS;

    constructor(address brainAddress) {
        BRAIN_ADDRESS = brainAddress;
    }

    /**
     * Add a root node to create a new memory tree for a given brain.
     * @param brainAddress The address of the brain contract to run compute against.
     * @param brainId The token id for the brain to run compute against.
     * @param nodeHash A studio identifier for this node.
     * @param storageURI The storage URI for the new node.
     * @param signature Function parameters hashed and signed by the signer.
     * @return treeId The new tree id.
     * @return nodeId The new node id.
     */
    function addMemoryTree(
        address brainAddress,
        uint256 brainId,
        bytes32 nodeHash,
        string memory storageURI,
        bytes calldata signature
    ) public override returns (uint256 treeId, uint256 nodeId) {
        if (brainAddress != BRAIN_ADDRESS)
            revert InvalidBrainAddress(BRAIN_ADDRESS, brainAddress);
        return
            super.addMemoryTree(
                brainAddress,
                brainId,
                nodeHash,
                storageURI,
                signature
            );
    }
}
