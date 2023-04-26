// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

error AlreadySent();
error InsufficientBalance();
error TransferFailed();

/**
 * A contract that allows claiming of gas.
 */
contract GasFaucet {
  uint256 public constant FAUCET_AMOUNT = 10e18;
  uint256 public constant BLOCK_DELAY = 10;

  mapping(address => uint256) sent;

  // Allow receiving gas
  receive() external payable {}

  /**
   * Claim the gas token
   * @notice Requires that no funds have been sent to the address during the last N blocks
   */
  function faucet(address addr) external {
    if (getBalance() < FAUCET_AMOUNT) {
      revert InsufficientBalance();
    }
    uint256 blockNumber = block.number;
    uint256 lastSent = sent[addr];
    uint256 blocksPassed = blockNumber - lastSent;

    bool hasSent = lastSent > 0;
    bool recently = blocksPassed <= BLOCK_DELAY;
    if (hasSent && recently) {
      revert AlreadySent();
    }
    sent[addr] = blockNumber;

    bool success = payable(addr).send(FAUCET_AMOUNT);
    if (!success) {
      revert TransferFailed();
    }
  }

  function getBalance() public view returns (uint256) {
    return payable(address(this)).balance;
  }
}
