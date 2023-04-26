// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {MockBrain} from "../src/MockBrain.sol";

contract MockBrainTest is Test {
  MockBrain public brain;

  function setUp() public {
    brain = new MockBrain();
  }

  function testFaucet() public {
    assertEq(brain.balanceOf(address(this)), uint256(0));
    brain.faucet();
    assertEq(brain.balanceOf(address(this)), uint256(1));
  }

  function testTokenURI() public {
    assertEq(
      brain.tokenURI(0),
      "https://meta.gen-ii-brains.alteredstatemachine.xyz/ipfs/QmaakG6REBqYB7BieQC54RtkarXy5ePb8TyyK1ahJprPkt"
    );
    assertEq(
      brain.tokenURI(1),
      "https://meta.gen-ii-brains.alteredstatemachine.xyz/ipfs/Qmc32uFGqee9hFa5BwWMwNyLhXqS46cdAr5Ch4ihgVGn9b"
    );
    assertEq(
      brain.tokenURI(100),
      "https://meta.gen-ii-brains.alteredstatemachine.xyz/ipfs/QmaakG6REBqYB7BieQC54RtkarXy5ePb8TyyK1ahJprPkt"
    ); // Repeat
  }
}
