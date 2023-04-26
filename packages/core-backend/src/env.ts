import * as E from 'fp-ts/Either'
import * as D from 'io-ts/Decoder'

export type Env = 'dev' | 'staging' | 'prod' | 'kovan'

export const getEnv = <A>(decoder: {
  [K in keyof A]: D.Decoder<unknown, A[K]>
}): E.Either<D.DecodeError, A> => {
  const structD = D.struct(decoder)
  const nullifiedEnv = Object.fromEntries(
    Object.keys(decoder).map(key => [key, process.env[key] ?? null]),
  )

  return structD.decode(nullifiedEnv)
}

export const getEnvOrThrow = <A>(decoder: {
  [K in keyof A]: D.Decoder<unknown, A[K]>
}): A => {
  const env = getEnv(decoder)
  if (E.isLeft(env)) {
    throw new Error(`Error decoding environment vars: ${D.draw(env.left)}`)
  }

  console.info(`INFO: Loaded configuration: ${JSON.stringify(env.right)}`)

  return env.right
}
