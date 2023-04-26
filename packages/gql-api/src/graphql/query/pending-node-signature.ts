import type { QueryResolvers } from '../../generated/gql'

export const pendingNodeSignature: Required<QueryResolvers>['pendingNodeSignature'] =
  async (_parent, args, context) => {
    const signature = await context.trainingService.getPendingNodeSig(args.hash)
    return {
      signature,
    }
  }
