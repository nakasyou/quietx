export const format = (list: string) => {
  const splited = list.replaceAll('\r', '').split('\n')
  const datas = [...new Set(splited)].toSorted().filter(data => data !== '')
  return [
    datas.join('\n'),
    datas.length
  ] as const
}
export const formatBlockList = async () => {
  const [type1, type1Length] = format(await Deno.readTextFile('./blocklist/type1.txt'))
  const [type2, type2Length] = format(await Deno.readTextFile('./blocklist/type2.txt'))

  await Deno.writeTextFile('./blocklist/type1.txt', type1)
  await Deno.writeTextFile('./blocklist/type2.txt', type2)

  console.log(`Type1: ${type1Length}`)
  console.log(`Type2: ${type2Length}`)
}

if (import.meta.main) {
  await formatBlockList()
}
