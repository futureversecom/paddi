import {
  AppBar,
  Container,
  css,
  Link,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'
import {
  ASMLogo,
  ExternalLinkIcon,
  FooterLine,
  LogoSeperator,
  PaddiIcon,
  RootLogo,
} from 'src/assets/icons'
import allstarsUfoVideo from 'src/assets/videos/allstarsUfo.mp4'
import { Account } from 'src/components/Account'
import { reportEvent } from 'src/utils/ga'
import { routes } from 'src/utils/routes'

const SmallScreenWarning = styled('div')(
  ({ theme }) => css`
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    position: fixed;
    z-index: 100000;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(4)};
    background-color: ${theme.palette.background.default};
  `,
)

const AppContainer = styled('div')`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`

const HeaderContent = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const HeaderLink = styled(NavLink)(
  ({ theme }) => css`
    display: flex;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(14)};
    line-height: ${theme.typography.pxToRem(20)};
    transition: ${theme.transitions.create(['color', 'border-bottom-color'])};

    &.active {
      border-bottom: 1px solid #fff;
    }

    :hover {
      color: ${theme.palette.secondary.main};

      &.active {
        border-bottom-color: ${theme.palette.secondary.main};
      }
    }
  `,
)

const StyledLinkIcon = styled(ExternalLinkIcon)`
  margin-left: 4px;
`
const LogoSeperatorComponent = styled(LogoSeperator)`
  margin-left: 24px;
  margin-right: 24px;
`

const Main = styled('main')`
  flex: 1;
`

const Footer = styled('footer')(
  ({ theme }) => css`
    position: relative;
    margin: ${theme.spacing(80, 0, 0)};
    padding: ${theme.spacing(10, 0, 0)};

    ${theme.breakpoints.down(1300)} {
      margin: ${theme.spacing(70, 0, 0)};
    }

    ${theme.breakpoints.down(1150)} {
      margin: ${theme.spacing(60, 0, 0)};
    }

    ${theme.breakpoints.down(1000)} {
      margin: ${theme.spacing(50, 0, 0)};
    }
  `,
)

const VideoContainerOuter = styled('div')`
  left: 50%;
  width: 100%;
  bottom: -100px;
  max-width: 1400px;
  position: absolute;
  transform: translateX(-50%);
  z-index: -1;
`

const VideoContainerInner = styled('div')`
  width: 100%;
  height: 100%;
  position: relative;
`

const BlackFade = styled('div')(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: radial-gradient(
      rgba(0, 0, 0, 0) 25%,
      ${theme.palette.background.default} 90%
    );
  `,
)
const FooterContent = styled(Container)`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
`
const SmallPrint = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  padding-top: 50px;
  padding-bottom: 50px;
`
const Logos = styled('div')`
  flex: 0.1;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  padding-left: 24px;
`

const StyledFooterLine = styled(FooterLine)(
  ({ theme }) => css`
    width: 100%;
    position: absolute;
    top: ${theme.spacing(-26)};

    ${theme.breakpoints.down(1800)} {
      top: ${theme.spacing(-20)};
    }

    ${theme.breakpoints.down(1600)} {
      top: ${theme.spacing(-18)};
    }

    ${theme.breakpoints.down(1400)} {
      top: ${theme.spacing(-16)};
    }

    ${theme.breakpoints.down(1200)} {
      top: ${theme.spacing(-12)};
    }
  `,
)

const headerLinks = [
  {
    to: '/',
    label: 'Home',
  },
  {
    to: '/faucet',
    label: 'Testnet Assets',
  },
  {
    to: '/train',
    label: 'Training',
  },
]

const footerLinks = [
  {
    label: 'Futureverse',
    to: 'https://www.futureverse.com',
  },
  {
    label: 'ASM',
    to: 'https://www.alteredstatemachine.xyz',
  },
  {
    label: 'The Root Network',
    to: 'https://www.futureverse.com/technology/root',
  },
  {
    label: 'FAQS',
    to: 'https://medium.com/@alteredstatemachine/asm-ai-protocol-demo-paddi-faq-1660b95c6ce9',
  },
  {
    label: 'Discord',
    to: 'https://discord.com/invite/alteredstatemachine',
  },
]

export const Layout = () => {
  const theme = useTheme()
  const isBigScreen = useMediaQuery(theme.breakpoints.up('md'))

  const handleClick = (label: string) => {
    reportEvent('nav_click', {
      nav_label: label,
    })
  }

  return isBigScreen ? (
    <AppContainer>
      <AppBar position="static" elevation={0}>
        <HeaderContent>
          <Link href={routes.home} aria-label="Home">
            <PaddiIcon />
          </Link>
          <Stack component="nav" direction="row" columnGap={3}>
            {headerLinks.map(({ to, label }) => (
              <HeaderLink
                to={to}
                key={to}
                onClick={() => {
                  handleClick(label)
                }}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {label}
              </HeaderLink>
            ))}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/futureversecom/paddi"
            >
              GitHub
              <StyledLinkIcon />
            </Link>
          </Stack>

          <Account />
        </HeaderContent>
      </AppBar>
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
      <Footer>
        <VideoContainerOuter>
          <VideoContainerInner>
            <video width="100%" muted autoPlay loop>
              <source src={allstarsUfoVideo} type="video/mp4" />
            </video>
            <BlackFade />
          </VideoContainerInner>
        </VideoContainerOuter>
        <StyledFooterLine />

        <FooterContent>
          <Logos>
            <Link target="_blank" href="https://www.alteredstatemachine.xyz/">
              <ASMLogo />
            </Link>
            <LogoSeperatorComponent />
            <Link
              rel="noopener noreferrer"
              href="https://www.futureverse.com/technology/root"
            >
              <RootLogo />
            </Link>
          </Logos>
          <Stack direction="row" columnGap={3}>
            {footerLinks.map(({ to, label }) => (
              <Link
                key={to}
                href={to}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </Link>
            ))}
          </Stack>
        </FooterContent>
        <SmallPrint>
          {/* <Link href="/terms">
            <Typography
              variant="body1"
              sx={{ fontSize: '8px', marginRight: '5px' }}
            >
              Terms
            </Typography>
          </Link> */}
          <Link href="/privacy">
            <Typography
              variant="body1"
              sx={{ fontSize: '8px', marginLeft: '5px' }}
            >
              Privacy
            </Typography>
          </Link>
        </SmallPrint>
      </Footer>
    </AppContainer>
  ) : (
    <SmallScreenWarning>
      <Typography variant="h2" textAlign="center">
        This experience requires a bigger screen
      </Typography>
    </SmallScreenWarning>
  )
}
