import { Grid } from '@mui/material'
import type { BigNumber } from 'ethers'
import type { FC } from 'react'
import { useBrainTokens } from 'src/hooks/contracts/useBrainContract'

type Props = {
  address: string
}

export const BrainStatsGrid: FC<Props> = ({ address }) => {
  const { data: brainIds } = useBrainTokens(address)

  return (
    <Grid container spacing={2}>
      {brainIds &&
        (brainIds as BigNumber[]).map(tokenId => (
          <Grid item xs={12} md={6} lg={4} key={`${tokenId}`}>
            {/* <BrainPanel tokenId={tokenId} /> */}
          </Grid>
        ))}
    </Grid>
  )
}
