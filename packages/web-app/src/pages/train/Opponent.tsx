import type { SxProps, Theme } from '@mui/material'
import { Box, css, styled, Typography } from '@mui/material'
import type { FC } from 'react'

const opponents = {
  Wall: {
    desc: 'Just a wall. Great to teach movement.',
    name: 'Wall',
    ballPos: {
      rotation: 225,
      top: 45,
      left: 50,
    },
    player1Top: 66,
    player2Top: 3,
    player2Length: undefined,
  },
  Nimble: {
    desc: 'Optimise for fast movements and trained to attack.',
    name: 'Nimble',
    ballPos: {
      rotation: 225,
      top: 45,
      left: 50,
    },
    player1Top: 66,
    player2Top: 3,
    player2Length: undefined,
  },
  Buff: {
    desc: 'Optimise with increased endurance and survivability.',
    name: 'Buff',
    ballPos: {
      rotation: 225,
      top: 70,
      left: 75,
    },
    player1Top: 66,
    player2Top: 60,
    player2Length: 50,
  },
  AllRounder: {
    desc: 'Just that all round good guy.',
    name: 'All Rounder',
    ballPos: {
      rotation: 90,
      top: 38,
      left: 70,
    },
    player1Top: 50,
    player2Top: 48,
    player2Length: 23,
  },
}

const Container = styled('button')(
  ({ theme }) => css`
    display: flex;
    width: 150px;
    height: 300px;
    flex-direction: column;
    border: none;
    box-shadow: 0 0 0 1px #767676;
    cursor: pointer;
    background: none;
    color: ${theme.palette.text.primary};
    text-align: initial;

    &:hover {
      box-shadow: 0 0 0 2px ${theme.palette.text.primary};
    }
  `,
)

const PlayGround = styled('div')(
  () => css`
    width: 120px;
    height: 120px;
    background: black;
    margin: 13px auto 8px;
    position: relative;
  `,
)

const PlayerLeft = styled('div')(
  ({ length = 24, top }: { length?: number; top: number }) => css`
    position: absolute;
    width: 4px;
    height: ${length}px;
    left: 3px;
    background: #fff;
    top: ${top}px;
  `,
)
const PlayerRight = styled('div')(
  ({ length = 24, top }: { length?: number; top: number }) => css`
    position: absolute;
    width: 4px;
    height: ${length}px;
    right: 3px;
    background: #fff;
    top: ${top}px;
  `,
)

type props = {
  name: keyof typeof opponents
  onClick: () => void
}

export const Opponent: FC<props> = ({ name, onClick }) => {
  const opponent = opponents[name]
  return (
    <Container onClick={onClick}>
      <PlayGround>
        <PlayerLeft top={opponent.player1Top} />
        <PlayerRight
          top={opponent.player2Top}
          length={opponent.player2Length}
        />
        <BallWithTail
          sx={{
            transform: `rotate(${opponent.ballPos.rotation}deg)`,
            top: `${opponent.ballPos.top}px`,
            left: `${opponent.ballPos.left}px`,
          }}
          isNimble={name === 'Nimble' || name === 'Wall'}
        />
      </PlayGround>
      <Box component="div" sx={{}} />
      <Box component="div" sx={{ p: 0.5 }}>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', mb: 0.5 }}>
          {opponents[name].name}
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: '20px' }}>
          {opponents[name].desc}
        </Typography>
      </Box>
    </Container>
  )
}

const Ball = styled('div')(
  () => css`
    width: 12px;
    height: 12px;
    border-radius: 12px;
  `,
)

const BallWithTail = ({
  sx,
  isNimble = false,
}: {
  sx: SxProps<Theme>
  isNimble?: boolean
}) => {
  return (
    <Box component={'div'} sx={{ position: 'absolute', ...sx }}>
      <Ball sx={{ background: '#fff' }} />
      <Ball
        sx={{ background: '#999', marginTop: isNimble ? '-4px' : '-5px' }}
      />
      <Ball
        sx={{ background: '#4d4d4d', marginTop: isNimble ? '-1px' : '-4px' }}
      />
      <Ball
        sx={{ background: '#1a1a1a', marginTop: isNimble ? '4px' : '-3px' }}
      />
    </Box>
  )
}
