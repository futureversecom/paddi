import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { DeleteCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import * as Either from 'fp-ts/Either'
import * as Decoder from 'io-ts/Decoder'

import type { NonceRecord, NonceRecordHK } from '../entities/nonce'
import { NonceRecordCodec } from '../entities/nonce'
/**
 *
 */
export class LoginNonceRepository {
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
  async get(hk: NonceRecordHK): Promise<NonceRecord | null> {
    const data = await this.docClient.send(
      new GetCommand({
        Key: { hk },
        TableName: this.tableName,
      }),
    )

    return data.Item ? this.decodeRecord(data.Item) : null
  }

  /**
   *
  async  * @param hk
   */
  async delete(hk: NonceRecordHK): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        Key: { hk },
        TableName: this.tableName,
      }),
    )
  }

  /**
   *
   * @param nonce
   */
  async store(nonce: NonceRecord): Promise<void> {
    const encoded = NonceRecordCodec.encode(nonce)
    await this.docClient.send(
      new PutCommand({
        Item: encoded,
        TableName: this.tableName,
      }),
    )
  }

  /**
   *
   * @param item
   * @returns
   */
  private decodeRecord(item: unknown): NonceRecord {
    const decoded = NonceRecordCodec.decode(item)

    if (Either.isLeft(decoded)) {
      throw new Error(
        `Error decoding user record: ${Decoder.draw(decoded.left)}`,
      )
    }

    return decoded.right
  }
}
