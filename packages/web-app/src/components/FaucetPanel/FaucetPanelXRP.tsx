import { Button, Typography } from '@mui/material'
import type { Narrow } from 'abitype'
import { chainAddressFromString } from 'core/src/types/chain-address'
import type { BigNumberish } from 'ethers'
import { utils } from 'ethers'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { client } from 'src/graphql/client'
import { useGasFaucetMutation } from 'src/graphql/generated'
import { abis } from 'src/utils/abis'
import { reportEvent } from 'src/utils/ga'
import { useBalance, useContractRead, useProvider } from 'wagmi'

import { FaucetPanel } from './FaucetPanel'

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
        error: {
          render: () => (
            <span>
              XRP claiming error! <br /> Try{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://faucet.rootnet.cloud/"
                style={{ display: 'inline', textDecoration: 'underline' }}
              >
                Porcini Faucet
              </a>{' '}
              instead.
            </span>
          ),
        },
      })
      .finally(() => setRequesting(false))
    await refetchBalance()
  }

  return faucetError ? (
    <Typography>Unable to load XRP Faucet</Typography>
  ) : faucetLoading ? null : (
    <FaucetPanel
      type="XRP"
      imgPath="images/xrp.png"
      balance={utils.formatEther(xrpBal)}
      explainer={`Claim XRP to pay for contract interactions. The faucet has - ${utils.formatEther(
        faucetBal as BigNumberish,
      )} $XRP.`}
    >
      <Button
        fullWidth
        variant="outlined"
        onClick={handleRequestGas}
        disabled={!address || requesting}
      >
        Claim $XRP
      </Button>
    </FaucetPanel>
  )
}
