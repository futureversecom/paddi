import { ethers } from 'hardhat'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

import abiASTO from '../abi/MockASTO.json'
import abiBrain from '../abi/MockBrain.json'
import { index } from '../accounts.config'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { getNetworkName, get } = deployments
  const { user1, user2, asto, brain } = await getNamedAccounts()

  const isLocal = getNetworkName() === 'localhost'

  const accounts = await hre.ethers.getSigners()
  const localDeployer = accounts[index['LOCAL_DEPLOYER']]
  const networkDeployer = accounts[index['DEPLOYER']]
  const deployer = isLocal ? localDeployer : networkDeployer

  if (!deployer || !user1 || !user2) {
    throw new Error('Missing named accounts')
  }

  let astoAddress, brainAddress

  if (isLocal) {
    astoAddress = (await get('MockASTO')).address
    brainAddress = (await get('MockBrain')).address

    /** ---------------------------------------------------------
     * Distribute some XRPs from the `deployer` acc to the users
     * ---------------------------------------------------------*/

    await deployer.sendTransaction({
      to: user1,
      value: ethers.utils.parseEther('200.0'),
    })

    await deployer.sendTransaction({
      to: user2,
      value: ethers.utils.parseEther('100.0'),
    })
  } else {
    if (!asto || !brain) {
      throw new Error('Missing named accounts')
    }
    astoAddress = asto
    brainAddress = brain
  }

  /** ---------------------------------------------------------
   * Distribute some ASTO and Brain tokens to the users
   * ---------------------------------------------------------*/

  const astoContract = await ethers.getContractAt(abiASTO, astoAddress)
  const brainContract = await ethers.getContractAt(abiBrain, brainAddress)

  let tx

  tx = await astoContract.connect(deployer)['faucet']()
  await tx.wait()

  tx = await astoContract.connect(deployer)['faucetTo'](user1)
  await tx.wait()

  tx = await astoContract.connect(deployer)['faucetTo'](user2)
  await tx.wait()

  tx = await brainContract.connect(deployer)['faucetTo'](user1)
  tx.wait()

  tx = await brainContract.connect(deployer)['faucetTo'](user2)
  tx.wait()

  const user1ASTO = await astoContract.connect(deployer)['balanceOf'](user1)
  const user2ASTO = await astoContract.connect(deployer)['balanceOf'](user2)
  const deployerASTO = await astoContract
    .connect(deployer)
    ['balanceOf'](deployer.address)

  const user1BrainIds = await brainContract
    .connect(deployer)
    ['tokensOfOwner'](user1)
  const user2BrainIds = await brainContract
    .connect(deployer)
    ['tokensOfOwner'](user2)

  const provider = new ethers.providers.JsonRpcProvider()
  const deployerXRP = await provider.getBalance(deployer.address)
  const user1XRP = await provider.getBalance(user1)
  const user2XRP = await provider.getBalance(user2)

  console.log(
    `[balances]   user1 (${user1}):`,
    `${ethers.utils.formatEther(user1ASTO)} ASTO |`,
    `${user1XRP} XRP |`,
    `Brain(s) with IDs: [${user1BrainIds}]`,
  )
  console.log(
    `[balances]   user2 (${user2}):`,
    `${ethers.utils.formatEther(user2ASTO)} ASTO |`,
    `${user2XRP} XRP |`,
    `Brain(s) with IDs: [${user2BrainIds}]`,
  )
  console.log(
    `[balances] deployer:`,
    `${ethers.utils.formatEther(deployerASTO)} ASTO |`,
    `${deployerXRP} XRP |`,
    `Brain(s) with IDs: n/a`,
  )
}

func.tags = ['topup', 'all']

export default func
