import * as O from 'fp-ts/Option'

import type { MutationResolvers } from '../../generated/gql'

/**
 *
 * @param parent
 * @param args
 * @param context
 * @returns
 */
export const savePinnedNodeId: Required<MutationResolvers>['savePinnedNodeId'] =
  async (_parent, args, context) => {
    const record = await context.trainingService.getTraining(args.hash)

    if (record?.requestedBy !== context.walletAddress) {
      // Only record owner can update record
      return { success: false }
    }

    await context.trainingService.updateRecord({
      ...record,
      pinnedNodeId: O.fromNullable(args.nodeId),
    })
    return {
      success: true,
    }
  }
