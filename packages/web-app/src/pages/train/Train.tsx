import {
  Button,
  Link,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Helmet } from 'react-helmet-async'
import {
  Link as RouterLink,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom'
import { OpenInNewWindowIcon } from 'src/assets/icons'
import { useAuthStatus } from 'src/hooks/useAuthStatus'
import { useAccount } from 'wagmi'

import { DoTrainingPanel } from './DoTrainingPanel'
import { TrainingHistoryPanel } from './TrainingHistoryPanel'

const LinkIcon = styled(OpenInNewWindowIcon)`
  margin-left: 4px;
`

enum TrainingRoutes {
  DoTraining = '/train',
  TrainingHistory = '/train/history',
}

export const Train = () => {
  const { authStatus } = useAuthStatus()
  const { address } = useAccount()
  const { pathname } = useLocation()
  const currentTab = ['/train', '/train/history'].includes(pathname)
    ? pathname
    : TrainingRoutes.DoTraining
  const { openConnectModal } = useConnectModal()

  return (
    <>
      <Helmet>
        <title>Training | Paddi</title>
      </Helmet>
      <ScrollRestoration />
      <Typography mt={4} component="h1" variant="h5">
        Power up your paddle
      </Typography>
      <Typography
        mt={2}
        mb={6}
        width={650}
        variant="body1"
        color="primary.dark"
      >
        Improve your paddle&apos;s skills by training your ASM Brain. Each
        training round pits your AI Agent against an opposing paddle. After
        training is complete you&apos;ll see how your paddle performed, giving
        you all the info you need to improve it as an AI Agent.
      </Typography>
      {address && authStatus === 'authenticated' ? (
        <>
          <Stack
            mb={6}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Tabs value={currentTab}>
              <Tab
                label="Training"
                component={RouterLink}
                sx={{ minWidth: '260px' }}
                to={TrainingRoutes.DoTraining}
                value={TrainingRoutes.DoTraining}
              />
              <Tab
                component={RouterLink}
                label="Training History"
                sx={{ minWidth: '260px' }}
                to={TrainingRoutes.TrainingHistory}
                value={TrainingRoutes.TrainingHistory}
              />
            </Tabs>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/futureversecom/paddi"
            >
              Access open-source code
              <LinkIcon />
            </Link>
          </Stack>
          {currentTab === TrainingRoutes.DoTraining && (
            <DoTrainingPanel address={address} />
          )}
          {currentTab === TrainingRoutes.TrainingHistory && (
            <TrainingHistoryPanel />
          )}
        </>
      ) : (
        <>
          <Typography mt={6} mb={2} variant="body1">
            Please connect your wallet to start training.
          </Typography>
          <Button
            variant="contained"
            onClick={openConnectModal}
            sx={{ minWidth: 380 }}
          >
            Connect wallet
          </Button>
        </>
      )}
      <Typography
        mt={15}
        mx="auto"
        width={430}
        variant="caption"
        textAlign="center"
        color="primary.dark"
      >
        If you&apos;re lacking in $ASTO, $XRP or just want a different ASM Brain
        visit our Testnet Asset page to get more assets.
      </Typography>
    </>
  )
}
