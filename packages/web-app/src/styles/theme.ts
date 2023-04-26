import { createTheme, css } from '@mui/material/styles'

export const fontFamily = `'Work Sans', Roboto, Helvetica, Arial, sans-serif`
export const secondaryFontFamily = `'Press Start 2P', Roboto, Helvetica, Arial, sans-serif`

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
    },
  },
  typography: {
    fontFamily,
  },
})

theme.components = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => css`
        &.MuiButton-root {
          font-family: ${secondaryFontFamily};
          font-size: 12px;
          text-transform: none;
          border-radius: 0;
          height: 44px;
          border-width: 1px;
          padding-left: 50px;
          padding-right: 50px;
        }
        &.MuiButton-outlinedPrimary {
          color: ${theme.palette.text.primary};
          border-color: ${theme.palette.text.primary};
          &:hover {
            border-color: ${theme.palette.text.primary};
          }
        }
        &.MuiButton-containedPrimary {
          background-color: ${theme.palette.text.primary};
          color: ${theme.palette.background.default};
          &:hover {
            background-color: ${theme.palette.text.secondary};
          }
        }
      `,
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: () => css`
        &.MuiOutlinedInput-root {
          border-radius: 0;
        }
        .MuiSelect-select {
          padding-top: 12px;
          padding-bottom: 12px;
        }
      `,
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => css`
        .MuiTabs-indicator {
          background-color: ${theme.palette.text.primary};
        }
      `,
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => css`
        text-transform: none;
        font-weight: bold;
        &.MuiTab-textColorPrimary {
          color: ${theme.palette.text.primary};
        }
      `,
    },
  },
}

theme.typography = {
  ...theme.typography,
  h1: {
    ...theme.typography.h1,
    fontFamily: secondaryFontFamily,
  },
  h3: {
    ...theme.typography.h1,
    fontSize: '40px',
    fontFamily: secondaryFontFamily,
  },
  h5: {
    ...theme.typography.h5,
    fontFamily: secondaryFontFamily,
  },
  h6: {
    ...theme.typography.h6,
    fontFamily: secondaryFontFamily,
  },
  subtitle1: {
    ...theme.typography.subtitle2,
    fontSize: '16px',
    fontFamily: secondaryFontFamily,
  },
  subtitle2: {
    ...theme.typography.subtitle2,
    fontSize: '12px',
    fontFamily: secondaryFontFamily,
  },
}
