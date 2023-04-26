import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { getNetworkName, deploy } = deployments
  const { deployer, brain } = await getNamedAccounts()

  if (!deployer) {
    throw new Error('Missing named accounts')
  }

  if (getNetworkName() === 'localhost') {
    await deploy('MockBrain', { from: deployer })

    console.log(
      '[contract] MockBrain deployed to:',
      (await deployments.get('MockBrain')).address,
    )
  } else {
    if (!brain) {
      throw new Error('Missing named accounts')
    }
    console.log('[contract] Brain contract was already deployed at: ', brain)
  }
}

func.tags = ['Brain', 'all']

export default func
