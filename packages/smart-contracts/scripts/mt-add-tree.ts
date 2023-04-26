/* eslint-disable @typescript-eslint/await-thenable */
import type { BigNumber, BytesLike } from 'ethers'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import abi from '../abi/PongMemoryTree.json'
import { index } from '../accounts.config'
import type { PongMemoryTree } from '../typechain-types'

const addTree = async (
  hre: HardhatRuntimeEnvironment,
  brainAddress: string,
  brainId: BigNumber,
  studio: string,
  storage: string,
  signature: BytesLike,
) => {
  const { getSigners, utils } = hre.ethers
  const pongAddress = (await hre.deployments.get('PongMemoryTree')).address
  const pongMT = (await hre.ethers.getContractAt(
    abi,
    pongAddress,
  )) as unknown as PongMemoryTree
  const hash = utils.formatBytes32String(studio)
  const accounts = await getSigners()
  const user = accounts[index['USER_1']]

  if (!user) {
    throw new Error('Missing user address')
  }

  const tx = await pongMT
    .connect(user)
    .addMemoryTree(brainAddress, brainId, hash, storage, signature)

  const res = await tx.wait()
  const { events: args } = res

  const [, , nodeId] = args?.[0]?.args ?? []

  return nodeId
}

task('mt-add-tree', 'Store a new tree in the MemoryTree contract')
  .addParam('brain', 'Brain contract address')
  .addParam('id', 'Brain token ID')
  .addParam('studio', 'Node hash')
  .addParam('storage', 'Storage URI')
  .addParam('signature', 'Signature')
  .setAction(async ({ brain, id, studio, storage, signature }, hre) => {
    const nodeId = await addTree(hre, brain, id, studio, storage, signature)
    console.log({ nodeId })
  })
