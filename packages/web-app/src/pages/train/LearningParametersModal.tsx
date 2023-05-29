import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  styled,
} from '@mui/material'
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

type LearningParametersModalProps = {
  open: boolean
  handleClose: () => void
  rewardConfig: RewardConfig
}

export const LearningParametersModal = ({
  open,
  handleClose,
  rewardConfig,
}: LearningParametersModalProps) => (
  <ResponsiveDialog open={open} onClose={handleClose} scroll="body">
    <DialogContent sx={{ py: 4, px: 6 }}>
      <RoundedBox>
        <TrainingParamsViewer rewardConfig={rewardConfig} />
      </RoundedBox>
      <DialogActions sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </DialogContent>
  </ResponsiveDialog>
)
