// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {PongMemoryTree, InvalidBrainAddress} from '../src/PongMemoryTree.sol';
import {MockBrain} from '../src/MockBrain.sol';

import 'protocol-core/contracts/helpers/Errors.sol';
import {IMemoryTree} from 'protocol-core/contracts/interfaces/IMemoryTree.sol';

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import 'forge-std/Test.sol';
import 'forge-std/Vm.sol';

/**
 * Test the Memory Tree contract.
 */
contract MemoryTreeTestContract is DSTest {
    using ECDSA for bytes32;

    MockBrain internal brain1_;
    MockBrain internal brain2_;
    PongMemoryTree internal tree_;

    address internal brain1;
    address internal brain2;
    address internal tree;

    // Cheat codes are state changing methods called from the address:
    // 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D
    Vm internal vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
    address internal user1 = 0xA847d497b38B9e11833EAc3ea03921B40e6d847c;
    address internal user2 = 0x43cDF1c92eaF45564DB9AD06B22b7A121F7491C2;

    // Random key. DO NOT USE IN A PRODUCTION ENVIRONMENT
    uint256 private pk =
        0xabfa816b2d044fca73f609721c7811b3876e69f915a5398bdb88b3ce5bf28a61;

    // Events copied from IMemoryTree.sol
    event MemoryNodeAdded(
        address brainAddress,
        uint256 brainId,
        uint256 nodeId,
        bytes32 nodeHash
    );

    function setUp() public virtual {
        deployContracts();
        setupContracts();
        setupWallets();
    }

    function deployContracts() internal {
        brain1_ = new MockBrain();
        brain1 = address(brain1_);
        brain2_ = new MockBrain();
        brain2 = address(brain2_);

        // Memory Tree
        tree_ = new PongMemoryTree(brain1);
        tree = address(tree_);
    }

    function setupContracts() internal {
        tree_.setSigner(vm.addr(pk));
    }

    function setupWallets() internal {
        // Give 10 ETH
        vm.deal(address(this), 10e18);
        vm.deal(user1, 10e18);
        vm.deal(user2, 10e18);

        // Give Brains
        vm.prank(user1);
        brain1_.faucet();
        vm.prank(user2);
        brain1_.faucet();
        vm.prank(user1);
        brain2_.faucet();
    }

    /** ----------------------------------
     * ! Public functions
     * ----------------------------------- */

    function test_addMemoryTree() public {
        // Not authorised
        vm.startPrank(user2);
        vm.expectRevert(
            abi.encodeWithSelector(
                Errors.InvalidCaller.selector,
                'Must be called by owner', // FIXME Errors.MUST_BE_CALLED_BY_OWNER,
                user1,
                user2
            )
        );
        tree_.addMemoryTree(
            brain1,
            0,
            'xyz',
            'abc',
            _sign(
                abi.encodePacked(brain1, uint256(0), bytes32('xyz'), 'abc'),
                pk
            )
        );
        vm.stopPrank();

        // Wrong contract
        vm.startPrank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(InvalidBrainAddress.selector, brain1, brain2)
        );
        tree_.addMemoryTree(
            brain2,
            0,
            'xyz',
            'abc',
            _sign(
                abi.encodePacked(brain2, uint256(0), bytes32('xyz'), 'abc'),
                pk
            )
        );
        vm.stopPrank();

        // Happy path
        uint256 treeId;
        uint256 nodeId;
        vm.startPrank(user1);
        vm.expectEmit(true, true, true, true);
        emit MemoryNodeAdded(brain1, uint256(0), uint256(0), bytes32('xyz'));
        (treeId, nodeId) = tree_.addMemoryTree(
            brain1,
            0,
            'xyz',
            'abc',
            _sign(
                abi.encodePacked(brain1, uint256(0), bytes32('xyz'), 'abc'),
                pk
            )
        );
        vm.stopPrank();
        IMemoryTree.MemoryTreeDetails memory details = tree_
            .getMemoryTreeDetails(treeId);
        IMemoryTree.MemoryNode memory node = tree_.getMemoryNode(nodeId);

        assertEq(details.brainAddress, brain1, 'Wrong brain address');
        assertEq(details.brainId, 0, 'Wrong brain id');
        assertEq(details.rootNodes[0], nodeId, 'Wrong root node id');
        assertEq(node.children.length, 0, 'Has children');
        assertEq(node.storageURI, 'abc', 'Wrong storage URI');
    }

    function test_addNode() public {
        uint256 treeId;
        uint256 nodeId;
        uint256 parentNodeId;

        vm.startPrank(user1);
        (treeId, parentNodeId) = tree_.addMemoryTree(
            brain1,
            0,
            'xyz',
            'abc',
            _sign(
                abi.encodePacked(brain1, uint256(0), bytes32('xyz'), 'abc'),
                pk
            )
        );
        vm.stopPrank();

        // Not authorised
        vm.startPrank(user2);
        vm.expectRevert(
            abi.encodeWithSelector(
                Errors.InvalidCaller.selector,
                'Must be called by owner', // FIXME Errors.MUST_BE_CALLED_BY_OWNER,
                user1,
                user2
            )
        );
        tree_.addNode(
            parentNodeId,
            'xyz',
            'def',
            _sign(abi.encodePacked(parentNodeId, bytes32('xyz'), 'def'), pk)
        );
        vm.stopPrank();

        // Happy path
        vm.startPrank(user1);
        vm.expectEmit(true, true, true, true);
        emit MemoryNodeAdded(brain1, uint256(0), uint256(1), bytes32('xyz'));
        nodeId = tree_.addNode(
            parentNodeId,
            bytes32('xyz'),
            'def',
            _sign(abi.encodePacked(parentNodeId, bytes32('xyz'), 'def'), pk)
        );
        vm.stopPrank();

        IMemoryTree.MemoryNode memory result = tree_.getMemoryNode(nodeId);
        assertEq(result.children.length, 0, 'Has children');
        assertEq(result.storageURI, 'def', 'Wrong storage URI');

        result = tree_.getMemoryNode(parentNodeId);
        assertEq(result.children.length, 1, "Doesn't have children");
        assertEq(result.children[0], nodeId, 'Wrong child id');
        assertEq(result.storageURI, 'abc', 'Wrong storage URI');
    }

    //
    // Helpers
    //

    function bytesToBytes32(bytes memory b) private pure returns (bytes32) {
        bytes32 out;

        for (uint256 i = 0; i < 32; i++) {
            out |= bytes32(b[i] & 0xFF) >> (i * 8);
        }
        return out;
    }

    function _sign(bytes memory data, uint256 _pk)
        internal
        view
        returns (bytes memory)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;
        (v, r, s) = vm.sign(_pk, keccak256(data).toEthSignedMessageHash());
        return abi.encodePacked(r, s, v);
    }
}
