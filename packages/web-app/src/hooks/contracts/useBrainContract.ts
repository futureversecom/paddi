import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { MockBrain__factory } from 'smart-contracts/typechain-types/factories/src/MockBrain__factory'
import { abis } from 'src/utils/abis'

import { useSignerOrProvider } from './useSignerOrProvider'

export const useBrainContract = () => {
  const rpcProvider = useSignerOrProvider()

  const contract = useMemo(() => {
    return MockBrain__factory.connect(abis.MockBrain.address, rpcProvider)
  }, [rpcProvider])

  return contract
}

export const useBrainTokens = (address: string) => {
  const brainContract = useBrainContract()

  return useQuery(['brain', 'tokensOfOwner', address], async () => {
    return brainContract.tokensOfOwner(address)
  })
}

export const useBrainBalance = (address: string) => {
  const contract = useBrainContract()

  return useQuery(['brain', 'balanceOf', address], () => {
    return contract.balanceOf(address)
  })
}

export const useBrainFaucet = () => {
  const contract = useBrainContract()
  const queryClient = useQueryClient()
  return useMutation(
    ['brain', 'faucet'],
    async () => {
      const tx = await contract.faucet()
      return await tx.wait()
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['brain'])
      },
    },
  )
}
