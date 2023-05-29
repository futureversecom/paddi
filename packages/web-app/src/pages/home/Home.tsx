import { Button, Stack, styled, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ScrollRestoration } from 'react-router-dom'
import {
  ArrowRightIcon,
  HomeLines1,
  HomeLines2,
  HomeLines3,
  TestNetIcon,
} from 'src/assets/icons'
import { HEADER_HEIGHT } from 'src/utils/constants'
import { reportEvent } from 'src/utils/ga'
import { routes } from 'src/utils/routes'

const Lines = styled('div')`
  position: relative;
  top: 200px;
`
const HeroContent = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - ${HEADER_HEIGHT}px);
`

const StyledLines1 = styled(HomeLines1)`
  top: 540px;
  left: -215px;
  position: absolute;
`

const StyledLines2 = styled(HomeLines2)`
  top: -48%;
  right: 20px;
  position: absolute;
`

const StyledLines3 = styled(HomeLines3)`
  top: 340px;
  right: 140px;
  position: absolute;
`

const Content = styled('div')`
  height: 100vh;
  position: relative;

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
      <Helmet>
        <title>Paddi</title>
      </Helmet>
      <ScrollRestoration />
      <Lines>
        <StyledLines1 />
        <StyledLines2 />
        <StyledLines3 />
      </Lines>
      <HeroContent>
        <Typography variant="h1" maxWidth={1030}>
          Train and build your own AI Agent
        </Typography>
        <Stack mt={6} columnGap={3} direction="row" alignItems="center">
          <Button
            variant="outlined"
            href={routes.faucet}
            startIcon={<TestNetIcon />}
          >
            Get Testnet Assets
          </Button>

          <Button
            variant="text"
            href="https://medium.com/@alteredstatemachine/asm-ai-protocol-demo-paddi-faq-1660b95c6ce9"
            target="_blank"
            startIcon={<ArrowRightIcon />}
            sx={{
              borderRadius: 0,
              borderBottom: '1px solid white',
              paddingBottom: '4px',
            }}
          >
            Learn about Paddi
          </Button>
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
            the open-source ASM AI Protocol in our GitHub repo.
          </Typography>
          <Stack mb={30}>
            <Typography mt={6} width={700} variant="body3" color="primary.dark">
              Get started by claiming testnet assets and learn how to play
              Paddi.
            </Typography>
            <Stack mt={3} columnGap={3} direction="row" alignItems="center">
              <Button
                variant="outlined"
                href={routes.faucet}
                startIcon={<TestNetIcon />}
              >
                Get Testnet Assets
              </Button>

              <Button
                href="https://medium.com/@alteredstatemachine/asm-ai-protocol-demo-paddi-faq-1660b95c6ce9"
                variant="text"
                target="_blank"
                startIcon={<ArrowRightIcon />}
                sx={{
                  borderRadius: 0,
                  borderBottom: '1px solid white',
                  paddingBottom: '4px',
                }}
              >
                Learn about Paddi
              </Button>
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
          You can read more about ASM Brains at{' '}
          <a
            href="https://www.alteredstatemachine.xyz/"
            target="_blank"
            rel="noreferrer"
          >
            alteredstatemachine.xyz
          </a>
        </Typography>
      </Content>
    </>
  )
}
