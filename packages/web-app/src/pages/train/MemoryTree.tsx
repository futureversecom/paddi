import { css, styled, Typography } from '@mui/material'
import React from 'react'
import type {
  MemoryNode,
  MemoryTreesOfBrain,
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

const Node = styled(Typography)(
  ({ theme }) => css`
    cursor: pointer;
    transition: ${theme.transitions.create('color')};

    :hover {
      color: ${theme.palette.secondary.main};
    }
  `,
)

type Props = {
  tree: MemoryTreesOfBrain
  handleSelectTrainedMemory: (memoryId: number) => void
}

export const MemoryTree: React.FC<Props> = ({
  tree,
  handleSelectTrainedMemory,
}) => {
  const { memoryTrees, normalizeId } = tree
  const { rootNodeIds, nodes } = memoryTrees

  const renderTree = (node?: MemoryNode) =>
    !!node && (
      <li key={node.id}>
        <Node
          variant="body1"
          role="button"
          onClick={() => handleSelectTrainedMemory(node.id)}
        >
          {`Memory node: ${normalizeId[node.id]}`}
        </Node>
        {node.children.length !== 0 && (
          <ul>{node.children.map(childId => renderTree(nodes[childId]))}</ul>
        )}
      </li>
    )

  return (
    <Container>
      <ul className="tree">
        {rootNodeIds.map(rootNodeId => renderTree(nodes[rootNodeId]))}
      </ul>
    </Container>
  )
}
