import { toast } from 'react-toastify'
import {
  useBrainBalance,
  useBrainFaucet,
} from 'src/hooks/contracts/useBrainContract'
import { reportEvent } from 'src/utils/ga'

import { FaucetPanel, FaucetPanelActionButton } from './FaucetPanel'

type Props = {
  address: `0x${string}`
}

export const FaucetPanelBrain = ({ address }: Props) => {
  const {
    data: brainBal,
    isLoading: brainLoading,
    isError: brainError,
  } = useBrainBalance(address)

  const { mutateAsync: claimBrain } = useBrainFaucet()

  const handleClaimBrain = () => {
    reportEvent('button_click', {
      button_name: 'Claim Brain',
      page_title: 'Faucet',
    })
    return toast.promise(claimBrain, {
      pending: 'Claiming Brain...',
      success: 'Brain Claimed!',
      error: 'Transaction rejected!',
    })
  }

  return (
    <>
      {brainError && <p>Unable to load Brains.</p>}
      {!brainLoading && (
        <FaucetPanel
          imgPath="images/brain.png"
          title="03. Gen II Brain"
          explainer={`Claim a brain to play.`}
          stats={[`You have ${brainBal} brains.`]}
        >
          <FaucetPanelActionButton
            variant="contained"
            onClick={handleClaimBrain}
          >
            Claim Brains
          </FaucetPanelActionButton>
        </FaucetPanel>
      )}
    </>
  )
}
