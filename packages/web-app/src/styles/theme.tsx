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
    darkGrey: '#404040',
    border: 'rgba(255, 255, 255, 0.4)',
    transparentBlack: 'rgba(0, 0, 0, 0.85)',
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
      outlined: {
        '&:hover': {
          backgroundColor: '#120A12',
          borderColor: theme.palette.background.border,
        },
        '&:disabled': {
          opacity: 0.5,
          color: '#fff',
          borderColor: theme.palette.background.border,
        },
      },
      contained: {
        '&:hover': {
          backgroundColor: '#D5D1D5',
        },
        '&:disabled': {
          color: theme.palette.background.default,
          backgroundColor: theme.palette.background.border,
        },
      },
      text: {
        padding: 0,
        '&:hover': {
          backgroundColor: 'transparent',
          color: theme.palette.secondary.main,
        },
      },
      sizeSmall: {
        padding: theme.spacing(1.75, 3.75),
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
        transition: theme.transitions.create('color'),
        '&:hover': {
          color: theme.palette.secondary.main,
        },
      },
    },
    variants: [
      {
        props: { underline: 'always' },
        style: {
          textDecoration: 'none',
          borderBottom: '1px solid #fff',
          transition: theme.transitions.create(['color', 'borderBottomColor']),
          '&:hover': {
            color: theme.palette.secondary.main,
            borderBottomColor: theme.palette.secondary.main,
          },
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
        border: `1px solid ${theme.palette.background.border}`,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: { background: theme.palette.background.transparentBlack },
      paper: {
        borderRadius: 50,
        background: 'black',
        border: `1px solid ${theme.palette.background.border}`,
      },

      paperFullScreen: {
        border: '0',
        background: '#1E1E1E;',
        borderRadius: 0,
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: theme.spacing(5, 4, 4),
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.background.border,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        zIndex: 1,
        borderRadius: 30,
        color: theme.palette.text.primary,
        transition: theme.transitions.create(['color', 'backgroundColor']),
        '&.Mui-selected': {
          color: '#000',
          '&:hover': {
            backgroundColor: '#fff',
          },
        },
        '&:hover': {
          backgroundColor: '#120A12',
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      flexContainer: {
        borderRadius: 30,
        border: `1px solid ${theme.palette.background.border}`,
      },
      indicator: {
        height: '100%',
        borderRadius: 30,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      list: {
        padding: 0,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontWeight: 400,
        padding: theme.spacing(1, 2),
        fontSize: theme.typography.pxToRem(16),
        letterSpacing: theme.typography.pxToRem(1),
        backgroundColor: theme.palette.background.default,
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
        '&.Mui-selected': {
          backgroundColor: theme.palette.secondary.main,
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          },
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      outlined: {
        fontWeight: 700,
        lineHeight: '148%',
        fontFamily: objectivMk1Family,
        color: theme.palette.text.primary,
        fontSize: theme.typography.pxToRem(12),
        letterSpacing: theme.typography.pxToRem(1),
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
      input: {
        fontWeight: 400,
        lineHeight: '266%',
        padding: theme.spacing(1.5, 2),
        fontSize: theme.typography.pxToRem(16),
        letterSpacing: theme.typography.pxToRem(1),
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontWeight: 500,
        lineHeight: '160%',
        fontFamily: objectivMk1Family,
        color: theme.palette.text.primary,
        fontSize: theme.typography.pxToRem(12),
        backgroundColor: theme.palette.background.darkGrey,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        backgroundColor: '#383838',
      },
      label: {
        fontWeight: 400,
        lineHeight: '148%',
        fontFamily: objectivMk1Family,
        fontSize: theme.typography.pxToRem(12),
      },
      colorSecondary: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.main,
      },
    },
  },
}
