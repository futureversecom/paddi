import { Button, styled, Tab, Tabs } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { DescriptionBox } from 'src/components/common/DescriptionBox'
import { useAuthStatus } from 'src/hooks/useAuthStatus'
import { useAccount } from 'wagmi'

import { DoTrainingPanel } from './DoTrainingPanel'
import { TrainingHistoryPanel } from './TrainingHistoryPanel'

const StyledNavLink = styled(NavLink)`
  text-decoration: underline;
  font-weight: bold;
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
      <DescriptionBox title="Train your agent" sx={{ mt: 2 }}>
        <p>
          Train your Brain to get better at Pong. Each training session (units)
          will cost $ASTO 10. Each training sessions happens against one
          opponent and generates a new AI model. This model is automatically
          tested (evaluated) against all opponents. Helping you assess overall
          change in performance.
        </p>
        <p>
          If you don&apos;t have ASM brains, $ASTO or XRP, go to{' '}
          <StyledNavLink to="/faucet">Faucet</StyledNavLink> page to load up
          your account.
        </p>
      </DescriptionBox>
      {address && authStatus === 'authenticated' ? (
        <>
          <Tabs sx={{ mb: 3 }} value={currentTab}>
            <Tab
              label="Training"
              sx={{ minWidth: '260px' }}
              to={TrainingRoutes.DoTraining}
              value={TrainingRoutes.DoTraining}
              component={Link}
            />
            <Tab
              label="Training History"
              sx={{ minWidth: '260px' }}
              to={TrainingRoutes.TrainingHistory}
              value={TrainingRoutes.TrainingHistory}
              component={Link}
            />
          </Tabs>
          {currentTab === TrainingRoutes.DoTraining && (
            <DoTrainingPanel address={address} />
          )}
          {currentTab === TrainingRoutes.TrainingHistory && (
            <TrainingHistoryPanel />
          )}
        </>
      ) : (
        <>
          <p>Please connect your wallet to start training.</p>
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
