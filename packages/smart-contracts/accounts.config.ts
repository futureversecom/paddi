import dotenv from 'dotenv'

dotenv.config()

const contracts = (network: any) => ({
  asto: process.env[`${network}_ASTO_CONTRACT`]!,
  brain: process.env[`${network}_BRAIN_CONTRACT`]!,
  crm: process.env[`${network}_CRM_CONTRACT`]!,
})

const envs: string[] = [
  'DEPLOYER',
  'LOCAL_DEPLOYER',
  'SIGNER',
  'CHALLENGE_SIGNER',
  'CHALLENGE_COLLECTOR',
  'USER_1',
  'USER_2',
  'CRM_MANAGER',
]

const getPK = (name: string) => {
  const pk = process.env[name + '_PK']
  if (pk) return pk
  else throw new Error(`Unknown private key: ${name}`)
}

const getAddress = (name: string) => {
  const address = process.env[name]
  if (address) return address
  else throw new Error(`Unknown address: ${name}`)
}

const accounts = envs.map(getPK)
const addr = envs.map(getAddress)
const indexByAccount = envs.reduce(
  (acc: any, name: string, i: number) => ({ ...acc, [name]: i }),
  {},
)

const namedAccounts = {
  asto: {
    localhost: null,
    porcini: contracts('PORCINI')['asto'] ?? null,
    goerli: contracts('GOERLI')['asto'] ?? null,
  },
  brain: {
    localhost: null,
    porcini: contracts('PORCINI')['brain'] ?? null,
    goerli: contracts('GOERLI')['brain'] ?? null,
  },
  computeRequestManager: {
    localhost: contracts('PORCINI')['crm'] ?? null,
    porcini: contracts('PORCINI')['crm'] ?? null,
    goerli: contracts('GOERLI')['crm'] ?? null,
  },
  deployer: {
    localhost: addr[1] ?? '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // from the local hardhat node
    porcini: addr[0] ?? null,
    goerli: addr[0] ?? null,
  },
  signer: {
    localhost: addr[2] ?? '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    porcini: addr[2] ?? null,
    goerli: addr[2] ?? null,
  },
  challengeSigner: {
    localhost: addr[3] ?? '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    porcini: addr[3] ?? null,
    goerli: addr[3] ?? null,
  },
  challengeCollector: {
    localhost: addr[4] ?? '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    porcini: addr[4] ?? null,
    goerli: addr[4] ?? null,
  },
  user1: {
    localhost: addr[5] ?? '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    porcini: addr[5] ?? null,
    goerli: addr[5] ?? null,
  },
  user2: {
    localhost: addr[6] ?? '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    porcini: addr[6] ?? null,
    goerli: addr[6] ?? null,
  },
  manager: {
    localhost: null,
    porcini: addr[7] ?? null,
    goerli: addr[7] ?? null,
  },
}

const index = {
  LOCAL_DEPLOYER: indexByAccount['LOCAL_DEPLOYER'],
  DEPLOYER: indexByAccount['DEPLOYER'],
  SIGNER: indexByAccount['SIGNER'],
  CHALLENGE_SIGNER: indexByAccount['CHALLENGE_SIGNER'],
  CHALLENGE_COLLECTOR: indexByAccount['CHALLENGE_COLLECTOR'],
  USER_1: indexByAccount['USER_1'],
  USER_2: indexByAccount['USER_2'],
  CRM_MANAGER: indexByAccount['CRM_MANAGER'],
}

export { accounts, namedAccounts, index, contracts }
