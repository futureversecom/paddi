import { useProvider, useSigner } from 'wagmi'

export const useSignerOrProvider = () => {
  const { data: signer } = useSigner()
  const rpcProvider = useProvider()
  return signer || rpcProvider
}
