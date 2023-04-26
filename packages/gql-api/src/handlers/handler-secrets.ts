import * as codec from 'io-ts/Codec'

export const SecretsC = codec.struct({
  SignerPrivateKey: codec.string,
  MemoryTreeSignerPrivateKey: codec.string,
  JwtSecret: codec.string,
})
