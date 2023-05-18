import { Button, Link, Stack, styled, Typography } from '@mui/material'
import { useEffect } from 'react'
import { HEADER_HEIGHT } from 'src/utils/constants'
import { reportEvent } from 'src/utils/ga'
import { routes } from 'src/utils/routes'

export const HeroContent = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: calc(100vh - ${HEADER_HEIGHT}px);
`

export const Content = styled('div')`
  height: 100vh;

  :last-of-type {
    height: 40vh;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
`

export const Home = () => {
  useEffect(
    () =>
      reportEvent('page_view', {
        page_title: 'Home',
      }),
    [],
  )

  return (
    <>
      <HeroContent>
        <Typography variant="h1">Train and build your own AI Agent</Typography>
        <Stack
          mb={18}
          mt={10}
          columnGap={3}
          direction="row"
          alignItems="center"
        >
          <Button variant="outlined" href={routes.faucet}>
            Get Testnet Assets
          </Button>
          <Link underline="always">Learn about Paddi</Link>
        </Stack>
      </HeroContent>
      <Content>
        <Typography mt={6} width={800} variant="h5" component="p">
          Introducing Paddi, a futuristic take on a nostalgic arcade game where
          you can train an AI Agent to compete in your place. This is a demo
          driven by a protocol for ownable, trainable and tradable decentralized
          Artificial Intelligence.
        </Typography>
      </Content>
      <Content>
        <Stack height="100%" direction="column" justifyContent="space-between">
          <Typography mt={6} width={700} variant="h5" component="p">
            Take it one step further by building custom versions of Paddi using
            the open-source ASM AI Protocol in our Github repo.
          </Typography>
          <Stack mb={30}>
            <Typography mt={6} width={700} variant="body3" color="primary.dark">
              Get started by claiming testnet assets and learn how to play
              Paddi.
            </Typography>
            <Stack mt={3} columnGap={3} direction="row" alignItems="center">
              <Button variant="outlined" href={routes.faucet}>
                Get Testnet Assets
              </Button>
              <Link underline="always">Learn about Paddi</Link>
            </Stack>
          </Stack>
        </Stack>
      </Content>
      <Content>
        <Typography
          mb={6}
          width={590}
          textAlign="center"
          fontStyle="italic"
          color="primary.dark"
        >
          This Paddi experience is for demonstration purposes only and serves as
          a proof of concept. As it is hosted on The Root Network&apos;s Porcini
          testnet, any assets in your wallet will not appear in the experience.
          You can read more about ASM Brains at alteredstatemachine.xyz
        </Typography>
      </Content>
    </>
  )
}
