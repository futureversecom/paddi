import { Button, Grid, Stack, Typography } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { DescriptionBox } from 'src/components/common/DescriptionBox'
import { FaucetPanelASTO } from 'src/components/FaucetPanel/FaucetPanelASTO'
import { FaucetPanelBrain } from 'src/components/FaucetPanel/FaucetPanelBrain'
import { FaucetPanelXRP } from 'src/components/FaucetPanel/FaucetPanelXRP'
import { useAuthStatus } from 'src/hooks/useAuthStatus'
import { reportEvent } from 'src/utils/ga'
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
      <DescriptionBox title="Training Assets" sx={{ my: 2, maxWidth: '75%' }}>
        <p>
          A faucet is a tool that allows you to claim small amounts of ERC20 and
          ERC721 tokens for free. The purpose of a faucet is to provide you with
          test net Assets for experimenting without requiring you to buy or mine
          them.
        </p>

        <p>
          It&apos;s important to note that the tokens obtained through the
          faucet are only available to be used on test net and should not be
          considered to have any value in the real world. They cannot be traded
          or exchanged and have no monetary value outside of the testing
          environment.
        </p>
      </DescriptionBox>
      {address && authStatus === 'authenticated' ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FaucetPanelXRP address={address} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FaucetPanelASTO address={address} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FaucetPanelBrain address={address} />
            </Grid>
          </Grid>
          <Typography marginTop={10}>
            After claiming all 3 test net assets (XRP, ASTO and Gen II Brains).
            <br />
            You can now start training you agent to play Paddi.
          </Typography>
          <Stack direction="row" gap={2} marginTop={2} alignItems="center">
            <NavLink to="/train">
              <Button variant="contained" sx={{ minWidth: 380 }}>
                Start training
              </Button>
            </NavLink>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Stack>
        </>
      ) : (
        <>
          <p>Please connect your wallet to claim XRP, ASTO, and Brains.</p>
          <Button
            variant="contained"
            onClick={openConnectModal}
            sx={{ minWidth: 380 }}
          >
            Connect wallet
          </Button>
        </>
      )}
    </>
  )
}
