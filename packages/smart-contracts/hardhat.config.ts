/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'hardhat-preprocessor'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
import './scripts/crm-view-request'
import './scripts/gen-signature'
import './scripts/mt-add-node'
import './scripts/mt-add-tree'
import './scripts/mt-get-tree'
import './scripts/mt-set-signer'
import './scripts/crm-request-compute'
import './scripts/crm-revoke-compute'
import './scripts/crm-complete-compute'
import './scripts/crm-pause'

import fs from 'fs'
import type { HardhatUserConfig } from 'hardhat/config'

import { accounts, namedAccounts } from './accounts.config'

function getRemappings() {
  return fs
    .readFileSync('remappings.txt', 'utf8')
    .split('\n')
    .filter(Boolean) // remove empty lines
    .map((line: string) => line.trim().split('='))
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // https://book.getfoundry.sh/config/hardhat
  preprocess: {
    eachLine: () => ({
      transform: (line: string) => {
        if (line.match(/["'].*.sol["'];$/)) {
          // match all lines with `"<any-import-path>.sol";`
          for (const [from, to] of getRemappings()) {
            if (line.includes(from!)) {
              line = line.replace(from!, to!)
              break
            }
          }
        }
        return line
      },
    }),
  },
  paths: {
    sources: './src',
    cache: './cache_hardhat',
  },
  gasReporter: {
    enabled: !!process.env['REPORT_GAS'],
    currency: 'USD',
  },
  typechain: {
    outDir: 'gen',
    target: 'ethers-v5',
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts,
    },
    porcini: {
      url: 'https://porcini.rootnet.app/',
      accounts,
      chainId: 7672,
    },
    goerli: {
      // faucet: https://goerli-faucet.pk910.de/
      url: `https://rpc.ankr.com/eth_goerli`,
      accounts: accounts,
      timeout: 120000,
      chainId: 5,
    },
  },
  namedAccounts,
}

export default config
