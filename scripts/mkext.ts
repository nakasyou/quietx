import * as fs from 'std/fs/mod.ts'
import { z } from 'npm:zod'
import * as esbuild from 'esbuild'
import * as path from 'std/path/mod.ts'
import postcss from 'npm:postcss'
import tailwindcss from 'npm:tailwindcss'

// @ts-expect-error Tailwind
const makecss = async () => (await postcss([tailwindcss]).process('@tailwind base; @tailwind components; @tailwind utilities;')).css

const Manifestv3 = z.object({
  name: z.string(),
  content_scripts: z.array(z.object({
    js: z.array(z.string()),
    matches: z.array(z.string())
  }))
})
export const mkext = async () => {
  await fs.emptyDir('./dist')

  const manifest: z.infer<typeof Manifestv3> = JSON.parse(await Deno.readTextFile('./extension/manifest.json'))
  Manifestv3.parse(manifest)
  
  await Promise.all([...manifest.content_scripts, {
    js: [
      './popup-script/main.ts',
      './service_worker/main.ts'
    ]
  }].map(contentScript => (async () => {
    await Promise.all(contentScript.js.map(js => (async () => {
      await esbuild.build({
        entryPoints: [path.join('extension', js)],
        outfile: path.join('dist', js.replace(/\.ts$/, '.js'))
      })
    })()))
    // .tsを.jsに
    let jsPathIndex = 0
    for (const  jsPath of contentScript.js) {
      contentScript.js[jsPathIndex] = jsPath.replace(/\.ts$/, '.js')
      jsPathIndex ++
    }
  })()))
  await esbuild.stop()

  for await (const entry of fs.walk('./extension/public')) {
    const nomalizedPath = entry.path.replaceAll('\\', '/').replace('extension/public', '')
    if (nomalizedPath === '') {
      continue
    }
    if (entry.isDirectory) {
      await Deno.mkdir(path.join('dist', nomalizedPath))
    }
    if (entry.isFile) {
      await Deno.copyFile(entry.path, path.join('dist', nomalizedPath))
    }
  }
  await Deno.writeTextFile('dist/manifest.json', JSON.stringify(manifest, null, 2))

  await Deno.writeTextFile('dist/tailwind.css', await makecss())
}
