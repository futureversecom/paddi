import type { SxProps } from '@mui/material'
import { Box, css, styled, Typography } from '@mui/material'
import type { Theme } from '@mui/system'
import type { FC, ReactNode } from 'react'

export const StyledBox = styled(Box)(
  ({ theme }) => css`
    border-color: ${theme.palette.text.primary};
    border-style: solid;
    border-width: 0px;
    padding: ${theme.spacing(1, 0)};
  `,
)

export const Title = styled(Typography)(
  ({ theme }) => css`
    position: absolute;
    margin-top: ${theme.spacing(-3)};
    display: inline;
  `,
)
type Props = {
  title?: string
  children: ReactNode
  sx?: SxProps<Theme>
}

export const DescriptionBox: FC<Props> = ({ sx, title, children }) => {
  return (
    <StyledBox sx={sx}>
      {title && <Title variant="h5">{title}</Title>}
      {children}
    </StyledBox>
  )
}
