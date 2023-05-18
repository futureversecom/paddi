import type { LinkProps, PaletteOptions } from '@mui/material'
import { createTheme } from '@mui/material'
import React from 'react'
import type { LinkProps as RouterLinkProps } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import {
  objectivBold,
  objectivMedium,
  objectivMk1Family,
  objectivRegular,
  objectivRegularItalic,
} from 'src/styles/fonts'

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>(function CustomLink(props, ref) {
  const { href, ...other } = props
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />
})

const palette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#fff',
    light: '#fff',
    dark: '#9c979c',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#e26eea',
    light: '#efaff3',
    dark: '#88428c',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.25)',
  },
  background: {
    paper: '#00000',
    default: '#070707',
  },
  action: {
    focus: 'rgba(0, 0, 0, 0.12)',
    hover: 'rgba(226, 110, 234, 0.3);',
    disabled: 'rgba(0, 0, 0, 0.38)',
    active: 'rgba(255, 255, 255, 0.8);',
    selected: 'rgba(255, 255, 255, 0.8);',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  },
}

export const theme = createTheme({
  palette,
})

theme.typography = {
  ...theme.typography,
  fontFamily: objectivMk1Family,
  h1: {
    ...theme.typography.h1,
    fontWeight: 700,
    lineHeight: '120%',
    letterSpacing: '-0.04em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(120),
  },
  h2: {
    ...theme.typography.h2,
    fontWeight: 700,
    lineHeight: '110%',
    letterSpacing: '-0.03em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(60),
  },
  h3: {
    ...theme.typography.h3,
    fontWeight: 700,
    lineHeight: '100%',
    letterSpacing: '-0.03em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(48),
  },
  h4: {
    ...theme.typography.h4,
    fontWeight: 700,
    lineHeight: '100%',
    letterSpacing: '-0.03em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(38),
  },
  h5: {
    ...theme.typography.h5,
    fontWeight: 700,
    lineHeight: '120%',
    letterSpacing: '-0.03em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(34),
  },
  h6: {
    ...theme.typography.h6,
    fontWeight: 700,
    lineHeight: '120%',
    letterSpacing: '-0.03em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(24),
  },
  body1: {
    ...theme.typography.body1,
    fontWeight: 400,
    lineHeight: '140%',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(18),
  },
  body2: {
    ...theme.typography.body2,
    fontWeight: 700,
    lineHeight: '136%',
    letterSpacing: '-0.02em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(22),
  },
  body3: {
    fontWeight: 500,
    lineHeight: '146%',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(22),
  },
  body4: {
    fontWeight: 700,
    lineHeight: '146%',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(22),
  },
  subtitle1: {
    ...theme.typography.subtitle1,
    fontWeight: 400,
    lineHeight: '140%',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(16),
  },
  subtitle2: {
    ...theme.typography.subtitle2,
    fontWeight: 500,
    lineHeight: '157%',
    letterSpacing: '-0.03em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(14),
  },
  caption: {
    ...theme.typography.caption,
    fontWeight: 400,
    display: 'block',
    lineHeight: '166%',
    letterSpacing: '-0.02em',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(12),
  },
  overline: {
    fontWeight: 400,
    lineHeight: '266%',
    textTransform: 'uppercase',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(12),
    letterSpacing: theme.typography.pxToRem(1),
  },
  button: {
    ...theme.typography.button,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    textTransform: 'uppercase',
    fontFamily: objectivMk1Family,
    fontSize: theme.typography.pxToRem(14),
    lineHeight: theme.typography.pxToRem(20),
  },
}

theme.components = {
  MuiCssBaseline: {
    styleOverrides: [
      objectivBold,
      objectivMedium,
      objectivRegular,
      objectivRegularItalic,
    ].join('\n'),
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        body3: 'p',
        body4: 'p',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        padding: theme.spacing(5, 0),
        backgroundImage: 'none',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
      LinkComponent: LinkBehavior,
    },
    styleOverrides: {
      root: {
        borderRadius: 50,
        padding: theme.spacing(2.75, 4.75),
      },
    },
  },
  MuiLink: {
    defaultProps: {
      underline: 'none',
      component: LinkBehavior,
    } as LinkProps,
    styleOverrides: {
      root: {
        display: 'flex',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        fontFamily: objectivMk1Family,
        fontSize: theme.typography.pxToRem(14),
        lineHeight: theme.typography.pxToRem(20),
      },
    },
    variants: [
      {
        props: { underline: 'always' },
        style: {
          textDecoration: 'none',
          borderBottom: '1px solid #fff',
        },
      },
    ],
  },
  MuiCard: {
    styleOverrides: {
      root: {
        padding: 0,
        borderRadius: 50,
        backgroundImage: 'none',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: { background: 'rgba(0, 0, 0, 0.85)' },
      paper: {
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: 50,
        background: 'black',
      },

      paperFullScreen: {
        border: '0',
        background: '#1E1E1E;',
        borderRadius: 0,
      },
    },
  },
}
