import { Box, Button, css, Stack, styled, Typography } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { reportEvent } from 'src/utils/ga'

import { useAuthStatus } from '../../hooks/useAuthStatus'

export const CaveatBox = styled(Box)(
  ({ theme }) => css`
    border-color: ${theme.palette.text.primary};
    border-style: solid;
    border-width: 1px;
    padding: ${theme.spacing(3, 3, 1, 3)};
  `,
)

export const Home = () => {
  useEffect(
    () =>
      reportEvent('page_view', {
        page_title: 'Home',
      }),
    [],
  )
  const { openConnectModal } = useConnectModal()
  const { authStatus } = useAuthStatus()

  return (
    <div>
      <Typography variant="h3">
        Welcome to BATI powered <br /> by ASM protocol
      </Typography>
      <Box component="p" sx={{ maxWidth: '900px' }}>
        Curious about the experience of incorporating ASM Brains into video
        games? Then, allow me to introduce you to Bati, powered by ASM Brains
        and the Core Training Protocol on The Root Network (TRN) Test-net. This
        will demonstrates the possibilities that will emerge when all of these
        elements are combined. Needs rewording!
      </Box>

      <CaveatBox component="div" title="Important caveats" sx={{ my: 4 }}>
        <Typography variant="h5">
          Important caveats{' '}
          <span className="material-symbols-outlined">warning</span>
        </Typography>
        <Box component="p" sx={{ fontStyle: 'italic', color: '#7C7C7C' }}>
          This Bati game is for demonstration purposes only. It&apos;s shining a
          light on what you can do with ASM Brains, how AI training works and
          TRN. It&apos;s not intended to be a feature-complete game.
        </Box>
        <Box component="p" sx={{ fontStyle: 'italic', color: '#7C7C7C' }}>
          Everything on this site runs on TRN testnet (Porcini). That means you
          can’t bring your existing ASM Brains to this experience. In future, we
          may consider launching this to TRN Mainnet.
        </Box>
      </CaveatBox>

      <Typography marginTop={10}>
        To get start, claim you test net assets to begin training
      </Typography>
      <Stack direction="row" gap={2} marginTop={2} alignItems="center">
        {/* TODO: implement this when we have a video */}
        {/* <Link href="https://videolink.com" target="_blank" rel="noopener">
          <Button variant="outlined" sx={{ minWidth: 380 }}>
            How training works video
          </Button>{' '}
        </Link> */}
        {authStatus === 'authenticated' ? (
          <NavLink to="/faucet">
            <Button variant="contained" sx={{ minWidth: 380 }}>
              Get Testnet assets
            </Button>
          </NavLink>
        ) : (
          <Button
            variant="contained"
            onClick={openConnectModal}
            sx={{ minWidth: 380 }}
          >
            Connect wallet
          </Button>
        )}

        <span className="material-symbols-outlined">arrow_forward</span>
      </Stack>
    </div>
  )
}
