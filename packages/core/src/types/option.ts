import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as C from 'io-ts/Codec'

export const optionC = <I, O, A>(
  codecT: C.Codec<I, O, A>,
): C.Codec<I, O | null, O.Option<A>> =>
  pipe(codecT, C.nullable, C.imap(O.fromNullable, O.toNullable)) as C.Codec<
    I,
    O | null,
    O.Option<A>
  >
