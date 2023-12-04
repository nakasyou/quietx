import { mkext } from './mkext.ts'

await mkext() // First build
console.log('ended')

for await (const _evt of Deno.watchFs('./extension', { recursive: true })) {
  try {
    await mkext()
  } catch (error) {
    console.error(error)
  }
  console.log('ended')
}
