/* eslint-disable @typescript-eslint/await-thenable */
import type { BigNumber } from 'ethers'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import abi from '../abi/PongMemoryTree.json'
import type { PongMemoryTree } from '../typechain-types'

const request = async (hre: HardhatRuntimeEnvironment, id: BigNumber) => {
  const pongAddress = (await hre.deployments.get('PongMemoryTree')).address
  const pongMT = (await hre.ethers.getContractAt(
    abi,
    pongAddress,
  )) as PongMemoryTree

  return pongMT.memoryNodesOfMemoryTree(id)
}

task('mt-get-tree', 'Get memory tree')
  .addParam('id', 'Tree ID')
  .setAction(async ({ id }, hre) => {
    const tree = await request(hre, id)
    console.log(tree)
  })
