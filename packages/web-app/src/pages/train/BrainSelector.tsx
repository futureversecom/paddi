import {
  css,
  Dialog,
  DialogContent,
  Grid,
  styled,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import { useState } from 'react'
import { BrainImage } from 'src/components/Brain/BrainImage'
import { BrainPanel } from 'src/components/Brain/BrainPanel'
import { DescriptionBox } from 'src/components/common/DescriptionBox'
import { useBrainTokens } from 'src/hooks/contracts/useBrainContract'
import { secondaryFontFamily } from 'src/styles/theme'
import { reportEvent } from 'src/utils/ga'

const BrainSelectorContainer = styled('button')(
  ({ theme }) => css`
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    font-size: 24px;
    font-family: ${secondaryFontFamily};
    text-align: center;
    width: 100%;
    height: 120px;
    margin-bottom: 20px;
    flex-direction: column;
    align-items: center;
    border-color: ${theme.palette.text.primary};
    border-style: solid;
    border-width: 4px;
    cursor: pointer;
    background: none;
    color: ${theme.palette.text.primary};
  `,
)

const BrainImageContainer = styled('div')(
  () => css`
    position: absolute;
    top: -50px;
    bottom: -50px;
    width: 100%;
    z-index: -1;
    filter: grayscale(100%);
  `,
)

type Props = {
  address: string
  brainId?: number
  setBrainId: (id: number) => void
}
const GridItem = styled('div')(
  () =>
    css`
      min-height: 300px;
    `,
)

export const BrainSelector: FC<Props> = ({ address, brainId, setBrainId }) => {
  const { data: brainTokens } = useBrainTokens(address)
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Open Select Brain',
    })
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleSelectBrain = (id: number) => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Select Brain',
    })
    setBrainId(id)
    handleClose()
  }

  return (
    <>
      <BrainSelectorContainer onClick={handleOpen}>
        {brainId !== undefined ? (
          <>
            <BrainImageContainer>
              <BrainImage id={brainId} fixedHeight="100%" />
            </BrainImageContainer>
            <span>{`Brain #${brainId}`}</span>
          </>
        ) : (
          <span>Select Brain</span>
        )}
      </BrainSelectorContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
        <DialogContent>
          <DescriptionBox sx={{ my: 2, backgroundColor: 'transparent' }}>
            <Typography variant="h5">Select Brain</Typography>
            <p>
              Select a Gen ll Brain to train. Each brain has uniques attributes
              base on its genome Matrix. The attribute will have an influence on
              the training that occurs.
            </p>

            <Grid container spacing={3} columns={2}>
              {brainTokens?.map(tokenId => {
                const numberId = tokenId.toNumber()
                // Prevent overlap when there are two brains. Any better way?

                return (
                  <Grid key={numberId} padding={1} item xs={1}>
                    <GridItem>
                      <BrainPanel
                        tokenId={numberId}
                        onSelect={handleSelectBrain}
                      />
                    </GridItem>
                  </Grid>
                )
              })}
            </Grid>
          </DescriptionBox>
        </DialogContent>
      </Dialog>
    </>
  )
}
