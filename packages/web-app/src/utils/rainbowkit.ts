import type { Theme } from '@rainbow-me/rainbowkit'
import { objectivMk1Family } from 'src/styles/fonts'
import { theme } from 'src/styles/theme'

export const rainbowTheme: Theme = {
  blurs: {
    modalOverlay: 'none',
  },
  colors: {
    accentColor: '#fff',
    accentColorForeground: '#000',
    actionButtonBorder: 'none',
    actionButtonBorderMobile: 'none',
    actionButtonSecondaryBackground: 'transparent',
    closeButton: '#fff',
    closeButtonBackground: 'transparent',
    connectButtonBackground: '#fff',
    connectButtonBackgroundError: theme.palette.error.main,
    connectButtonInnerBackground: 'transparent',
    connectButtonText: '#000',
    connectButtonTextError: '#fff',
    connectionIndicator: 'red',
    downloadBottomCardBackground: 'red',
    downloadTopCardBackground: 'red',
    error: theme.palette.error.main,
    generalBorder: theme.palette.background.border,
    generalBorderDim: 'none',
    menuItemBackground: 'none',
    modalBackdrop: 'rgba(0, 0, 0, 0.7)',
    modalBackground: '#000',
    modalBorder: theme.palette.background.border,
    modalText: '#fff',
    modalTextDim: 'none',
    modalTextSecondary: theme.palette.primary.dark,
    profileAction: '#000',
    profileActionHover: '#000',
    profileForeground: '#000',
    selectedOptionBorder: theme.palette.background.border,
    standby: '#fff',
  },
  fonts: {
    body: objectivMk1Family,
  },
  radii: {
    actionButton: '50px',
    connectButton: '50px',
    menuButton: '50px',
    modal: '50px',
    modalMobile: '50px',
  },
  shadows: {
    connectButton: 'none',
    dialog: '...',
    profileDetailsAction: 'none',
    selectedOption: 'none',
    selectedWallet: 'none',
    walletLogo: 'none',
  },
}
