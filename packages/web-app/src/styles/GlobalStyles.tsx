import { GlobalStyles as MuiGlobalStyles } from '@mui/material'
import { css } from '@mui/material/styles'
import type { ReactElement } from 'react'

const styles = css`
  html {
    box-sizing: border-box;
    height: 100%;
  }

  body {
    min-height: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  body,
  button,
  a {
    font-feature-settings: 'tnum' on, 'lnum' on;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  *,
  *:after,
  *:before {
    box-sizing: inherit;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    height: 100%;
    overflow: auto;
  }
`

/**
 * Global base styles
 */
export const GlobalStyles = (): ReactElement => (
  <MuiGlobalStyles styles={styles} />
)
