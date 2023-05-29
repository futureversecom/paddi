import { ThreeDRotationOutlined } from '@mui/icons-material'
import {
  Button,
  Card,
  css,
  Grid,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import type { BigNumberish } from 'ethers'
import { BigNumber } from 'ethers'
import type { FC } from 'react'
import { useInView } from 'react-intersection-observer'
import { SquareIcon } from 'src/assets/icons'
import { client } from 'src/graphql/client'
import { useGenomeAttributesQuery } from 'src/graphql/generated'
import { useBrainMetadata } from 'src/hooks/useBrainMetadata'
import transientPropCheck from 'src/utils/transientPropCheck'

import { BrainImage } from './BrainImage'
import { GenomeMatrix, getGenomeConfigByName } from './GenomeMatrix'

type Props = {
  tokenId: BigNumberish
  onSelect: (id: number) => void
}

const AttributeSquare = styled(
  'div',
  transientPropCheck,
)<{ $color?: string }>(
  ({ $color }) =>
    css`
      width: 10px;
      height: 10px;
      margin-right: 5px;
      background: ${$color};
      display: inline-block;
    `,
)

const BrainContainer = styled('div')`
  height: 300px;
  overflow: hidden;
  position: relative;
`

const BrainImageContainer = styled('div')`
  right: 8px;
  bottom: 8px;
  z-index: 10;
  padding: 2px;
  width: 100px;
  height: 100px;
  display: flex;
  background: #000;
  position: absolute;
  align-items: center;
`

const RotateIcon = styled(ThreeDRotationOutlined)`
  left: 16px;
  bottom: 12px;
  z-index: 10;
  font-size: 32px;
  position: absolute;
`

const ContentContainer = styled('div')(
  ({ theme }) =>
    css`
      padding: ${theme.spacing(2, 3, 3)};
    `,
)

export const BrainPanel: FC<Props> = (props: Props) => {
  const { ref, inView } = useInView()
  return <Card ref={ref}>{inView && <Visual {...props} />}</Card>
}

const Visual: FC<Props> = ({ onSelect, tokenId }: Props) => {
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
    <>
      <BrainContainer>
        {brainData && <GenomeMatrix matrix={brainData.genome_matrix} />}
        <RotateIcon />
        <BrainImageContainer>
          <BrainImage id={tokenIdNum} fixedHeight={'100px'} />
        </BrainImageContainer>
      </BrainContainer>
      <ContentContainer>
        <Typography variant="body2">Brain #{tokenIdNum}</Typography>
        <Grid container columns={2} mt={2} mb={4}>
          {attrs
            ?.sort((a, b) => {
              const aExtended = getGenomeConfigByName(a.name)
              const bExtended = getGenomeConfigByName(b.name)
              if (!aExtended) return -1
              if (!bExtended) return 1
              if (aExtended?.order > bExtended?.order) return 1
              if (aExtended?.order < bExtended?.order) return -1

              return 0
            })
            .map(attr => {
              const config = getGenomeConfigByName(attr.name)

              return (
                <Grid item xs={1} pb={1} key={attr.name}>
                  <Stack direction="row" alignItems="center">
                    <AttributeSquare $color={config?.baseColor} />
                    <Typography textTransform="capitalize" variant="subtitle1">
                      {attr.name}:{' '}
                      {attr.__typename === 'GenomeAttributeHex' &&
                        attr.valueHex}
                      {attr.__typename === 'GenomeAttributeInt' &&
                        attr.valueInt}
                    </Typography>
                  </Stack>
                </Grid>
              )
            })}
        </Grid>
        <Button
          fullWidth
          variant="contained"
          onClick={onClick}
          startIcon={<SquareIcon />}
        >
          Select Brain #{tokenIdNum}
        </Button>
      </ContentContainer>
    </>
  )
}
