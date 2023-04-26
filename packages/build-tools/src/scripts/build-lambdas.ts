#!/usr/bin/env ts-node
import * as S from '@fp-ts/schema'
import fs from 'fs'
import path from 'path'

import { buildLambdas } from '../build-lambdas'

const args = process.argv.slice(2)

const BuildConfigS = S.struct({
  handlers: S.array(S.struct({ entrypoint: S.string })),
})

const buildPackagePath = (file: string) => path.join(process.cwd(), file)

console.log('cwd', buildPackagePath('lambda-build.json'))
// read build config from package.json of executing package
const lambdaBuildConfig = fs.readFileSync(buildPackagePath('lambda-build.json'))

const decodedConfig = S.decodeOrThrow(BuildConfigS)(
  JSON.parse(lambdaBuildConfig.toString('utf-8')),
)

buildLambdas({
  bundle: args.includes('--bundle'),
  entryPoints: [
    ...decodedConfig.handlers.map(h => buildPackagePath(h.entrypoint)),
  ],
  outputDir: buildPackagePath('dist'),
}).catch(err => {
  console.log('Error during build', err)
  throw err
})
