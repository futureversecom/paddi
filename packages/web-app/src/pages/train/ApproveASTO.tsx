import { Button, Stack, Tooltip } from '@mui/material'
import type { BigNumber } from 'ethers'
import { utils } from 'ethers'
import type { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { abis } from 'smart-contracts/abi'
import {
  useASTOAllowance,
  useASTOApprove,
  useASTOBalance,
} from 'src/hooks/contracts/useASTOContract'
import { reportEvent } from 'src/utils/ga'

type Props = {
  address: `0x${string}`
  trainingCost: BigNumber
  children: ReactNode
}

export const ApproveASTO: FC<Props> = ({ address, trainingCost, children }) => {
  const navgiate = useNavigate()

  const { data: balance } = useASTOBalance(address)
  const { data: allowance } = useASTOAllowance(
    address,
    abis.ComputeRequestManager.address,
  )

  const { mutateAsync: approveASTO, isLoading } = useASTOApprove(
    abis.ComputeRequestManager.address,
    // Approve max amount for simplicity (MAX TOTAL SUPPLY..)
    utils.parseEther('2384000000'),
  )

  const handleApproveASTO = () => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Approve ASTO',
    })
    return toast.promise(approveASTO, {
      pending: 'Approving ASTO...',
      success: 'ASTO Approved!',
      error: 'Transaction rejected!',
    })
  }

  if (balance === undefined || balance.lt(trainingCost)) {
    return (
      <Button
        variant="contained"
        sx={{ minWidth: 380 }}
        onClick={() => navgiate('/faucet')}
      >
        Get ASTO
      </Button>
    )
  }

  const isApproved = allowance?.gte(trainingCost)
  if (isApproved) {
    return <>{children}</>
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Button
        variant="contained"
        sx={{ minWidth: 380 }}
        onClick={handleApproveASTO}
        disabled={isLoading}
      >
        {`${isLoading ? 'Approving' : 'Approve'} use of ASTO`}
      </Button>
      <Tooltip
        title={
          <>
            <div>{`Approved: ${
              allowance ? utils.formatEther(allowance) : 0
            }`}</div>
            <div>{`Need to Approve: ${utils.formatEther(trainingCost)}`}</div>
          </>
        }
        arrow
        placement="top"
      >
        <span className="material-symbols-outlined">help</span>
      </Tooltip>
    </Stack>
  )
}
