import { Button, css, Grid, styled, Typography } from '@mui/material'
import type { BigNumberish } from 'ethers'
import { BigNumber } from 'ethers'
import type { FC } from 'react'
import { client } from 'src/graphql/client'
import { useGenomeAttributesQuery } from 'src/graphql/generated'
import { useBrainMetadata } from 'src/hooks/useBrainMetadata'

import { BrainImage } from './BrainImage'
import { GENOME_ATTRIBUTES, GenomeMatrix } from './GenomeMatrix'

type Props = {
  tokenId: BigNumberish
  onSelect: (id: number) => void
}

const Attribute = styled('span')(
  () =>
    css`
      display: flex;
      align-items: center;
    `,
)
const AttributeCircle = styled('div')(
  () =>
    css`
      width: 6px;
      height: 6px;
      background: red;
      display: inline-block;
      border-radius: 100px;
      margin-right: 5px;
    `,
)
const Container = styled('div')(
  ({ theme }) =>
    css`
      background: ${theme.palette.divider};
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #2f2f2f;
      border: 2px solid #ffffff;
    `,
)
const BrainContainer = styled('div')(
  () =>
    css`
      // flex: 1;
      height: 300px;
      overflow: hidden;
      position: relative;
    `,
)
const ContentContainer = styled('div')(
  () =>
    css`
      padding: 20px;
      padding-left: 40px;
      padding-right: 40px;
    `,
)
const BrainImageContainer = styled('div')(
  () =>
    css`
      position: absolute;
      width: 100px;
      height: 100px;
      bottom: 5px;
      right: 5px;
      background: #767676;
      padding: 10px;
      display: flex;
      align-items: center;
      z-index: 10;
    `,
)

const AttributeName = styled('span')`
  text-transform: capitalize;
  font-weight: normal;
  font-size: 16px;
`

const Title = styled(Typography)(
  () => css`
    font-size: 16px;
    line-height: 133.5%;
  `,
)
export const BrainPanel: FC<Props> = ({ tokenId, onSelect }) => {
  const tokenIdNum = BigNumber.from(tokenId).toNumber()
  const { data } = useGenomeAttributesQuery(client, {
    tokenId: tokenIdNum,
  })
  const attrs =
    data?.genomeAttributes.__typename === 'GenomeAttributesSuccessResponse'
      ? data?.genomeAttributes.genomeAttributes
      : null

  const { data: brainData } = useBrainMetadata(tokenIdNum)

  const onClick = () => {
    onSelect(tokenIdNum)
  }
  return (
    <Container>
      <BrainContainer>
        {brainData && <GenomeMatrix matrix={brainData.genome_matrix} />}
        <BrainImageContainer>
          <BrainImage id={tokenIdNum} fixedHeight={'100px'} />
        </BrainImageContainer>
      </BrainContainer>
      <ContentContainer>
        <Title variant="h5" sx={{ paddingBottom: '10px' }}>
          Brain #{tokenIdNum}
        </Title>

        <Grid container columns={2}>
          {attrs?.map(attr => {
            const config = GENOME_ATTRIBUTES.flatMap(a =>
              a.key === attr.name ? [a] : [],
            )[0]
            return (
              <Grid
                key={attr.name}
                item
                xs={1}
                sx={{ paddingBottom: '10px', fontWeight: 'bold' }}
              >
                <Attribute>
                  <AttributeCircle sx={{ background: config?.baseColor }} />
                  <AttributeName>{attr.name}:</AttributeName>
                  &nbsp;
                  {attr.__typename === 'GenomeAttributeHex' && attr.valueHex}
                  {attr.__typename === 'GenomeAttributeInt' && attr.valueInt}
                </Attribute>
              </Grid>
            )
          })}
        </Grid>
        <Button variant="outlined" sx={{ mt: 6 }} onClick={onClick}>
          Select Brain #{tokenIdNum}
        </Button>
      </ContentContainer>
    </Container>
  )
}
