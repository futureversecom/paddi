// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {MockASTO} from "../src/MockASTO.sol";

contract MockASTOTest is Test {
  MockASTO public asto;

  function setUp() public {
    asto = new MockASTO();
  }

  function testFaucet() public {
    assertEq(asto.balanceOf(address(this)), uint256(0));
    asto.faucet();
    assertEq(asto.balanceOf(address(this)), asto.FAUCET_AMOUNT());
  }
}
