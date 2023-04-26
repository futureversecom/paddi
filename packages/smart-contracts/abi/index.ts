import { abis as CoreProtocolAbis } from 'smart-contracts/lib/protocol-core/abi'

import Challenge from './Challenge.json'
import GasFaucet from './GasFaucet.json'
import MockASTO from './MockASTO.json'
import MockBrain from './MockBrain.json'
import PongComputeManager from './PongComputeManager.json'
import PongMemoryTree from './PongMemoryTree.json'

// Note: Only deployed to Porcini
export const abis = {
  GasFaucet: {
    contract: GasFaucet,
    address: '0x0aB63E2Ee930f9b1dC789Daad1E3Eb60DD77588d',
  },
  MockASTO: {
    contract: MockASTO,
    address: '0x16D18C99D1B4deC3e36b64ba9159865e7B990eD1',
  },
  MockBrain: {
    contract: MockBrain,
    address: '0x4731C327B0542d7208f5AEa561146cdEC259E0D0',
  },
  PongMemoryTree: {
    contract: PongMemoryTree,
    address: '0x3c6B1207A4edd8c335B786B8962eCdB93983D3c4',
  },
  PongComputeManager: {
    contract: PongComputeManager,
    address: '0x3467b8426c04131BA93A783abea67BCB429a7F83',
  },
  Challenge: {
    contract: Challenge,
    address: '0x3b022B73Cc957015e6aD194AABF44Aa2aE8eb4E9',
  },
  ComputeRequestManager: {
    contract: CoreProtocolAbis.porcini.contracts.ComputeRequestManager.abi,
    address: CoreProtocolAbis.porcini.contracts.ComputeRequestManager.address,
  },
} as const
