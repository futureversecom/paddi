// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * A mock implementation of the ASTO ERC20 contract.
 * This contract allows unlimited minting by any caller.
 */
contract MockASTO is ERC20 {
  uint256 public constant FAUCET_AMOUNT = 100 * 10 ** 18;

  constructor() ERC20("Altered State Machine Utility Token", "ASTO") {}

  function faucet() external {
    _mint(msg.sender, FAUCET_AMOUNT);
  }

  function faucetTo(address to) external {
    _mint(to, FAUCET_AMOUNT);
  }
}
