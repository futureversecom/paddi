import { getAbis } from 'smart-contracts/abi'

export const abis = getAbis(process.env['ENVIRONMENT'] as string)
