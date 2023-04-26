import type { Narrow } from 'abitype'
import { chainAddressFromString } from 'core/src/types/chain-address'
import type { BigNumberish } from 'ethers'
import { utils } from 'ethers'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { abis } from 'smart-contracts/abi'
import { client } from 'src/graphql/client'
import { useGasFaucetMutation } from 'src/graphql/generated'
import { reportEvent } from 'src/utils/ga'
import { useBalance, useContractRead, useProvider } from 'wagmi'

import { FaucetPanel, FaucetPanelActionButton } from './FaucetPanel'

type Props = {
  address: `0x${string}`
}

export const FaucetPanelXRP = ({ address }: Props) => {
  const [requesting, setRequesting] = useState(false)
  const provider = useProvider()

  // Get XRP balance
  const { data: balanceData, refetch: refetchBalance } = useBalance({ address })
  const xrpBal: BigNumberish = balanceData?.value ?? 0

  // Get Faucet balance
  const {
    data: faucetBal,
    isLoading: faucetLoading,
    isError: faucetError,
  } = useContractRead({
    address: abis.GasFaucet.address,
    abi: abis.GasFaucet.contract as Narrow<readonly unknown[]>,
    functionName: 'getBalance',
    watch: true,
  })

  const { mutateAsync: gasFaucetRequest } = useGasFaucetMutation(client)

  const requestGas = async () => {
    const { gasFaucet: result } = await gasFaucetRequest({
      address: chainAddressFromString(address),
    })

    if (result.__typename === 'GasFaucetSuccessResponse') {
      await provider.waitForTransaction(result.hash)
    } else {
      throw Error()
    }
  }

  const handleRequestGas = async () => {
    reportEvent('button_click', {
      button_name: 'Claim XRP',
      page_title: 'Faucet',
    })
    setRequesting(true)
    await toast
      .promise(requestGas, {
        pending: 'Claiming XRP...',
        success: 'XRP claimed!',
        error: 'XRP claiming error!',
      })
      .finally(() => setRequesting(false))
    await refetchBalance()
  }

  return (
    <>
      {faucetError && <p>Unable to load XRP.</p>}
      {!faucetLoading && (
        <FaucetPanel
          imgPath="images/xrp.png"
          title="01. XRP"
          explainer={`Claim $XRP to pay for contract interactions.`}
          stats={[
            `You have ${utils.formatEther(xrpBal)} $XRP.\n`,
            `The faucet has ${utils.formatEther(
              faucetBal as BigNumberish,
            )} $XRP.`,
          ]}
        >
          <FaucetPanelActionButton
            variant="contained"
            disabled={!address || requesting}
            onClick={handleRequestGas}
          >
            Claim XRP
          </FaucetPanelActionButton>
        </FaucetPanel>
      )}
    </>
  )
}
