import {
  Box,
  Button,
  css,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import type { BigNumber } from 'ethers'
import { utils } from 'ethers'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import type { BrainsData } from 'replay-component/src/components/Pong/Pong'
import Pong from 'replay-component/src/components/Pong/Pong'
import { BrainImage } from 'src/components/Brain/BrainImage'
import { useConfirmationDialog } from 'src/components/common/ConfirmationContext'
import { ShareLinkModal } from 'src/components/common/ShareLinkModal'
import { client } from 'src/graphql/client'
import type { EvaluationOutput, Training } from 'src/graphql/generated'
import {
  TrainingState,
  useGenomeAttributesQuery,
  usePendingNodeSignatureQuery,
  useSavePinnedNodeIdMutation,
  useTrainingCancelMutation,
} from 'src/graphql/generated'
import {
  useAddMemoryTree,
  useAddNode,
  useMemoryTreesOfBrain,
} from 'src/hooks/contracts/useMemoryTreeContract'
import { reportEvent } from 'src/utils/ga'

import { NormalizedNodeId } from './NormalizedNodeId'
import { preTrainedModel } from './preTrainedModel'
import { TrainingInputModal } from './TrainingInputModal'
import { TrainingStateIndicator } from './TrainingStateIndicator'
import { TrainingStatsModal } from './TrainingStatsModal'

const ReplayGrid = styled(Grid)({
  height: '100%',
  background: 'black',
  borderRadius: '50px',
  textAlign: 'left',
})
const Container = styled('div')(
  () =>
    css`
      background-color: #1b1b1b;
      padding: 60px 32px;
      margin-bottom: 44px;
    `,
)

type Props = {
  training: Training
}

export const TrainingRecord: FC<Props> = ({ training }) => {
  const showDialog = useConfirmationDialog()
  const { data: memoryTreesOfBrain } = useMemoryTreesOfBrain(training.brainId)
  const storageURI = training.trainingOutput?.outputPath
  const hasPinned = !!training.pinnedNodeId // Has pinned on chain and to the database
  const pinnedMemoryNode = memoryTreesOfBrain?.memoryTrees?.nodes
    ? Object.values(memoryTreesOfBrain?.memoryTrees.nodes).find(
        node => node.storageURI === storageURI,
      )
    : undefined

  const [isPinning, setIsPinning] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentEvaluation, setCurrentEvaluation] = useState<
    EvaluationOutput | undefined
  >(undefined)

  const [replayPath, setReplayPath] = useState<string>()

  const handleOpen = (replayPath: string, evaluation: EvaluationOutput) => {
    reportEvent('button_click', {
      page_title: 'Training History',
      button_name: 'Watch Replay',
    })
    setOpen(true)
    setCurrentEvaluation(evaluation)
    setReplayPath(replayPath)
  }
  const handleClose = () => {
    setOpen(false)
    setReplayPath(undefined)
    setCurrentEvaluation(undefined)
  }

  const { refetch: fetchPendingNodeSignature } = usePendingNodeSignatureQuery(
    client,
    { hash: training.hash },
    { enabled: false },
  )

  const queryClient = useQueryClient()
  const { mutateAsync: addMemoryTree } = useAddMemoryTree(training.brainId)
  const { mutateAsync: addNode } = useAddNode(training.brainId)
  const { mutateAsync: cancelTraining } = useTrainingCancelMutation(client, {
    onSuccess: () => queryClient.invalidateQueries(['myTrainings']),
  })
  const { mutateAsync: savePinnedNodeId } = useSavePinnedNodeIdMutation(
    client,
    {
      onSuccess: () => queryClient.invalidateQueries(['myTrainings']),
    },
  )

  const handleCancelTraining = () => {
    showDialog({
      title: 'Cancel training',
      content: 'Are you sure you want to cancel this training?',
      onConfirm: async () => {
        await toast.promise(() => cancelTraining({ hash: training.hash }), {
          pending: 'Canceling training...',
          success: 'Training Canceled!',
          error: 'Cancel training failed!',
        })
      },
    })
    return
  }

  const handlePin = async () => {
    reportEvent('button_click', {
      page_title: 'Training History',
      button_name: 'Pin to the memory tree',
    })
    setIsPinning(true)
    const { data } = await fetchPendingNodeSignature()
    const pendingNodeSignature = data?.pendingNodeSignature
    if (!pendingNodeSignature) {
      setIsPinning(false)
      return toast('Get Signature error', { type: 'error' })
    }
    if (!storageURI) {
      setIsPinning(false)
      return toast('Cannot pin an unfinished training', { type: 'error' })
    }

    const pinMemoryOnChain = async () => {
      const nodeHash = utils.hexlify(utils.zeroPad(training.hash, 32))
      let result
      if (!training.parentNodeId) {
        result = await addMemoryTree({
          nodeHash,
          storageURI,
          signature: pendingNodeSignature.signature,
        })
      } else {
        result = await addNode({
          parentId: training.parentNodeId,
          nodeHash,
          storageURI,
          signature: pendingNodeSignature.signature,
        })
      }

      const event = result.events?.find(e => e.event === 'MemoryNodeAdded')
      const nodeId = event?.args?.['nodeId'] as BigNumber | undefined
      return nodeId?.toString()
    }

    const pinMemory = async () => {
      // if (pinned on contract) -> store to db the memoryId
      // else -> pin to contract and store to db
      const nodeId =
        pinnedMemoryNode?.id.toString() ?? (await pinMemoryOnChain())
      if (nodeId) {
        try {
          await savePinnedNodeId({
            hash: training.hash,
            nodeId: nodeId.toString(),
          })
        } catch (error) {
          setIsPinning(false)
        } finally {
          setIsPinning(false)
        }
      } else {
        setIsPinning(false)
      }
    }

    return toast
      .promise(pinMemory, {
        pending: 'Pinning memory node...',
        success: 'Memory node Pinned!',
        error: 'Pin memory node failed!',
      })
      .finally(() => {
        setIsPinning(false)
      })
  }

  const opponentName = useMemo(() => {
    if (training.scenario.__typename === 'AgentScenario') {
      const scenario = training.scenario
      const model = preTrainedModel.find(
        p => p.agentType === scenario.agentType,
      )

      return model?.agentName
    }
    return 'Wall'
  }, [training])

  const { data } = useGenomeAttributesQuery(client, {
    tokenId: training.brainId,
  })
  const attrs =
    data?.genomeAttributes.__typename === 'GenomeAttributesSuccessResponse'
      ? data?.genomeAttributes.genomeAttributes
      : null

  const hexAttribute =
    attrs?.flatMap(a =>
      a.__typename === 'GenomeAttributeHex' ? [a] : [],
    )[0] ?? null

  const brainsData: BrainsData | null = hexAttribute
    ? {
        paddle_l: {
          color: hexAttribute.valueHex,
          name: `Brain ${training.brainId}`,
        },
        // TODO: hardcoded for pre-trained agents
        paddle_r: { color: 'red', name: opponentName },
      }
    : null

  const pinnedNodeId = training.pinnedNodeId
    ? Number.parseInt(training.pinnedNodeId)
    : 0

  return (
    <>
      <Container>
        <Stack spacing={3}>
          <div>
            <Typography
              sx={{ fontSize: 22, fontWeight: 900 }}
            >{`Brain #${training.brainId} - Trained against ${opponentName} opponent`}</Typography>

            <Typography sx={{ my: 1 }}>
              {new Date(training.timestamp).toLocaleString()}
            </Typography>
            <TrainingStateIndicator
              state={training.recordState}
              totalUnits={training.units}
              completedUnits={training.completedUnits}
              cancelTraining={handleCancelTraining}
            />
          </div>

          {training.evaluationOutput && (
            <>
              <Typography sx={{ alignItems: 'center', display: 'flex' }}>
                Training Model evaluation against all training opponents
                <Tooltip
                  placement="top-start"
                  title="Each new model trains against an opponent. The new model is then tested against all opponents. Helping you assess overall change in performance."
                >
                  <span className="material-symbols-outlined">help</span>
                </Tooltip>
              </Typography>

              <div>
                {training.evaluationOutput.map(evaluation => {
                  const replayPath =
                    import.meta.env.VITE_REPLAY_ENDPOINT + evaluation.replayPath

                  const replayLink = `${window.location.protocol}//${window.location.host}/replay?replay_path=${replayPath}`
                  return (
                    <Box
                      key={evaluation.evaluationId}
                      component={'div'}
                      marginBottom={1}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          textTransform="capitalize"
                          variant="subtitle2"
                          sx={{
                            width: '150px',
                          }}
                        >{`${evaluation.evaluationId}: `}</Typography>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpen(replayPath, evaluation)}
                        >
                          Replay
                        </Button>

                        {evaluation && (
                          <TrainingStatsModal
                            evaluation={evaluation}
                            rewardConfig={training.rewardConfig}
                          />
                        )}

                        <ShareLinkModal link={replayLink} title="Share" />
                      </Stack>
                    </Box>
                  )
                })}
              </div>
            </>
          )}
        </Stack>
        {training.recordState === TrainingState.Completed && (
          <Button
            variant="outlined"
            onClick={handlePin}
            disabled={hasPinned || isPinning}
            sx={{ mt: '48px', ml: '158px' }}
          >
            {isPinning ? (
              `Pinning Memory`
            ) : hasPinned ? (
              <span>
                Memory Saved (Node:{' '}
                <NormalizedNodeId
                  brainId={training.brainId}
                  nodeId={pinnedNodeId}
                />
                )
              </span>
            ) : (
              `Save Memory`
            )}
          </Button>
        )}
      </Container>

      <Dialog open={open} onClose={handleClose} fullScreen>
        {replayPath && brainsData && currentEvaluation && (
          <>
            <Typography variant="subtitle1" pl={4} pt={2}>{`${new Date(
              training.timestamp,
            ).toLocaleString()} `}</Typography>
            <DialogContent sx={{ mb: '10px', pb: 0 }}>
              <ReplayGrid container>
                <Grid item xs={5}>
                  <Grid container height={'100%'} paddingTop={'30px'}>
                    <Grid item xs={6} padding={'30px'}>
                      <BrainImage
                        id={training.brainId}
                        fixedHeight="100%"
                        isCentered={false}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        #{training.brainId}
                      </Typography>
                      {/* <p>Brain Id: #{training.brainId}</p> */}
                      <p>Memory Node: {pinnedNodeId}</p>

                      <TrainingInputModal
                        rewardConfig={training.rewardConfig}
                      />
                      <p>{currentEvaluation.evaluationId} Opponent</p>
                      <p>Training rounds({training.units})</p>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={7}>
                  <Pong path={replayPath} brainsData={brainsData} />
                </Grid>
              </ReplayGrid>
            </DialogContent>
            <DialogActions sx={{ mb: 2, mr: 2 }}>
              <Button variant="outlined" onClick={handleClose}>
                Close
              </Button>
              <ShareLinkModal link={replayPath} title="Share" />
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
