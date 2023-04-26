import { build } from 'esbuild'

import { zipPlugin } from './zip'

const workspaceRootCwd = process.cwd()

type BuildLambdasOptions = {
  entryPoints: string[]
  bundle: boolean
  outputDir: string
}

export const buildLambdas = (opts: BuildLambdasOptions) =>
  build({
    entryPoints: opts.entryPoints,
    bundle: true,
    platform: 'node',
    target: ['node16'],
    absWorkingDir: workspaceRootCwd,
    outdir: opts.outputDir,
    sourcemap: 'inline',
    ...(opts.bundle
      ? {
          write: false,
          plugins: [zipPlugin],
        }
      : {}),
  })
