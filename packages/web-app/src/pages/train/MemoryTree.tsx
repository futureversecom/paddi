import { Box, css, styled } from '@mui/material'
import React from 'react'
import type {
  MemoryNode,
  MemoryTree as MemoryTreeType,
} from 'src/hooks/contracts/useMemoryTreeContract'

const Container = styled('div')(
  () =>
    css`
      .tree,
      .tree ul {
        margin: 0 0 0 1em; /* indentation */
        padding: 0;
        list-style: none;
        position: relative;
      }

      .tree ul {
        margin-left: 0.5em;
      } /* (indentation/2) */

      .tree:before,
      .tree ul:before {
        content: '';
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        border-left: 1px solid;
      }

      .tree li {
        margin: 0;
        padding: 0 1.5em; /* indentation + .5em */
        line-height: 2em; /* default list item's line-height */
        font-weight: bold;
        position: relative;
      }

      .tree li:before {
        content: '';
        display: block;
        width: 10px; /* same with indentation */
        height: 0;
        border-top: 1px solid;
        margin-top: -1px; /* border top width */
        position: absolute;
        top: 1em; /* (line-height/2) */
        left: 0;
      }

      .tree li:last-child:before {
        /* same with body background */
        background: #383838;
        height: auto;
        top: 1em; /* (line-height/2) */
        bottom: 0;
      }
    `,
)

type Props = {
  tree: MemoryTreeType
  handleSelectTrainedMemory: (memoryId: number) => void
}

export const MemoryTree: React.FC<Props> = ({
  tree,
  handleSelectTrainedMemory,
}) => {
  const { rootNodeIds, nodes } = tree

  const renderTree = (node: MemoryNode) => (
    <li key={node.id}>
      <Box
        component="span"
        sx={{ cursor: 'pointer' }}
        onClick={() => handleSelectTrainedMemory(node.id)}
      >{`node:${node.id}`}</Box>
      {node.children.length !== 0 && (
        <ul>{node.children.map(childId => renderTree(nodes[childId]!))}</ul>
      )}
    </li>
  )

  return (
    <Container>
      <ul className="tree">
        {rootNodeIds.map(rootNodeId => renderTree(nodes[rootNodeId]!))}
      </ul>
    </Container>
  )
}