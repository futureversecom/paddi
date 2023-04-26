/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BigNumber, BytesLike } from 'ethers'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import abi from '../abi/MemoryTree.json'
import { index } from '../accounts.config'

const addNode = async (
  hre: HardhatRuntimeEnvironment,
  id: BigNumber,
  studio: string,
  storage: string,
  signature: BytesLike,
) => {
  const pongAddress = (await hre.deployments.get('PongMemoryTree')).address
  const pongMT = await hre.ethers.getContractAt(abi, pongAddress)
  const hash = hre.ethers.utils.formatBytes32String(studio)
  const accounts = await hre.ethers.getSigners()
  const user = accounts[index['USER_1']]

  if (!user) {
    throw new Error('Missing signer')
  }

  const tx = await pongMT.connect(user)['addNode'](id, hash, storage, signature)
  return tx.wait()
}

task('mt-add-node', 'Save a new node in the MemoryTree contract')
  .addParam('id', 'Parent node ID')
  .addParam('studio', 'Node hash')
  .addParam('storage', 'Storage URI')
  .addParam('signature', 'Signature')
  .setAction(async ({ id, studio, storage, signature }, hre) => {
    const { events } = await addNode(hre, id, studio, storage, signature)
    const { brainId, nodeId } = events
    console.log({ nodeId })
  })
