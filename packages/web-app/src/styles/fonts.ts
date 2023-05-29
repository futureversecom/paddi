import objectivBoldWoff2 from '/fonts/ObjektivMk1/ObjektivMk1Bold.woff2'
import objectivMediumWoff2 from '/fonts/ObjektivMk1/ObjektivMk1Medium.woff2'
import objectivRegularWoff2 from '/fonts/ObjektivMk1/ObjektivMk1Regular.woff2'
import objectivRegularItalicWoff2 from '/fonts/ObjektivMk1/ObjektivMk1RegularItalic.woff2'

interface FontStyle {
  woff2: string
  family: string
  weight: number
  style?: 'italic' | 'normal'
}

const objectivMk1 = 'Objektiv Mk1'
export const objectivMk1Family = `${objectivMk1}, Roboto, Helvetica, Arial, sans-serif`

const generateFontFace = ({
  woff2,
  family,
  weight,
  style = 'normal',
}: FontStyle) => `
  @font-face {
    font-style: ${style};
    font-display: optional;
    font-weight: ${weight};
    font-family: '${family}';
    src: url(${woff2}) format('woff2');
  }
`

export const objectivBold = generateFontFace({
  weight: 700,
  family: objectivMk1,
  woff2: objectivBoldWoff2,
})

export const objectivMedium = generateFontFace({
  weight: 500,
  family: objectivMk1,
  woff2: objectivMediumWoff2,
})

export const objectivRegular = generateFontFace({
  weight: 400,
  family: objectivMk1,
  woff2: objectivRegularWoff2,
})

export const objectivRegularItalic = generateFontFace({
  weight: 400,
  style: 'italic',
  family: objectivMk1,
  woff2: objectivRegularItalicWoff2,
})
