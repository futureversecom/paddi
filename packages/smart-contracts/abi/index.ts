import { abis as CoreProtocolAbis } from 'smart-contracts/lib/protocol-core/abi'

import GasFaucet from './GasFaucet.json'
import MockASTO from './MockASTO.json'
import MockBrain from './MockBrain.json'
import PongComputeManager from './PongComputeManager.json'
import PongMemoryTree from './PongMemoryTree.json'

// Note: Only deployed to Porcini
const abis = {
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
  ComputeRequestManager: {
    contract: CoreProtocolAbis.porcini.contracts.ComputeRequestManager.abi,
    address: CoreProtocolAbis.porcini.contracts.ComputeRequestManager.address,
  },
  // Same for every env
  GasFaucet: {
    contract: GasFaucet,
    address: '0x0aB63E2Ee930f9b1dC789Daad1E3Eb60DD77588d',
  },
} as const

const abisProd = {
  MockASTO: {
    contract: MockASTO,
    address: '0x68536d0CeFd947456e607B8a49C6E1747405b098',
  },
  MockBrain: {
    contract: MockBrain,
    address: '0x596371D37075870E43782AdDf4B13b2FE22316ff',
  },
  PongMemoryTree: {
    contract: PongMemoryTree,
    address: '0x2B7aDa6cBaB4B816C47D3221b63Db4DAe77e6b0b',
  },
  PongComputeManager: {
    contract: PongComputeManager,
    address: '0x739732160C360f68ECDFD5D5b970739072F28ACE',
  },
  ComputeRequestManager: {
    contract: CoreProtocolAbis.porcini.contracts.ComputeRequestManager.abi,
    address: '0x1bb487Ea6029cF6070c47F8d91cBc83835759919',
  },
} as const

const abisStaging = {
  MockASTO: {
    contract: MockASTO,
    address: '0xF993aBa02B5dd4B00010FE180118575A8C294CD3',
  },
  MockBrain: {
    contract: MockBrain,
    address: '0x552E903997E5760C8F083040Bc380809c33a00De',
  },
  PongMemoryTree: {
    contract: PongMemoryTree,
    address: '0x8476DE55Ffd0b0c7E275c84D93B49f558F536018',
  },
  PongComputeManager: {
    contract: PongComputeManager,
    address: '0x41F91b49c002e5Db92145A83C37904521EAD85c9',
  },
  ComputeRequestManager: {
    contract: CoreProtocolAbis.porcini.contracts.ComputeRequestManager.abi,
    address: '0x0884B6de62Ab7D92b9A54740aBccBea5929f8741',
  },
} as const

export const getAbis = (env: string) => {
  if (env === 'prod') {
    return Object.assign({}, abis, abisProd)
  }
  if (env === 'staging') {
    return Object.assign({}, abis, abisStaging)
  }
  // default to dev
  return abis
}
