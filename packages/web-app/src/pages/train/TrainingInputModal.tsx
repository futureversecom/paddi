import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  styled,
} from '@mui/material'
import type { FC } from 'react'
import { useState } from 'react'
import { RoundedBox } from 'src/components/common/RoundedBox'
import type { RewardConfig } from 'src/graphql/generated/index'

import { TrainingParamsViewer } from './TrainingParamsViewer'

const ResponsiveDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    [theme.breakpoints.up('sm')]: {
      maxWidth: '90%',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '787px',
    },
  },
}))

const StatsLink = styled('button')`
  background: none;
  color: white;
  border: 0;
  font-size: 18px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin: 0;
  text-align: left;
`

type Props = {
  rewardConfig: RewardConfig
}

export const TrainingInputModal: FC<Props> = ({ rewardConfig }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <StatsLink onClick={handleOpen}>Learning Parameter Values</StatsLink>

      <ResponsiveDialog open={open} onClose={handleClose}>
        <DialogContent sx={{ pt: 4, px: 4 }}>
          <RoundedBox>
            <TrainingParamsViewer rewardConfig={rewardConfig} />
          </RoundedBox>
        </DialogContent>
        <DialogActions sx={{ pb: 4, px: 4 }}>
          <Button
            variant="contained"
            sx={{ width: '100%' }}
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    </>
  )
}
