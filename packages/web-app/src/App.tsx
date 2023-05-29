import '@rainbow-me/rainbowkit/styles.css'
import 'react-toastify/dist/ReactToastify.css'

import { styled } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import { objectivMk1Family } from 'src/styles/fonts'

import { ConfirmationDialogProvider } from './components/common/ConfirmationContext'
import { QueryProvider } from './QueryProvider'
import { Router } from './Router'
import { StyleProvider } from './styles/StyleProvider'
import { Web3Provider } from './Web3Provider'

const StyledToasts = styled(ToastContainer)`
  .Toastify__toast-body {
    font-size: 16px;
    font-weight: 500;
    line-height: 148%;
    font-family: ${objectivMk1Family};
  }
`

export const App = () => {
  return (
    <HelmetProvider>
      <StyleProvider>
        <QueryProvider>
          <Web3Provider>
            <ConfirmationDialogProvider>
              <Router />
              <StyledToasts />
            </ConfirmationDialogProvider>
          </Web3Provider>
        </QueryProvider>
      </StyleProvider>
    </HelmetProvider>
  )
}
