import { CssBaseline } from '@mui/material'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import type { ReactElement, ReactNode } from 'react'

import { GlobalStyles } from './GlobalStyles'
import { theme } from './theme'

interface StyleProviderProps {
  readonly children: ReactNode
}

/**
 *
 * @param props
 */
export function StyleProvider(props: StyleProviderProps): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <GlobalStyles />
        {props.children}
      </StyledEngineProvider>
    </ThemeProvider>
  )
}
