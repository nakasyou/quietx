import { parseBlockListComment } from '../../utils/blocklist.ts'

chrome.runtime.onMessage.addListener(async (_message, _sender, sendResponse) => {
  const settings = await chrome.storage.local.get(['mode_type1', 'mode_type2', 'mode_devmode'])

  const type1BlockList = await fetch('https://raw.githubusercontent.com/nakasyou/quietx/main/blocklist/type1.txt').then(res => res.text())
  const type2BlockList = await fetch('https://raw.githubusercontent.com/nakasyou/quietx/main/blocklist/type2.txt').then(res => res.text())
  const res = {
    blockList: {
      type1: parseBlockListComment(type1BlockList),
      type2: parseBlockListComment(type2BlockList)
    },
    settings
  }
  sendResponse(res)
  return res
})