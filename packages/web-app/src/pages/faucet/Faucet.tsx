import { Button, Grid, Typography } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ScrollRestoration } from 'react-router-dom'
import { PlusIcon } from 'src/assets/icons'
import { FaucetPanelASTO } from 'src/components/FaucetPanel/FaucetPanelASTO'
import { FaucetPanelBrain } from 'src/components/FaucetPanel/FaucetPanelBrain'
import { FaucetPanelXRP } from 'src/components/FaucetPanel/FaucetPanelXRP'
import { useAuthStatus } from 'src/hooks/useAuthStatus'
import { reportEvent } from 'src/utils/ga'
import { routes } from 'src/utils/routes'
import { useAccount } from 'wagmi'

export const Faucet = () => {
  useEffect(
    () =>
      reportEvent('page_view', {
        page_title: 'Faucet',
      }),
    [],
  )
  const { openConnectModal } = useConnectModal()
  const { address } = useAccount()
  const { authStatus } = useAuthStatus()

  return (
    <>
      <Helmet>
        <title>Testnet Assets | Paddi</title>
      </Helmet>
      <ScrollRestoration />
      <Typography mt={4} component="h1" variant="h5">
        Training Assets
      </Typography>
      <Typography
        mt={2}
        mb={6}
        width={650}
        variant="body1"
        color="primary.dark"
      >
        Claim ASM Brains and small amounts of XRP and ASTO tokens for free to
        use in Paddi. Because this is a demo on a testnet platform, we
        don&apos;t require you to use your own XRP, ASTO or ASM Brains.
      </Typography>
      {address && authStatus === 'authenticated' ? (
        <>
          <Grid container spacing={2}>
            <Grid item sm={4}>
              <FaucetPanelXRP address={address} />
            </Grid>
            <Grid item sm={4}>
              <FaucetPanelASTO address={address} />
            </Grid>
            <Grid item sm={4}>
              <FaucetPanelBrain address={address} />
            </Grid>
          </Grid>
          <Typography mt={6} mb={2} variant="body1" color="primary.dark">
            After claiming all three assets you can begin training your AI Agent
            to play Paddi.
          </Typography>
          <Button
            href={routes.train}
            sx={{ width: 425 }}
            startIcon={<PlusIcon />}
          >
            Start Training
          </Button>
          <Typography
            mt={20}
            mx="auto"
            width={550}
            variant="caption"
            textAlign="center"
            color="primary.dark"
          >
            Please note that tokens obtained through this faucet are only
            available to use on testnet and cannot be traded or exchanged.{' '}
          </Typography>
        </>
      ) : (
        <>
          <Typography mt={6} mb={2} variant="body1">
            After claiming all three assets you can begin training your AI Agent
            to play Paddi.
          </Typography>
          <Button
            variant="contained"
            sx={{ width: 425 }}
            onClick={openConnectModal}
          >
            Connect wallet
          </Button>
        </>
      )}
    </>
  )
}
