import { Box } from '@mui/material'
import type { FC } from 'react'
import React from 'react'
import type { MemoryTree } from 'src/hooks/contracts/useMemoryTreeContract'

const indentString = (indentLevel: number) => {
  return Array.from({ length: indentLevel }, (_, idx) => {
    if (idx === 0) {
      return '|     '
    }

    return '|         '
  }).join('')
}

type ASCIIMemoryTreeProps = {
  tree: MemoryTree
  acc: React.ReactElement
  indentLevel: number
  handleSelectTrainedMemory: (memoryId: number) => void
}

export const ASCIIMemoryTree: FC<ASCIIMemoryTreeProps> = ({
  tree,
  acc,
  indentLevel,
  handleSelectTrainedMemory,
}): React.ReactElement => {
  const indent = indentString(indentLevel)
  return tree.rootNodeIds.reduce((acc, rootNodeId, idx) => {
    const indentMarker = indentLevel === 0 ? `└─- ` : `${indent}└─----- `
    const edgeMarker = idx === 0 ? ' -- ' : indentMarker
    const nodeAdded = (
      <>
        {acc}
        {edgeMarker}
        <Box
          component="span"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleSelectTrainedMemory(rootNodeId)}
        >
          node:{rootNodeId}
        </Box>
      </>
    )

    // make an pass on the sub tree to render
    const withChildren = (
      <ASCIIMemoryTree
        tree={{
          nodes: tree.nodes,
          rootNodeIds: tree.nodes[rootNodeId]!.children,
        }}
        acc={nodeAdded}
        indentLevel={indentLevel + 1}
        handleSelectTrainedMemory={handleSelectTrainedMemory}
      />
    )

    return idx < tree.rootNodeIds.length - 1 ? (
      <div>{withChildren}</div>
    ) : (
      withChildren
    )
  }, acc)
}
