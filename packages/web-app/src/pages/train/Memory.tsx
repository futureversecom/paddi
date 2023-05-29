import { css, styled } from '@mui/material'
import type { FC } from 'react'
import { useMemoryTreesOfBrain } from 'src/hooks/contracts/useMemoryTreeContract'

const Container = styled('button')(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    font-size: 24px;
    text-align: center;
    width: 100%;
    height: 120px;
    flex-direction: column;
    align-items: center;
    border-color: ${theme.palette.text.primary};
    border-style: solid;
    border-width: 4px;
    cursor: pointer;
    background: none;
    color: ${theme.palette.text.primary};
    &.disabled {
      cursor: default;
      color: grey;
      border-color: grey;
    }
  `,
)

const MemoryContent = ({
  memoryId,
  brainId,
}: {
  memoryId: number | null
  brainId: number
}) => {
  // No worry about the performance, should be cashed already when you open the select modal.
  const { data } = useMemoryTreesOfBrain(brainId)
  const normalizeId = data?.normalizeId
  if (memoryId !== undefined && memoryId !== null) {
    return <span>Node:{normalizeId?.[memoryId] ?? memoryId}</span>
  }
  return <span>Untrained memory</span>
}

type props = {
  brainId?: number
  memoryId?: number | null
  onClick: () => void
  disabled?: boolean
}

export const Memory: FC<props> = ({ brainId, memoryId, onClick, disabled }) => {
  return (
    <Container
      {...(!disabled && { onClick })}
      className={disabled ? 'disabled' : undefined}
    >
      {brainId !== undefined && memoryId !== undefined ? (
        <MemoryContent brainId={brainId} memoryId={memoryId} />
      ) : (
        <span>
          Select <br />
          Memory
        </span>
      )}
    </Container>
  )
}
