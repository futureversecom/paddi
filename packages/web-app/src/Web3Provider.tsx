import '@rainbow-me/rainbowkit/styles.css'

import {
  connectorsForWallets,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { gql } from 'graphql-request'
import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { SiweMessage } from 'siwe'
import { configureChains, createClient, useAccount, WagmiConfig } from 'wagmi'
import type { Chain } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import { clearJwt, client, getInitAuthStatus, setJwt } from './graphql/client'
import { useAuthenticateMutation } from './graphql/generated'
import { useAuthStatus } from './hooks/useAuthStatus'
import { useRainbowTheme } from './hooks/useRainbowTheme'

const nonceQuery = gql`
  query nonce($userWalletAddress: ChainAddress!) {
    nonce(userWalletAddress: $userWalletAddress)
  }
`

const porcini: Chain = {
  id: 7672,
  name: 'Porcini - TRN Testnet',
  network: 'porcini testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XRP',
    symbol: 'XRP',
  },
  rpcUrls: {
    default: {
      http: ['https://porcini.rootnet.app'],
    },
    public: {
      http: ['https://porcini.rootnet.app'],
    },
  },
  blockExplorers: {
    default: { name: 'rootnet', url: 'https://explorer.rootnet.cloud/' },
    etherscan: { name: 'rootnet', url: 'https://explorer.rootnet.cloud/' },
  },
  testnet: true,
}

const { chains, provider } = configureChains([porcini], [publicProvider()])

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [metaMaskWallet({ chains })],
  },
  {
    groupName: 'Others',
    wallets: [
      walletConnectWallet({ chains }),
      coinbaseWallet({ appName: 'Paddi', chains }),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

type Props = {
  children: ReactNode
}

export const Web3Provider: React.FC<Props> = ({ children }) => {
  const rainbowTheme = useRainbowTheme()
  const { address } = useAccount()
  const { authStatus, setAuthStatus } = useAuthStatus()
  useEffect(() => {
    setAuthStatus(
      getInitAuthStatus(address) ? 'authenticated' : 'unauthenticated',
    )
  }, [])

  const authenticateMutation = useAuthenticateMutation(client, {
    onSuccess: data => {
      if (data.authenticate.__typename === 'AuthenticateSuccess') {
        setJwt(data.authenticate.token)
        setAuthStatus('authenticated')
      }
    },
  })

  const signOut = async () => {
    setAuthStatus('unauthenticated')
    clearJwt()
  }

  useEffect(() => {
    const listener = async () => {
      await signOut()
    }
    window.ethereum?.on?.('accountsChanged', listener)
    return () => window.ethereum?.removeListener?.('accountsChanged', listener)
  }, [])

  const authenticationAdapter = useMemo(
    () =>
      createAuthenticationAdapter({
        getNonce: async () => {
          const data = await client.request<{ nonce: string }>(nonceQuery, {
            userWalletAddress: address,
          })
          return data.nonce
        },

        createMessage: ({ nonce, address, chainId }) => {
          return new SiweMessage({
            domain: window.location.host,
            address,
            statement: 'Sign in with Ethereum to the app.',
            uri: window.location.origin,
            version: '1',
            chainId,
            nonce,
          })
        },

        getMessageBody: ({ message }) => {
          return message.prepareMessage()
        },

        verify: async ({ message, signature }) => {
          await authenticateMutation.mutate({
            input: {
              message: message.prepareMessage(),
              signature,
            },
          })

          return true
        },

        signOut,
      }),
    [address],
  )

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authStatus}
      >
        <RainbowKitProvider chains={chains} theme={rainbowTheme}>
          {children}
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  )
}
