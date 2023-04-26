import type { ChainAddress } from 'core/src/types/chain-address'
import type { LoginNonceRepository } from 'core-backend/src/repositories/login-nonce-repository'
import { either } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { sign, verify } from 'jsonwebtoken'
import { generateNonce } from 'siwe'

export class AuthenticationService {
  public constructor(
    private loginNonceRepository: LoginNonceRepository,
    private jwtSecret: string,
  ) {}

  generateNonce = async (walletAddress: ChainAddress): Promise<string> => {
    const nonce = generateNonce()
    await this.loginNonceRepository.store({
      hk: walletAddress,
      nonce,
      walletAddress,
    })
    return nonce
  }

  verifyNonce = async (walletAddress: ChainAddress, nonce: string) => {
    const nonceRecord = await this.loginNonceRepository.get(walletAddress)
    if (nonceRecord?.nonce === nonce) {
      await this.loginNonceRepository.delete(walletAddress)
      return true
    }
    return false
  }

  /**
   * Generates a JWT based on the user's wallet address.
   * TODO: consider to add expiration time
   * @param walletAddress - user's wallet address
   * @returns signed JWT
   */
  generateJwt = (walletAddress: ChainAddress): string => {
    return sign(
      {
        sub: walletAddress,
      },
      this.jwtSecret,
    )
  }

  /**
   * Given a JWT token, decodes its payload and ensures its valid.
   * @param jwtToken - JWT generated on successful captcha verification
   * @returns JWT error if validation failed, user's wallet address otherwise.
   */
  verifyJwt = (jwtToken: string) => {
    return pipe(
      either.tryCatch(() => verify(jwtToken, this.jwtSecret), either.toError),
      either.map(payload => payload.sub),
    )
  }
}
