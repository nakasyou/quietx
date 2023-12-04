;(async () => {
  const data: {
    blockList: {
      type1: string[]
      type2: string[]
    }
    settings: {
      mode_type1: boolean
      mode_type2: boolean
    }
  } = await chrome.runtime.sendMessage(0)
  let lastSettings = ''
  const style = document.createElement('style')
  document.head.append(style)
  const step = async () => {
    const replys = Array.from(document.querySelectorAll(`article[data-testid="tweet"][tabindex="0"]`)) as HTMLDivElement[]
    for (const reply of replys) {
      if (!reply.textContent) {
        continue
      }
      const usernameMatches = reply.textContent.match(/@.+?·/)
      if (!usernameMatches) {
        continue
      }
      const username = usernameMatches[0].replace('·', '').replace('@', '')
      
      if (data.blockList.type1.includes(username)) {
        reply.dataset.type1 = "true"
      }
      if (data.blockList.type2.includes(username)) {
        reply.dataset.type2 = "true"
      }
    }

    const settings = await chrome.storage.local.get(['mode_type1', 'mode_type2']) as {
      mode_type1: boolean
      mode_type2: boolean
    }
    const newSettings = JSON.stringify(settings)
    
    if (lastSettings !== newSettings) {
      style.textContent = (settings.mode_type1 ? `article[data-type1] {
        display: none;
      }` : '') + (settings.mode_type2 ? `settings article[data-type2] {
        display: none;
      }` : '')
      console.log(style.textContent)
      lastSettings = newSettings
    }
    setTimeout(step, 100)
  }
  step()
})()


