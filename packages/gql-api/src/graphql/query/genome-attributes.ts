import { isLeft } from 'fp-ts/Either'
import type {
  GenomeAttributesResponse,
  QueryResolvers,
} from 'src/generated/gql'

export const genomeAttributes: Required<QueryResolvers>['genomeAttributes'] =
  async (_parent, args, context): Promise<GenomeAttributesResponse> => {
    const result = await context.brainStatsService.genomeAttributes(
      args.tokenId,
    )
    return isLeft(result) ? result.left : result.right
  }
