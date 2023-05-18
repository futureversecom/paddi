import { Box, Button, DialogContent, Typography } from '@mui/material'
import type { FC } from 'react'
import type { ParentMemoryNodeConfig } from 'src/graphql/generated'
import { NodeType } from 'src/graphql/generated'
import { useMemoryTreesOfBrain } from 'src/hooks/contracts/useMemoryTreeContract'
import { reportEvent } from 'src/utils/ga'

import { MemoryTree } from './MemoryTree'

type DialogContentProps = {
  brainId: number
  handleSelectMemory: (parentMemoryNodeConfig: ParentMemoryNodeConfig) => void
}

export const MemorySelectorDialogContent: FC<DialogContentProps> = ({
  brainId,
  handleSelectMemory,
}) => {
  const { data: memoryTreesOfBrain } = useMemoryTreesOfBrain(brainId)

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
      memoryUrl: memoryTreesOfBrain?.memoryTrees?.nodes[memoryId]?.storageURI,
    })
  }

  const hasMemoryTrees =
    memoryTreesOfBrain &&
    Object.entries(memoryTreesOfBrain.memoryTrees.nodes).length !== 0

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
            tree={memoryTreesOfBrain}
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
