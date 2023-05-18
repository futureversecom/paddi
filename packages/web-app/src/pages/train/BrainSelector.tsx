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
import type { ParentMemoryNodeConfig } from 'src/graphql/generated'
import { useBrainTokens } from 'src/hooks/contracts/useBrainContract'
import { reportEvent } from 'src/utils/ga'

import { MemorySelectorDialogContent } from './MemorySelector'
import { StepButton } from './StepButton'

const BrainImageContainer = styled('div')(
  () => css`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    padding-top: 15px;
    z-index: -1;
  `,
)

type Props = {
  address: string
  brainId?: number
  parentMemoryNodeConfig?: ParentMemoryNodeConfig
  setBrain: (param: {
    id: number
    parentMemoryNodeConfig: ParentMemoryNodeConfig
  }) => void
}
const GridItem = styled('div')(
  () =>
    css`
      min-height: 300px;
    `,
)

const Parent = styled('div')(
  () => css`
    position: relative;
  `,
)

export const BrainSelector: FC<Props> = ({
  brainId,
  parentMemoryNodeConfig,
  address,
  setBrain,
}) => {
  const [_brainId, _setBrainId] = useState<number>()
  const { data: brainTokens } = useBrainTokens(address)
  const [brainDialogOpen, setBrainDialogOpen] = useState(false)
  const handleBrainDialogOpen = () => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Open Select Brain',
    })
    setBrainDialogOpen(true)
  }
  const handleBrainDialogClose = () => setBrainDialogOpen(false)

  const handleSelectBrain = (id: number) => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Select Brain',
    })
    _setBrainId(id)

    handleBrainDialogClose()
    handleMemoryDialogOpen()
  }

  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false)
  const handleMemoryDialogOpen = () => {
    setMemoryDialogOpen(true)
  }
  const MemoryDialogClose = () => setMemoryDialogOpen(false)

  const handleSelectMemory = (config: ParentMemoryNodeConfig) => {
    if (!_brainId) {
      return
    }
    setBrain({
      id: _brainId,
      parentMemoryNodeConfig: config,
    })
    MemoryDialogClose()
  }

  return (
    <Parent>
      <StepButton
        onClick={handleBrainDialogOpen}
        $selected={brainId !== undefined}
      >
        <Typography mb={2}>Step 1</Typography>
        {brainId !== undefined ? (
          <>
            <BrainImageContainer>
              <BrainImage id={brainId} fixedHeight="100%" />
            </BrainImageContainer>
            <span>{`Brain #${brainId}`}</span>
            <span>{`(Memory Node ${
              parentMemoryNodeConfig?.memoryId
                ? parentMemoryNodeConfig.memoryId
                : 'Untrained'
            })`}</span>
          </>
        ) : (
          <span>Select Brain</span>
        )}
      </StepButton>

      <Dialog
        open={brainDialogOpen}
        onClose={handleBrainDialogClose}
        fullWidth
        maxWidth={'md'}
      >
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
      {_brainId && (
        <Dialog
          open={memoryDialogOpen}
          onClose={MemoryDialogClose}
          maxWidth="md"
        >
          <MemorySelectorDialogContent
            brainId={_brainId}
            handleSelectMemory={handleSelectMemory}
          />
        </Dialog>
      )}
    </Parent>
  )
}
