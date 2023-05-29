// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/named
import { Theme } from '@mui/material'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: React.CSSProperties
    body4: React.CSSProperties
    overline: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties
    body4?: React.CSSProperties
    overline: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true
    body4: true
    overline: true
  }
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    border: string
    darkGrey: string
    transparentBlack: string
  }
}
