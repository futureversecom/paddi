import * as Codec from 'io-ts/Codec'

import { UrlFromStringC } from './url'

export const MetadataAttributeC = Codec.struct({
  trait_type: Codec.string,
  value: Codec.string,
})

export const BrainMetadataC = Codec.struct({
  name: Codec.string,
  image: UrlFromStringC,
  image_transparent: UrlFromStringC,
  animation_url: UrlFromStringC,
  attributes: Codec.array(MetadataAttributeC),
  genome_matrix: Codec.array(Codec.number),
  angle_matrix: Codec.array(Codec.number),
})

export type BrainMetadata = Codec.TypeOf<typeof BrainMetadataC>
