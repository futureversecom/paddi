import type { Resolvers } from 'src/generated/gql'

import { authenticate as authenticateMutation } from './mutation/authenticate'
import { gasFaucet as gasFaucetMutation } from './mutation/gas-faucet'
import { savePinnedNodeId as savePinnedNodeIdMutation } from './mutation/save-pinned-node-id'
import { testAuth as testAuthMutation } from './mutation/test-auth'
import { trainingCancel as trainingCancelMutation } from './mutation/training-cancel'
import { trainingRequest as trainingRequestMutation } from './mutation/training-request'
import { genomeAttributes as genomeAttributesQuery } from './query/genome-attributes'
import { healthCheck as healthCheckQuery } from './query/health-check'
import { myTrainings as myTrainingsQuery } from './query/my-trainings'
import { nonce as nonceQuery } from './query/nonce'
import { pendingNodeSignature as pendingNodeSignatureQuery } from './query/pending-node-signature'
import { predictTrainingCost as predictTrainingCostQuery } from './query/predict-training-cost'
import { ChainAddressType } from './scalars'

export const rootResolver: Resolvers = {
  Query: {
    healthCheck: healthCheckQuery,
    nonce: nonceQuery,
    genomeAttributes: genomeAttributesQuery,
    predictTrainingCost: predictTrainingCostQuery,
    myTrainings: myTrainingsQuery,
    pendingNodeSignature: pendingNodeSignatureQuery,
  },

  Mutation: {
    testAuth: testAuthMutation,
    authenticate: authenticateMutation,
    gasFaucet: gasFaucetMutation,
    trainingRequest: trainingRequestMutation,
    savePinnedNodeId: savePinnedNodeIdMutation,
    trainingCancel: trainingCancelMutation,
  },

  // scalars
  ChainAddress: ChainAddressType,
}
