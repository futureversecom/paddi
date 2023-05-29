import { Button, Stack, Typography } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { BigNumberish } from 'ethers'
import { utils } from 'ethers'
import { ConnectIcon } from 'src/assets/icons'
import { useASTOBalance } from 'src/hooks/contracts/useASTOContract'
import type { Address } from 'wagmi'
import { useBalance } from 'wagmi'

const formatAddress = (address: string) =>
  `${address.substring(0, 4)}...${address.substring(address.length - 5)}`

export const Account = () => (
  <ConnectButton.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openChainModal,
      openConnectModal,
      authenticationStatus,
      mounted,
    }) => {
      const ready = mounted && authenticationStatus !== 'loading'
      const connected =
        ready &&
        account &&
        chain &&
        (!authenticationStatus || authenticationStatus === 'authenticated')

      const { data: astoBal } = useASTOBalance(
        account?.address || '',
        !!account,
      )
      const { data: xrpData } = useBalance({
        address: (account?.address || '') as Address,
        enabled: !!account,
      })
      const xrpBal = xrpData?.formatted

      return (
        <Stack direction="row" spacing={1}>
          <ConnectIcon />
          <Stack alignItems="flex-start" spacing={0.5}>
            {!connected ? (
              <Button disableRipple variant="text" onClick={openConnectModal}>
                Connect Wallet
              </Button>
            ) : chain.unsupported ? (
              <Button
                disableRipple
                color="error"
                variant="text"
                onClick={openChainModal}
              >
                Wrong network
              </Button>
            ) : (
              <Button disableRipple variant="text" onClick={openAccountModal}>
                {formatAddress(account.address)}
              </Button>
            )}
            <Typography variant="caption" color="primary.dark">
              {astoBal ? utils.formatEther(astoBal as BigNumberish) : 0}{' '}
              ASTO&nbsp;&nbsp;{xrpBal ?? 0} XRP
            </Typography>
          </Stack>
        </Stack>
      )
    }}
  </ConnectButton.Custom>
)
