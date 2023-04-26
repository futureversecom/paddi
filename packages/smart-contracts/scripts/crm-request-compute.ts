/* eslint-disable @typescript-eslint/await-thenable */
import type { BigNumber } from 'ethers'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import abi from '../abi/ComputeRequestManager.json'
import { index } from '../accounts.config'
import type { ComputeRequestManager } from '../lib/protocol-core/gen'

const request = async (
  hre: HardhatRuntimeEnvironment,
  option: BigNumber,
  units: number,
  studio: string,
) => {
  const { getSigners, getContractAt, utils } = hre.ethers
  const accounts = await getSigners()
  const user = accounts[index['USER_1']]
  const { computeRequestManager } = await hre.getNamedAccounts()

  if (!computeRequestManager || !user) {
    throw new Error('Missing account address')
  }

  const pcm = (await hre.deployments.get('PongComputeManager')).address
  const crm = await getContractAt(abi, computeRequestManager)
  const hash = await utils.formatBytes32String(studio)

  const tx = await (crm as ComputeRequestManager)
    .connect(user)
    .requestCompute(pcm, option, units, hash)
  const res = await tx.wait()
  return res.events
}

task('crm-request-compute', 'Set a new signer for the MemoryTree contract')
  .addParam('option', 'Option ID')
  .addParam('units', 'Units to spend')
  .addParam('studio', 'Studio identifier')
  .setAction(async ({ option, units, studio }, hre) => {
    const id = await request(hre, option, units, studio)
    console.log(id)
  })
