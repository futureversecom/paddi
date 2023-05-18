import { useTheme } from '@mui/material/styles'
import { darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { useMemo } from 'react'
import { objectivMk1Family } from 'src/styles/fonts'

export const useRainbowTheme = () => {
  const { palette } = useTheme()
  const { mode } = palette
  const theme = useMemo(() => {
    const theme = mode === 'dark' ? darkTheme() : lightTheme()
    theme.colors.accentColor = '#fff'
    theme.colors.accentColorForeground = '#000'
    theme.fonts.body = objectivMk1Family

    return theme
  }, [mode])

  return theme
}
