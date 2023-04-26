import type { ErrorCode } from '@ethersproject/logger'

export type EthersError = Error & {
  reason: string
  code?: ErrorCode
}
