import '@rainbow-me/rainbowkit/styles.css'
import 'react-toastify/dist/ReactToastify.css'

import { styled } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { pressStartFamily } from 'src/styles/fonts'

import { ConfirmationDialogProvider } from './components/common/ConfirmationContext'
import { QueryProvider } from './QueryProvider'
import { Router } from './Router'
import { StyleProvider } from './styles/StyleProvider'
import { Web3Provider } from './Web3Provider'

const StyledToasts = styled(ToastContainer)`
  .Toastify__toast-body {
    font-family: ${pressStartFamily};
  }
`

export const App = () => {
  return (
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
  )
}
