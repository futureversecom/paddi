import type { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

export class SecretManager {
  public constructor(private secretClient: SecretsManagerClient) {}

  getString = async (secretId: string): Promise<string> => {
    const command = new GetSecretValueCommand({
      SecretId: secretId,
    })
    const secret = await this.secretClient.send(command)

    if (!secret.SecretString) {
      throw new Error(`${secretId} to be a String secret`)
    }

    return secret.SecretString
  }
}
