import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

import { index } from '../accounts.config'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy, getNetworkName } = deployments
  const { brain, signer } = await getNamedAccounts()

  const accounts = await hre.ethers.getSigners()

  const isLocal = getNetworkName() === 'localhost'
  const localDeployer = accounts[index['LOCAL_DEPLOYER']]
  const networkDeployer = accounts[index['DEPLOYER']]
  const deployer = isLocal ? localDeployer : networkDeployer

  if (!deployer || (!isLocal && !brain) || !signer) {
    throw new Error('Missing named accounts')
  }

  const brainAddress = isLocal
    ? (await deployments.get('MockBrain')).address
    : brain

  const contract = await deploy('PongMemoryTree', {
    from: deployer.address,
    args: [brainAddress],
  })

  const pongContractInstance = await hre.ethers.getContractAt(
    'PongMemoryTree',
    contract.address,
  )

  const tx = await pongContractInstance.connect(deployer).setSigner(signer)
  await tx.wait()

  const signerSet = await pongContractInstance.getSigner()

  console.log('[contract] PongMemoryTree deployed to:', contract.address)
  console.log('[contract] PongMemoryTree owner is:', deployer.address)
  console.log('[contract] PongMemoryTree signer set to:', signerSet)
}

func.tags = ['PongMemoryTree', 'all']

export default func
