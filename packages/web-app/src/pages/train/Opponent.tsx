import { Card, css, styled, Typography } from '@mui/material'
import type { FC } from 'react'
import allRounderSrc from 'src/assets/images/all-rounder-opponent.png'
import buffSrc from 'src/assets/images/buff-opponent.png'
import nimbleSrc from 'src/assets/images/nimble-opponent.png'
import wallSrc from 'src/assets/images/wall-opponent.png'

const opponents = {
  Wall: {
    desc: 'Just a wall. Great to teach movement.',
    name: 'Wall',
    src: wallSrc,
  },
  Nimble: {
    desc: 'Optimise for fast movements and trained to attack.',
    name: 'Nimble',
    src: nimbleSrc,
  },
  Buff: {
    desc: 'Optimise with increased endurance and survivability.',
    name: 'Buff',
    src: buffSrc,
  },
  AllRounder: {
    desc: 'Just that all round good guy.',
    name: 'All Rounder',
    src: allRounderSrc,
  },
}

const StyledCard = styled(Card)(
  ({ theme }) => css`
    height: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    border-radius: 32px;
    flex-direction: column;
    justify-content: center;
    max-width: 100% !important;
    transition: ${theme.transitions.create('border-color')};

    :hover {
      border-color: ${theme.palette.secondary.main};
    }
  `,
)

const CardContent = styled('div')(
  ({ theme }) => css`
    flex: 1;
    width: 100%;
    padding: ${theme.spacing(1, 2, 3)};
    background-color: ${theme.palette.background.darkGrey};
  `,
)

const ImageContainer = styled('div')`
  width: 100%;

  img {
    width: 100%;
  }
`

type props = {
  onClick: () => void
  name: keyof typeof opponents
}

export const Opponent: FC<props> = ({ name, onClick }) => {
  const opponent = opponents[name]

  return (
    <StyledCard role="button" onClick={onClick}>
      <ImageContainer>
        <img src={opponent.src} alt={`Opponent: ${opponent.name}`} />
      </ImageContainer>
      <CardContent>
        <Typography mb={1} variant="body2">
          {opponent.name}
        </Typography>
        <Typography variant="body1">{opponent.desc}</Typography>
      </CardContent>
    </StyledCard>
  )
}
