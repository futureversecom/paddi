import dotenv from 'dotenv'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

dotenv.config()

const challengeFeeBasis = process.env['CHALLENGE_FEE_BASIS'] ?? 0

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy, getNetworkName } = deployments
  const { deployer, asto, challengeCollector, challengeSigner } =
    await getNamedAccounts()

  const isLocal = getNetworkName() === 'localhost'

  if (
    !deployer ||
    (!isLocal && !asto) ||
    !challengeCollector ||
    !challengeSigner
  ) {
    throw new Error('Missing named accounts')
  }

  const astoAddress = isLocal
    ? (await deployments.get('MockASTO')).address
    : asto

  const contract = await deploy('Challenge', {
    from: deployer,
    args: [astoAddress, challengeSigner, challengeCollector, challengeFeeBasis],
  })

  console.log('[contract] Challenge deployed to:', contract.address)
}

func.tags = ['Challenge', 'all']

export default func
