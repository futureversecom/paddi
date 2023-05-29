import { Card, css, Divider, styled, Typography } from '@mui/material'

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const ImageContainer = styled('div')(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: ${theme.spacing(0, 3, 2)};

    img {
      width: 95px;
      align-self: center;
      margin: ${theme.spacing(6, 4, 4)};
    }
  `,
)

const ContentContainer = styled('div')(
  ({ theme }) => css`
    padding: ${theme.spacing(2, 3, 4)};
  `,
)

type Asset = 'XRP' | 'ASTO' | 'Brain'

type FaucetPanelProps = {
  imgPath: string
  balance: string
  explainer: string
  children: React.ReactNode
  type: Asset
}

const getFaucetTypeInfo = (type: Asset) => {
  switch (type) {
    case 'XRP':
      return { title: '1. XRP', currency: '$XRP' }
    case 'ASTO':
      return { title: '2. ASTO', currency: '$ASTO' }
    case 'Brain':
      return { title: '3. ASM Brain', currency: 'ASM Brain(s)' }
  }
}

export const FaucetPanel = ({
  type,
  children,
  imgPath,
  explainer,
  balance,
}: FaucetPanelProps) => {
  const { title, currency } = getFaucetTypeInfo(type)

  return (
    <StyledCard>
      <ImageContainer>
        <img src={imgPath} />
        <Typography mb={1} variant="body4">
          {title}
        </Typography>
        <Typography variant="body1" color="primary.dark">
          {explainer}
        </Typography>
      </ImageContainer>
      <Divider />
      <ContentContainer>
        <Typography variant="overline" color="primary.dark">
          You have:
        </Typography>
        <Typography variant="body2" mb={4}>
          {balance} {currency}
        </Typography>
        {children}
      </ContentContainer>
    </StyledCard>
  )
}
