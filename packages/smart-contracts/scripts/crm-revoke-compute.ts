/* eslint-disable @typescript-eslint/await-thenable */
import type { BigNumber } from 'ethers'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import abi from '../abi/ComputeRequestManager.json'
import { index } from '../accounts.config'
import type { ComputeRequestManager } from '../lib/protocol-core/gen'

const request = async (hre: HardhatRuntimeEnvironment, id: BigNumber) => {
  const accounts = await hre.ethers.getSigners()
  const { computeRequestManager } = await hre.getNamedAccounts()
  const user = accounts[index['USER_1']]

  if (!computeRequestManager || !user) {
    throw new Error('Missing account address')
  }

  const crm = (await hre.ethers.getContractAt(
    abi,
    computeRequestManager,
  )) as ComputeRequestManager
  await crm.connect(user).revokeCompute(id)
}

task('crm-revoke-compute', 'Revoke compute request')
  .addParam('id', 'Compute ID')
  .setAction(async ({ id }, hre) => {
    await request(hre, id)
  })
