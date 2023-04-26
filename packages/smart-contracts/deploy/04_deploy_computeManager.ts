import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, computeRequestManager, user2 } = await getNamedAccounts()

  if (!deployer || !computeRequestManager || !user2) {
    throw new Error('Missing named accounts')
  }

  const contract = await deploy('PongComputeManager', {
    from: deployer,
    args: [computeRequestManager, user2], // challenge completers will be user2
  })

  console.log('[contract] PongComputeManager deployed to:', contract.address)
}

func.tags = ['PongComputeManager', 'all']

export default func
