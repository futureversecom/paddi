import { AppBar, Chip, Container, css, Stack, styled } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NavLink, Outlet } from 'react-router-dom'
import { reportEvent } from 'src/utils/ga'

const pages = [
  {
    label: 'Home',
    link: '/',
  },
  {
    label: 'Testnet Assets',
    link: '/faucet',
  },
  {
    label: 'Training',
    link: '/train',
  },
]

const FooterContainer = styled('footer')(() => css``)
const Footer = styled(Container)(
  () => css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'logo items';
    padding: 20px 0;
  `,
)
const LogoItem = styled('div')(() => css``)
const FooterItems = styled('ul')(
  () =>
    css`
      padding: 0;
      margin: 0;
      list-style: none;
      justify-self: flex-end;
      display: flex;
      align-items: center;
    `,
)
const FooterItem = styled('li')(
  () =>
    css`
      display: inline-block;
      padding-right: 10px;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
    `,
)
const HeaderBar = styled(AppBar)(
  () => css`
    background-color: #0c0c0c;
    background-image: none;
    box-shadow: none;
    padding: 20px 0;
  `,
)

const NavLinkContainer = styled(Container)(
  () =>
    css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    `,
)

const StyledNavLink = styled(NavLink)(
  ({ theme }) => css`
    font-weight: 800;
    padding: ${theme.spacing(2)};
    margin-right: ${theme.spacing(2)};
    color: ${theme.palette.text.secondary};
    &.active {
      color: ${theme.palette.text.primary};
    }
  `,
)

export const Layout = () => {
  const handleClick = (label: string) => {
    reportEvent('nav_click', {
      nav_label: label,
    })
  }
  return (
    <div>
      <HeaderBar position="static">
        <NavLinkContainer>
          {/* TODO: Remove this and use the logo img */}
          <div style={{ height: 66 }}></div>
          {/* <img
            src="/images/header_logo.png"
            alt="bati logo"
            width="95"
            height="66"
          /> */}
          <Stack component="div" direction="row" alignItems="center">
            {pages.map(({ label, link }) => (
              <StyledNavLink
                to={link}
                key={label}
                onClick={() => handleClick(label)}
              >
                {({ isActive }) => (
                  <span className={isActive ? 'is-active' : undefined}>
                    {label}
                  </span>
                )}
              </StyledNavLink>
            ))}

            <StyledNavLink
              to="https://github.com/futureversecom/acp-demo-open"
              target="_blank"
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <span>Github </span>
                <span className="material-symbols-outlined">open_in_new</span>
              </Stack>
            </StyledNavLink>
            <ConnectButton />
            <Chip
              label="Testnet"
              color="success"
              sx={{ color: '#fff', ml: 2 }}
            />
          </Stack>
        </NavLinkContainer>
      </HeaderBar>

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Container sx={{ mb: 10, mt: 7 }}>
        <Outlet />
      </Container>
      <FooterContainer>
        <Footer>
          <LogoItem>
            <img src="/images/asm.svg" alt="asm logo" width="95" height="66" />
          </LogoItem>
          <FooterItems>
            <FooterItem>
              <a
                target="_blank"
                href="https://www.futureverse.com/"
                rel="noreferrer"
              >
                Futureverse
              </a>
            </FooterItem>
            <FooterItem>
              <a
                target="_blank"
                href="https://www.alteredstatemachine.xyz/"
                rel="noreferrer"
              >
                ASM
              </a>
            </FooterItem>
            <FooterItem>
              <a
                target="_blank"
                href="https://cortex.alteredstatemachine.xyz/"
                rel="noreferrer"
              >
                Cortex
              </a>
            </FooterItem>
            <FooterItem>
              <a
                target="_blank"
                href="https://discord.com/invite/alteredstatemachine"
                rel="noreferrer"
              >
                Discord
              </a>
            </FooterItem>
          </FooterItems>
        </Footer>
      </FooterContainer>
    </div>
  )
}
