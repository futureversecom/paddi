import type { BigNumberish, BytesLike } from 'ethers'
import { useMemo } from 'react'
import { useMutation } from 'react-query'
import { abis } from 'smart-contracts/abi'
import { ComputeRequestManager__factory } from 'smart-contracts/lib/protocol-core/gen/factories/ComputeRequestManager__factory'

import { useSignerOrProvider } from './useSignerOrProvider'

export const useComputeRequestManagerContract = () => {
  const signerOrProvider = useSignerOrProvider()

  const contract = useMemo(() => {
    return ComputeRequestManager__factory.connect(
      abis.ComputeRequestManager.address,
      signerOrProvider,
    )
  }, [signerOrProvider])

  return contract
}

type MutationParams = {
  units: BigNumberish
  computeHash: BytesLike
}

export const useRequestCompute = () => {
  const contract = useComputeRequestManagerContract()
  return useMutation(
    ['computeRequestManager', 'requestCompute'],
    async ({ units, computeHash }: MutationParams) => {
      const tx = await contract.requestCompute(
        abis.PongComputeManager.address,
        0,
        units,
        computeHash,
      )
      return await tx.wait()
    },
  )
}
