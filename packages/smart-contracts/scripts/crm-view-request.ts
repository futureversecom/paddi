/* eslint-disable @typescript-eslint/await-thenable */
import type { BigNumber } from 'ethers'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import abi from '../abi/ComputeRequestManager.json'
import { contracts } from '../accounts.config'
import type { ComputeRequestManager } from '../lib/protocol-core/gen'

const getRequest = async (hre: HardhatRuntimeEnvironment, id: BigNumber) => {
  const network = await hre.deployments.getNetworkName()

  // for localhost we use the PORCINI contract addresses
  const computeRequestManager =
    contracts(network)['crm'] ?? contracts('PORCINI')['crm'] ?? null

  if (!computeRequestManager) {
    throw new Error('Missing CRM_CONTRACT')
  }

  const crm = (await hre.ethers.getContractAt(
    abi,
    computeRequestManager,
  )) as ComputeRequestManager

  const manager = await crm.getComputeRequestComputeManagerInfo(id)
  const timing = await crm.getComputeRequestTimingInfo(id)
  const user = await crm.getComputeRequestUserInfo(id)
  const isExpired = await crm['isComputeRequestSLAExpired(uint256)'](id)
  const isOpen = await crm.isComputeRequestOpen(id)
  return { isOpen, isExpired, manager, user, timing }
}

task(
  'crm-view-request',
  'Get user, manager, timing, SLA, and status info for a given compute request',
)
  .addParam('id', 'Compute request ID')
  .setAction(async ({ id }, hre) => {
    const data = await getRequest(hre, id)
    console.log({ id, data })
  })
