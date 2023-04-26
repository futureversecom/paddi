/* eslint-disable @typescript-eslint/await-thenable */
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import abi from '../abi/ComputeRequestManager.json'
import { index } from '../accounts.config'
import type { ComputeRequestManager } from '../lib/protocol-core/gen'

const request = async (hre: HardhatRuntimeEnvironment, pause: string) => {
  const accounts = await hre.ethers.getSigners()
  const { computeRequestManager } = await hre.getNamedAccounts()
  const manager = accounts[index['CRM_MANAGER']]

  if (!computeRequestManager || !manager) {
    throw new Error('Missing account address')
  }

  const crm = (await hre.ethers.getContractAt(
    abi,
    computeRequestManager,
  )) as ComputeRequestManager

  const tx =
    pause === 'true'
      ? await crm.connect(manager).pause()
      : await crm.connect(manager).unpause()

  await tx.wait()
}

task('crm-pause', '(un)Pause the CRM contract')
  .addParam('pause', 'True/false')
  .setAction(async ({ pause }, hre) => {
    await request(hre, pause)
  })
