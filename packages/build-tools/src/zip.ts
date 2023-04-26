import type { Plugin } from 'esbuild'
import fs from 'fs'
import fsP from 'fs/promises'
import path from 'path'
import { ZipFile } from 'yazl'

export const zipPlugin: Plugin = {
  name: 'ZipPlugin',
  setup(build) {
    build.onEnd(async result => {
      for (const file of result.outputFiles ?? []) {
        if (file.path.endsWith('.map')) {
          continue
        }

        await fsP.mkdir(path.dirname(file.path), { recursive: true })

        await new Promise<void>(resolve => {
          const zipfile = new ZipFile()

          zipfile.addBuffer(Buffer.from(file.contents), 'index.js', {
            mtime: new Date(0),
          })

          zipfile.outputStream
            .pipe(fs.createWriteStream(`${file.path}.zip`))
            .on('close', () => {
              console.log('Created bundle', `${file.path}.zip`)
              return resolve()
            })

          zipfile.end()
        })
      }
    })
  },
}
