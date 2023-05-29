import {
  Box,
  Button,
  Card,
  css,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  styled,
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
import { SquareIcon } from 'src/assets/icons'
import { BrainImage } from 'src/components/Brain/BrainImage'
import { useConfirmationDialog } from 'src/components/common/ConfirmationContext'
import { ShareLinkModal } from 'src/components/common/ShareLinkModal'
import { client } from 'src/graphql/client'
import type { EvaluationOutput, Training } from 'src/graphql/generated'
import {
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

import { LearningParametersModal } from './LearningParametersModal'
import { NormalizedNodeId } from './NormalizedNodeId'
import { preTrainedModel } from './preTrainedModel'
import { TrainingStateIndicator } from './TrainingStateIndicator'
import { TrainingStatsModal } from './TrainingStatsModal'

const LearningParametersText = styled(Typography)(
  ({ theme }) => css`
    cursor: pointer;
    border-bottom: 1px solid #fff;
    transition: ${theme.transitions.create(['color', 'border-bottom-color'])};

    :hover {
      color: ${theme.palette.secondary.main};
      border-bottom-color: ${theme.palette.secondary.main};
    }
  `,
)

const PinMemoryContainer = styled('div')(
  ({ theme }) =>
    css`
      display: flex;
      background-color: #111;
      justify-content: flex-end;
      padding: ${theme.spacing(2, 4)};

      button {
        width: 50%;
      }
    `,
)

const ReplayContainer = styled('div')`
  height: 100%;
  display: flex;
  border-radius: 50px;
  align-items: flex-start;
  background-color: #000;
`

const ReplayContentCard = styled('div')(
  ({ theme }) =>
    css`
      display: flex;
      min-width: 320px;
      border-radius: 50px;
      flex-direction: column;
      align-items: flex-start;
      padding: ${theme.spacing(6, 4)};
      margin: ${theme.spacing(2, 0, 0, 2)};
      border: 1px solid ${theme.palette.background.border};
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
  const [learningParamsModalOpen, setLearningParamsModalOpen] = useState(false)
  const [currentEvaluation, setCurrentEvaluation] = useState<
    EvaluationOutput | undefined
  >(undefined)

  const [replayPath, setReplayPath] = useState<string>()

  const isEvaluated =
    !!training.evaluationOutput && training.evaluationOutput.length >= 4

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
      const rawName = model?.agentName
      const name = rawName === 'AllRounder' ? 'All Rounder' : rawName

      return name
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

  const paddleRName = currentEvaluation
    ? currentEvaluation.evaluationId === 'AllRounder'
      ? 'All Rounder'
      : currentEvaluation.evaluationId
    : 'Opponent'

  const brainsData: BrainsData | null = hexAttribute
    ? {
        paddle_l: {
          color: hexAttribute.valueHex,
          name: `Brain ${training.brainId}`,
        },
        paddle_r: { color: 'red', name: paddleRName },
      }
    : null

  const pinnedNodeId = training.pinnedNodeId
    ? Number.parseInt(training.pinnedNodeId)
    : 0

  return (
    <>
      <Card>
        <Stack p={6}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography component="h2" variant="h5">
              Training Session
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">
                {new Date(training.timestamp).toLocaleString()}
              </Typography>
              <TrainingStateIndicator
                state={training.recordState}
                totalUnits={training.units}
                completedUnits={training.completedUnits}
                cancelTraining={handleCancelTraining}
              />
            </Stack>
          </Stack>
          <Stack direction="row" mt={4}>
            <Box component="div">
              <Typography variant="body2">Training Parameters</Typography>
              <Typography variant="body1" color="primary.dark">
                A recap of your training input for this session.
              </Typography>
              <Stack direction="row" justifyContent="space-between" mt={4}>
                <Box component="div" width={150}>
                  <BrainImage id={training.brainId} fixedHeight="100%" />
                </Box>
                <Box component="div" ml={2} mr={8}>
                  <Typography variant="body2" mb={2}>
                    #{training.brainId}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    Memory Node: {pinnedNodeId}
                  </Typography>
                  <LearningParametersText
                    role="button"
                    variant="body1"
                    mb={1}
                    onClick={() => {
                      setLearningParamsModalOpen(true)
                    }}
                  >
                    Learning Parameter Values
                  </LearningParametersText>
                  <Typography variant="body1" mb={1}>
                    {opponentName} Opponent
                  </Typography>
                  <Typography variant="body1">
                    Training Units ({training.units})
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box component="div" flex="1">
              <Typography variant="body2">Model Evaluation</Typography>
              <Typography variant="body1" color="primary.dark">
                Training model evaluation against all training opponents.
              </Typography>
              <Box mt={4} pl={2} component="div" position="relative">
                <Box
                  top="50%"
                  left={0}
                  width="1px"
                  height="90%"
                  component="div"
                  position="absolute"
                  sx={{
                    backgroundColor: 'background.border',
                    transform: 'translateY(-50%)',
                  }}
                />
                {training.evaluationOutput?.map(evaluation => {
                  const replayPath =
                    import.meta.env.VITE_REPLAY_ENDPOINT + evaluation.replayPath
                  const name =
                    evaluation.evaluationId === 'AllRounder'
                      ? 'All Rounder'
                      : evaluation.evaluationId

                  return (
                    <Box
                      key={evaluation.evaluationId}
                      component="div"
                      marginBottom={1}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Typography
                          minWidth={110}
                          variant="body1"
                          textTransform="capitalize"
                        >
                          {name}:
                        </Typography>
                        <Stack flex={1} direction="row" spacing={1}>
                          <Box flex={1} component="div">
                            <Button
                              fullWidth
                              size="small"
                              variant="outlined"
                              sx={{ height: '100%' }}
                              onClick={() => handleOpen(replayPath, evaluation)}
                            >
                              Game Replay
                            </Button>
                          </Box>
                          {evaluation && (
                            <Box flex={1} component="div">
                              <TrainingStatsModal
                                evaluation={evaluation}
                                rewardConfig={training.rewardConfig}
                              />
                            </Box>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Stack>
        </Stack>
        <PinMemoryContainer>
          <Button
            onClick={handlePin}
            disabled={hasPinned || isPinning || !isEvaluated}
            startIcon={<SquareIcon />}
          >
            {isPinning ? (
              'Pinning Memory'
            ) : hasPinned ? (
              <>
                Memory Saved (Node:{' '}
                <NormalizedNodeId
                  nodeId={pinnedNodeId}
                  brainId={training.brainId}
                />
                )
              </>
            ) : (
              'Save Memory'
            )}
          </Button>
        </PinMemoryContainer>
      </Card>
      <LearningParametersModal
        open={learningParamsModalOpen}
        rewardConfig={training.rewardConfig}
        handleClose={() => {
          setLearningParamsModalOpen(false)
        }}
      />

      <Dialog open={open} onClose={handleClose} fullScreen>
        {replayPath && brainsData && currentEvaluation && (
          <>
            <Typography variant="subtitle1" pl={4} pt={2}>{`${new Date(
              training.timestamp,
            ).toLocaleString()} `}</Typography>
            <DialogContent sx={{ mb: '10px', pb: 0 }}>
              <ReplayContainer>
                <ReplayContentCard>
                  <Box component="div" ml={2} width={175} height={175}>
                    <BrainImage id={training.brainId} fixedHeight="100%" />
                  </Box>
                  <Box mt={2} component="div">
                    <Typography variant="body2" mb={2}>
                      #{training.brainId}
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      Memory Node: {pinnedNodeId}
                    </Typography>
                    <LearningParametersText
                      role="button"
                      variant="body1"
                      mb={1}
                      onClick={() => {
                        setLearningParamsModalOpen(true)
                      }}
                    >
                      Learning Parameter Values
                    </LearningParametersText>
                    <Typography variant="body1" mb={1}>
                      {opponentName} Opponent
                    </Typography>
                    <Typography variant="body1">
                      Training Units ({training.units})
                    </Typography>
                  </Box>
                </ReplayContentCard>
                <Pong path={replayPath} brainsData={brainsData} />
              </ReplayContainer>
            </DialogContent>
            <DialogActions sx={{ mb: 2, mr: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ width: 280 }}
              >
                Close
              </Button>
              <ShareLinkModal
                link={`${window.location.origin}/replay?replay_path=${replayPath}`}
                title="Share"
              />
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
