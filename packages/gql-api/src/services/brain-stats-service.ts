import { hexColourFromNumber } from 'core/src/types/hex-colour'
import type { BrainMetadataInteractions } from 'core-backend/src/assets/brain-metadata-interactions'
import type { GenomeMapping } from 'core-backend/src/assets/genome-attributes'
import {
  getAttributeValue,
  unflattenGenomeMatrix,
} from 'core-backend/src/assets/genome-attributes'
import { either } from 'fp-ts'
import { isLeft, right } from 'fp-ts/Either'
import type { Either } from 'fp-ts/lib/Either'
import type {
  GenomeAttribute,
  GenomeAttributeHex,
  GenomeAttributeInt,
  GenomeAttributesFailureResponse,
  GenomeAttributesSuccessResponse,
} from 'src/generated/gql'

type GenomeAttributesResult = Either<
  GenomeAttributesFailureResponse,
  GenomeAttributesSuccessResponse
>

export class BrainStatsService {
  public constructor(
    private brainMetadataInteractions: BrainMetadataInteractions,
  ) {}

  public async genomeAttributes(
    tokenId: number,
  ): Promise<GenomeAttributesResult> {
    const metadataResponse =
      await this.brainMetadataInteractions.getBrainMetadata(tokenId)

    if (isLeft(metadataResponse)) {
      return either.left({
        __typename: 'GenomeAttributesFailureResponse',
        reason: {
          __typename: 'InvalidTokenId',
        },
      })
    }

    const { genome_matrix } = metadataResponse.right
    const gMatrix = unflattenGenomeMatrix(genome_matrix)

    const genomeMappings: { [key: string]: GenomeMapping } = {
      colour: {
        areaX: 0,
        areaY: 3,
        areaDX: 5,
        areaDY: 5,
      },
      speed: {
        areaX: 20,
        areaY: 4,
        areaDX: 18,
        areaDY: 13,
      },
      strength: {
        areaX: 11,
        areaY: 21,
        areaDX: 13,
        areaDY: 12,
      },
      endurance: {
        areaX: 4,
        areaY: 14,
        areaDX: 11,
        areaDY: 12,
      },
      size: {
        areaX: 13,
        areaY: 16,
        areaDX: 5,
        areaDY: 19,
      },
    }

    const attributeValues: { [key: string]: number } = {}

    Object.keys(genomeMappings).map(key => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      attributeValues[key] = getAttributeValue(gMatrix, genomeMappings[key]!)
    })

    // Convert to output format

    const genomeAttributes: GenomeAttribute[] = Object.keys(
      attributeValues,
    ).map(name => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = attributeValues[name]!
      switch (name) {
        case 'colour':
          return {
            __typename: 'GenomeAttributeHex',
            name,
            value: hexColourFromNumber(value),
          } as GenomeAttributeHex
        default:
          return {
            __typename: 'GenomeAttributeInt',
            name,
            value: Math.round(value * 10),
          } as GenomeAttributeInt
      }
    })

    const result: GenomeAttributesSuccessResponse = {
      __typename: 'GenomeAttributesSuccessResponse',
      genomeAttributes,
    }

    return right(result)
  }
}
