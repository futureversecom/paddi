/* eslint-disable @typescript-eslint/await-thenable */
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import abi from '../abi/MemoryTree.json'
import { index } from '../accounts.config'
import type { PongMemoryTree } from '../typechain-types'

const setSigner = async (hre: HardhatRuntimeEnvironment, signer: string) => {
  const { getSigners } = hre.ethers
  const mtAddress = (await hre.deployments.get('PongMemoryTree')).address
  const isLocal = hre.deployments.getNetworkName() === 'localhost'
  const mt = (await hre.ethers.getContractAt(abi, mtAddress)) as PongMemoryTree
  const accounts = await getSigners()
  const owner = isLocal
    ? accounts[index['LOCAL_DEPLOYER']]
    : accounts[index['DEPLOYER']]

  if (!owner) {
    throw new Error('Missing owner/deployer address')
  }

  await mt.connect(owner).setSigner(signer)
  return mt.getSigner()
}

task('mt-set-signer', 'Set a new signer for the MemoryTree contract')
  .addParam('signer', 'New signer address')
  .setAction(async ({ signer }, hre) => {
    const data = await setSigner(hre, signer)
    console.log(data)
  })
