import { css, styled } from '@mui/material'
import type { FC } from 'react'
import type { ParentMemoryNodeConfig } from 'src/graphql/generated'
import { secondaryFontFamily } from 'src/styles/theme'

const Container = styled('button')(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    font-size: 24px;
    font-family: ${secondaryFontFamily};
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
  parentMemoryNodeConfig,
}: {
  parentMemoryNodeConfig: ParentMemoryNodeConfig
}) => {
  if (parentMemoryNodeConfig.memoryId !== undefined) {
    return <span>Node:{parentMemoryNodeConfig.memoryId}</span>
  }
  return <span>Untrained memory</span>
}

type props = {
  parentMemoryNodeConfig?: ParentMemoryNodeConfig
  onClick: () => void
  disabled?: boolean
}

export const Memory: FC<props> = ({
  parentMemoryNodeConfig,
  onClick,
  disabled,
}) => {
  return (
    <Container
      {...(!disabled && { onClick })}
      className={disabled ? 'disabled' : undefined}
    >
      {parentMemoryNodeConfig !== undefined ? (
        <MemoryContent parentMemoryNodeConfig={parentMemoryNodeConfig} />
      ) : (
        <span>
          Select <br />
          Memory
        </span>
      )}
    </Container>
  )
}
