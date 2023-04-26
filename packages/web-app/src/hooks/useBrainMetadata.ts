import { useQuery } from 'react-query'

import { useBrainContract } from './contracts/useBrainContract'

type MetaData = {
  name: string
  image: string
  image_transparent: string
  animation_url: string
  genome_matrix: number[]
}

export const useBrainMetadata = (id: number) => {
  const brainContract = useBrainContract()

  return useQuery(['brain', 'tokenURI', id], async () => {
    const uri = await brainContract.tokenURI(id)
    // TODO: error handle..
    return fetch(uri).then(res => res.json() as Promise<MetaData>)
  })
}
