import type * as Codec from 'io-ts/Codec'
/**
 *
 * @param codec
 * @returns
 */
export function coerceCodec<T, Y extends T>(
  codec: Codec.Codec<unknown, T, T>,
): Codec.Codec<unknown, T, Y> {
  return codec as unknown as Codec.Codec<unknown, T, Y>
}
