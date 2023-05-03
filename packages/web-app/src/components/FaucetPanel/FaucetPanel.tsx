import { Button, css, styled, Typography } from '@mui/material'
import type { FC, ReactNode } from 'react'

type Props = {
  title: string
  explainer: string
  stats: string[]
  imgPath: string
  children: ReactNode
}

export const FaucetPanelActionButton = styled(Button)(
  () => css`
    margin: 2em;
  `,
)
const ContentContainer = styled('div')(
  () => css`
    padding-left: 2em;
    padding-right: 2em;
    flex: 1;
  `,
)

const ImageContainer = styled('div')(
  () => css`
    background: #000000;
    padding: 2em;
    text-align: center;
    height: 200px;
    & img {
      height: 100%;
    }
  `,
)
const StatItem = styled('div')(
  ({ theme }) => css`
    font-weight: bold;
    margin-top: ${theme.spacing(2)};
  `,
)

const Container = styled('div')(
  ({ theme }) => css`
    background: ${theme.palette.divider};
    // border: 1px solid white;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
)
export const Title = styled('h2')(
  () => css`
    font-weight: 700;
    font-size: 20px;
  `,
)
export const FaucetPanel: FC<Props> = ({
  children,
  imgPath,
  explainer,
  title,
  stats,
}) => {
  return (
    <Container>
      <ImageContainer>
        <img src={imgPath} />
      </ImageContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <Typography sx={{ opacity: 0.5 }}>{explainer}</Typography>
        {stats.map(stat => (
          <StatItem key={stat}>{stat}</StatItem>
        ))}
      </ContentContainer>
      {children}
    </Container>
  )
}
