/* eslint-disable @typescript-eslint/await-thenable */
import type { BigNumber } from 'ethers'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import { index } from '../accounts.config'

const sign = async (
  hre: HardhatRuntimeEnvironment,
  type: string,
  brain: string,
  id: BigNumber,
  studio: string,
  storage: string,
) => {
  const { getSigners, utils } = hre.ethers
  const accounts = await getSigners()
  const signer = accounts[index['SIGNER']]

  if (!signer) {
    throw new Error('Missing signer')
  }

  const isTree = type === 'tree'
  const brainAddress = brain ?? (await hre.deployments.get('MockBrain')).address // deployed Brain contract if not provided
  const brainType = isTree ? ['address'] : []
  const brainValue = isTree ? [brainAddress] : []

  const types = [...brainType, 'uint256', 'bytes32', 'string']
  const values = [...brainValue, id, utils.formatBytes32String(studio), storage]

  const encoded = utils.solidityKeccak256(types, values) // packed hash / no padding zeroes
  const message = utils.arrayify(encoded)

  const signature = await signer.signMessage(message)
  const cli = isTree
    ? `npx hardhat mt-add-tree --network localhost --brain ${brainAddress} --id ${id} --studio ${studio} --storage ${storage} --signature ${signature}`
    : `npx hardhat mt-add-node --network localhost --id ${id} --studio ${studio} --storage ${storage} --signature ${signature}`

  return { signer: signer.address, signature, cli }
}

task(
  'gen-signature',
  'Generate a signature for minting TNL Pro character with bag',
)
  .addParam('type', 'Type to add (node or tree)')
  .addOptionalParam('brain', 'Address of the Brain contract')
  .addParam('id', 'Parent node ID or Brain token id')
  .addParam('studio', 'Studio name')
  .addParam('storage', 'Storage URI')
  .setAction(async ({ type, brain, id, studio, storage }, hre) => {
    const res = await sign(hre, type, brain, id, studio, storage)
    console.log(res)
  })
