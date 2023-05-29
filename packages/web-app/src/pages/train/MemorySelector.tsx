import {
  Box,
  Button,
  css,
  DialogContent,
  styled,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import type { ParentMemoryNodeConfig } from 'src/graphql/generated'
import { NodeType } from 'src/graphql/generated'
import { useMemoryTreesOfBrain } from 'src/hooks/contracts/useMemoryTreeContract'
import { reportEvent } from 'src/utils/ga'

import { MemoryTree } from './MemoryTree'

const TextButton = styled(Typography)(
  ({ theme }) => css`
    cursor: pointer;
    margin: ${theme.spacing(0, 0, 2)};
    transition: ${theme.transitions.create('color')};

    :hover {
      color: ${theme.palette.secondary.main};
    }
  `,
)

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
      <Typography variant="h6">Select node from Memory Tree</Typography>
      <Typography mt={2} mb={4} variant="body1">
        A memory node is a saved memory (AI training model) from past training
        stored in the Memory Tree of an ASM Brain. Select a memory node to
        continue your AI Agent&apos;s training or start from a new, untrained
        memory.
      </Typography>
      {hasMemoryTrees ? (
        <Box component="div" mb={4}>
          <TextButton
            role="button"
            variant="body1"
            onClick={handleSelectUntrainedMemory}
          >
            Use untrained memory
          </TextButton>
          <MemoryTree
            tree={memoryTreesOfBrain}
            handleSelectTrainedMemory={handleSelectTrainedMemory}
          />
        </Box>
      ) : (
        <>
          <Typography mb={2} variant="body1">
            This brain has no associated memories.
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleSelectUntrainedMemory}
          >
            Use untrained memory
          </Button>
        </>
      )}
    </DialogContent>
  )
}
