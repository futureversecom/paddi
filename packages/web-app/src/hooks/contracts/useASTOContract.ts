import type { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { MockASTO__factory } from 'smart-contracts/typechain-types/factories/src/MockASTO__factory'
import { abis } from 'src/utils/abis'

import { useSignerOrProvider } from './useSignerOrProvider'

export const useASTOContract = () => {
  const signerOrProvider = useSignerOrProvider()

  const contract = useMemo(() => {
    return MockASTO__factory.connect(abis.MockASTO.address, signerOrProvider)
  }, [signerOrProvider])

  return contract
}

export const useASTOBalance = (address: string, enabled = true) => {
  const contract = useASTOContract()

  return useQuery(
    ['ASTO', 'balanceOf', address],
    () => {
      return contract.balanceOf(address)
    },
    { enabled },
  )
}

export const useASTOAllowance = (owner: string, spender: string) => {
  const contract = useASTOContract()

  return useQuery(['ASTO', 'allowance', owner, spender], async () => {
    return contract.allowance(owner, spender)
  })
}

export const useASTOApprove = (spender: string, amount: BigNumber) => {
  const contract = useASTOContract()
  const queryClient = useQueryClient()

  return useMutation(
    ['ASTO', 'approve', spender, amount],
    async () => {
      const tx = await contract.approve(spender, amount)
      return await tx.wait()
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['ASTO', 'allowance'])
      },
    },
  )
}

export const useASTOFaucet = () => {
  const contract = useASTOContract()
  const queryClient = useQueryClient()
  return useMutation(
    ['ASTO', 'faucet'],
    async () => {
      const tx = await contract.faucet()
      return await tx.wait()
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['ASTO', 'balanceOf'])
      },
    },
  )
}
