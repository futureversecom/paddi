import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { getNetworkName, deploy } = deployments
  const { deployer, asto } = await getNamedAccounts()

  if (!deployer) {
    throw new Error('Missing named accounts')
  }

  if (getNetworkName() === 'localhost') {
    await deploy('MockASTO', { from: deployer })

    console.log(
      '[contract] MockASTO deployed to:',
      (await deployments.get('MockASTO')).address,
    )
  } else {
    if (!asto) {
      throw new Error('Missing named accounts')
    }
    console.log('[contract] ASTO contract was already deployed at: ', asto)
  }
}

func.tags = ['ASTO', 'all']

export default func
