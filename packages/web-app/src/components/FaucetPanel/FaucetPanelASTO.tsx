import type { BigNumberish } from 'ethers'
import { utils } from 'ethers'
import { toast } from 'react-toastify'
import {
  useASTOBalance,
  useASTOFaucet,
} from 'src/hooks/contracts/useASTOContract'
import { reportEvent } from 'src/utils/ga'

import { FaucetPanel, FaucetPanelActionButton } from './FaucetPanel'

type Props = {
  address: `0x${string}`
}

export const FaucetPanelASTO = ({ address }: Props) => {
  const {
    data: astoBal,
    isLoading: astoLoading,
    isError: astoError,
  } = useASTOBalance(address)

  const { mutateAsync: claimASTO } = useASTOFaucet()

  const handleClaimASTO = () => {
    reportEvent('button_click', {
      button_name: 'Claim ASTO',
      page_title: 'Faucet',
    })
    return toast.promise(claimASTO, {
      pending: 'Claiming ASTO...',
      success: 'ASTO Claimed!',
      error: 'Transaction rejected!',
    })
  }

  return (
    <>
      {astoError && <p>Unable to load ASTO.</p>}
      {!astoLoading && (
        <FaucetPanel
          imgPath="images/asto.png"
          title="02. ASTO"
          explainer={`Claim $ASTO to pay for training.`}
          stats={[
            `You have ${utils.formatEther(astoBal as BigNumberish)} $ASTO.`,
          ]}
        >
          <FaucetPanelActionButton
            variant="contained"
            onClick={handleClaimASTO}
          >
            Claim ASTO
          </FaucetPanelActionButton>
        </FaucetPanel>
      )}
    </>
  )
}
