import {
  Box,
  Button,
  css,
  Dialog,
  DialogContent,
  styled,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import { useState } from 'react'
import type { ParentMemoryNodeConfig } from 'src/graphql/generated'
import { NodeType } from 'src/graphql/generated'
import { useMemoryTreesOfBrain } from 'src/hooks/contracts/useMemoryTreeContract'
import { reportEvent } from 'src/utils/ga'

import { Memory } from './Memory'
import { MemoryTree } from './MemoryTree'
import { TrainingCheckBox } from './TrainingCheckBox'

type Props = {
  brainId?: number
  parentMemoryNodeConfig?: ParentMemoryNodeConfig
  setParentMemoryNodeConfig: (
    parentMemoryNodeConfig: ParentMemoryNodeConfig,
  ) => void
}

const Parent = styled('div')(
  () =>
    css`
      position: relative;
    `,
)

export const MemorySelector: FC<Props> = ({
  brainId,
  parentMemoryNodeConfig,
  setParentMemoryNodeConfig,
}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Open Select Memory',
    })
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleSelectMemory = (config: ParentMemoryNodeConfig) => {
    setParentMemoryNodeConfig(config)
    handleClose()
  }

  const hasBrainId = brainId !== undefined

  return (
    <Parent>
      <Memory
        onClick={handleOpen}
        parentMemoryNodeConfig={parentMemoryNodeConfig}
        disabled={!hasBrainId}
      />
      {parentMemoryNodeConfig && <TrainingCheckBox />}
      {hasBrainId && (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
          <MemorySelectorDialogContent
            brainId={brainId}
            handleSelectMemory={handleSelectMemory}
          />
        </Dialog>
      )}
    </Parent>
  )
}

type DialogContentProps = {
  brainId: number
  handleSelectMemory: (parentMemoryNodeConfig: ParentMemoryNodeConfig) => void
}

const MemorySelectorDialogContent: FC<DialogContentProps> = ({
  brainId,
  handleSelectMemory,
}) => {
  const { data: memoryTrees } = useMemoryTreesOfBrain(brainId)

  const handleSelectUntrainedMemory = () => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Select untrained memory',
    })
    handleSelectMemory({
      type: NodeType.RootNode,
    })
  }

  const handleSelectTrainedMemory = (memoryId: number) => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Select memory node',
    })
    handleSelectMemory({
      type: NodeType.TrainedNode,
      memoryId,
      memoryUrl: memoryTrees?.nodes[memoryId]?.storageURI,
    })
  }

  const hasMemoryTrees =
    memoryTrees && Object.entries(memoryTrees.nodes).length !== 0

  return (
    <DialogContent>
      <Typography variant="h6" sx={{ my: 1 }}>
        Select Node from memory Tree
      </Typography>
      {hasMemoryTrees && (
        <>
          <Typography component="p" sx={{ mb: 2 }}>
            A node is a saved memory from past training stored in the memory
            tree. <br />
            Select a node to train from and extend the learning.
          </Typography>
          <MemoryTree
            tree={memoryTrees}
            handleSelectTrainedMemory={handleSelectTrainedMemory}
          />
        </>
      )}
      <Box component="div" sx={{ mt: 8 }}>
        {!hasMemoryTrees && (
          <Typography color="warning" sx={{ my: 1 }}>
            This brain have no associated memories, please
          </Typography>
        )}

        <Button
          variant="outlined"
          onClick={handleSelectUntrainedMemory}
          fullWidth
        >
          Use untrained memory
        </Button>
      </Box>
    </DialogContent>
  )
}
