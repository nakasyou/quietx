const removeBlockListComment = (text: string) => {
  return text.replace(/ *#.*$/m, '')
}
const parseBlockListComment = (text: string) => {
  return removeBlockListComment(text).split('\n')
}
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const settings = await chrome.storage.local.get(['mode_type1', 'mode_type2'])

  const type1BlockList = await fetch('https://raw.githubusercontent.com/nakasyou/quietx/main/blocklist/type1.txt').then(res => res.text())
  const type2BlockList = await fetch('https://raw.githubusercontent.com/nakasyou/quietx/main/blocklist/type2.txt').then(res => res.text())

  return {
    blockList: {
      type1: parseBlockListComment(type1BlockList),
      type2: parseBlockListComment(type2BlockList)
    },
    settings
  }
})