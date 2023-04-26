import { pipe } from '@fp-ts/core/Function'
import { brand } from '@fp-ts/data'
import * as S from '@fp-ts/schema'
import { parseDate } from '@fp-ts/schema/data/parser'
import * as ethers from 'ethers'

export enum ChainId {
  Ethereum = 1,
  Goerli = 5,
  Porcini = 7672,
  Root = 7668,
}

export const ChainIdS = S.enums(ChainId)

export type ChainAddress = string & brand.Brand<'ChainAddress'>

export const RefinedChainAddress = brand.refined<ChainAddress>(
  str => ethers.utils.isAddress(str) && str.toLowerCase() === str,
  str => brand.error(`Not a valid chain address: ${str}.`),
)

export const chainAddressFromString = (addressStr: string): ChainAddress =>
  RefinedChainAddress.of(addressStr.trim().toLowerCase())

export const ChainAddressS = pipe(
  S.string,
  S.filter(RefinedChainAddress.refine),
)

export const ChainEventCommonS = S.struct({
  blockNumber: S.number,
  logIndex: S.number,
  blockHash: S.string,
  topics: S.array(S.string),
  chainId: ChainIdS,
  removed: S.boolean,
  blockTime: parseDate(S.string),
})

export const EvmChainEventsC = S.extend(ChainEventCommonS)(
  S.struct({
    /** optional as this was the default in the initial version */
    chainType: S.optional(S.literal('evm')),
    address: ChainAddressS,
    data: S.string,
    transactionIndex: S.number,
    transactionHash: S.string,
  }),
)

export type EvmChainEvent = S.Infer<typeof EvmChainEventsC>
