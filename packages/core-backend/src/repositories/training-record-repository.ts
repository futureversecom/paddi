import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { ChainAddress } from 'core/src/types/chain-address'
import type {
  TrainingRecord,
  TrainingRecordHK,
} from 'core-backend/src/entities/training-record'
import { TrainingRecordCodec } from 'core-backend/src/entities/training-record'
import * as Either from 'fp-ts/Either'
import * as Decoder from 'io-ts/Decoder'
/**
 *
 */
export class TrainingRecordRepository {
  /**
   *
   * @param docClient
   */
  public constructor(
    private docClient: DynamoDBDocument,
    private tableName: string,
  ) {}

  /**
   *
  async  * @param hk
   */
  async get(hk: TrainingRecordHK): Promise<TrainingRecord | null> {
    const data = await this.docClient.send(
      new GetCommand({
        Key: { hk },
        TableName: this.tableName,
      }),
    )

    return data.Item ? this.decodeRecord(data.Item) : null
  }

  async getByWalletAddress(
    userWalletAddress: ChainAddress,
  ): Promise<TrainingRecord[]> {
    const data = await this.docClient.send(
      new QueryCommand({
        ExpressionAttributeValues: {
          ':requestedBy': userWalletAddress,
        },
        IndexName: 'acp-demo-training-record-gsi', // todo use class member
        KeyConditionExpression: 'requestedBy = :requestedBy',
        ScanIndexForward: false,
        TableName: this.tableName,
      }),
    )

    return data.Items?.length ? data.Items.map(this.decodeRecord) : []
  }

  /**
   *
   * @param trainingRecord
   */
  async store(trainingRecord: TrainingRecord): Promise<void> {
    const encoded = TrainingRecordCodec.encode(trainingRecord)

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: encoded,
        ...(trainingRecord.version == 0
          ? { ConditionExpression: 'attribute_not_exists(hk)' }
          : {
              ConditionExpression: 'version = :version',
              ExpressionAttributeValues: {
                ':version': trainingRecord.version - 1,
              },
            }),
      }),
    )
  }

  /**
   *
   * @param item
   * @returns
   */
  private decodeRecord(item: unknown): TrainingRecord {
    const decoded = TrainingRecordCodec.decode(item)

    if (Either.isLeft(decoded)) {
      throw new Error(
        `Error decoding user record: ${Decoder.draw(decoded.left)}`,
      )
    }

    return decoded.right
  }
}
