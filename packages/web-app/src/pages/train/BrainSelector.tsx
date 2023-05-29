import { Dialog, DialogContent, Grid, styled, Typography } from '@mui/material'
import type { FC } from 'react'
import { useState } from 'react'
import { BrainImage } from 'src/components/Brain/BrainImage'
import { BrainPanel } from 'src/components/Brain/BrainPanel'
import type { ParentMemoryNodeConfig } from 'src/graphql/generated'
import { useBrainTokens } from 'src/hooks/contracts/useBrainContract'
import { reportEvent } from 'src/utils/ga'

import { MemorySelectorDialogContent } from './MemorySelector'
import { StepCard } from './StepCard'

const BrainImageContainer = styled('div')`
  top: 0;
  bottom: 0;
  z-index: -1;
  width: 100%;
  padding-top: 15px;
  position: absolute;
`

type Props = {
  address: string
  brainId?: number
  complete: boolean
  parentMemoryNodeConfig?: ParentMemoryNodeConfig
  setBrain: (param: {
    id: number
    parentMemoryNodeConfig: ParentMemoryNodeConfig
  }) => void
}

export const BrainSelector: FC<Props> = ({
  brainId,
  parentMemoryNodeConfig,
  address,
  setBrain,
  complete,
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
    <>
      <StepCard index={1} complete={complete} onClick={handleBrainDialogOpen}>
        {brainId !== undefined ? (
          <>
            <BrainImageContainer>
              <BrainImage id={brainId} fixedHeight="100%" />
            </BrainImageContainer>
            <Typography variant="body4">{`Brain #${brainId}`}</Typography>
            <Typography variant="body4">{`(Memory Node ${
              parentMemoryNodeConfig?.memoryId
                ? parentMemoryNodeConfig.memoryId
                : 'Untrained'
            })`}</Typography>
          </>
        ) : (
          <Typography variant="body4">
            Select Brain +<br />
            Memory Node
          </Typography>
        )}
      </StepCard>
      <Dialog
        fullWidth
        maxWidth={'md'}
        open={brainDialogOpen}
        onClose={handleBrainDialogClose}
      >
        <DialogContent>
          <Typography variant="h6">Pick your Brain</Typography>
          <Typography mt={2} mb={4} variant="body1">
            Every ASM Brain is created with a randomized set of base values
            known as a Genome Matrix. This gives your AI Agent a unique
            combination of strengths and weaknesses such as size, strength,
            speed, and endurance.
          </Typography>
          <Grid container spacing={3} columns={2}>
            {brainTokens?.map(tokenId => {
              const numberId = tokenId.toNumber()

              return (
                <Grid key={numberId} padding={1} item xs={1}>
                  <BrainPanel tokenId={numberId} onSelect={handleSelectBrain} />
                </Grid>
              )
            })}
          </Grid>
        </DialogContent>
      </Dialog>
      {_brainId && (
        <Dialog
          maxWidth="md"
          open={memoryDialogOpen}
          onClose={MemoryDialogClose}
        >
          <MemorySelectorDialogContent
            brainId={_brainId}
            handleSelectMemory={handleSelectMemory}
          />
        </Dialog>
      )}
    </>
  )
}
