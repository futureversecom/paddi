// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {GasFaucet, AlreadySent, InsufficientBalance} from "../src/GasFaucet.sol";

contract GasFaucetTest is Test {
  GasFaucet public faucet;
  address payable addr = payable(0x86599B800E23036D761f43D7516092447295659f); // Random address for testing
  address payable addr2 = payable(0x823556202e86763853b40e9cDE725f412e294689); // Random address for testing

  function setUp() public {
    faucet = new GasFaucet();

    vm.deal(address(this), 1000 * 10e18);
    payable(faucet).transfer(200 * 10e18);
  }

  function testFaucet() public {
    uint256 beforeBal = addr.balance;
    faucet.faucet(addr);
    assertEq(addr.balance, beforeBal + faucet.FAUCET_AMOUNT());
  }

  function testFaucetBlocks() public {
    faucet.faucet(addr);

    vm.expectRevert(AlreadySent.selector);
    faucet.faucet(addr);
  }

  function testFaucetDoesntBlockTwo() public {
    faucet.faucet(addr);
    faucet.faucet(addr2);
  }

  function testFaucetUnblocks() public {
    faucet.faucet(addr);

    vm.roll(block.number + faucet.BLOCK_DELAY() + 1);
    uint256 beforeBal = addr.balance;
    faucet.faucet(addr);
    assertEq(addr.balance, beforeBal + faucet.FAUCET_AMOUNT());
  }
}
