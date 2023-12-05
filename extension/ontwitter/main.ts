;(async () => {
  const data: {
    blockList: {
      type1: string[]
      type2: string[]
    }
    settings: {
      mode_type1: boolean
      mode_type2: boolean
      mode_devmode: boolean
    }
  } = await chrome.runtime.sendMessage(0)
  const devModeTextArea = document.createElement('textarea')
  if (data.settings.mode_devmode) {
    devModeTextArea.style.position = 'fixed'
    devModeTextArea.style.top = '0px'
    devModeTextArea.style.left = '0px'
    document.body.append(devModeTextArea)
  }
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
      reply.onanimationend = () => {
        reply.dataset.endanim = "true"
      }
      if (data.settings.mode_devmode) {
        reply.onclick = (evt) => {
          evt.preventDefault()
          reply.style.backgroundColor = '#aaa'
          devModeTextArea.value += username + '\n'
        }
      }
    }

    const settings = await chrome.storage.local.get(['mode_type1', 'mode_type2']) as {
      mode_type1: boolean
      mode_type2: boolean
    }
    const newSettings = JSON.stringify(settings)
    
    const badCss = `{
      /*transition: all 300ms 0s ease;
      transform: scale(0) !important;*/
      animation: kieru 0.3s forwards;
    }`
    if (lastSettings !== newSettings) {
      for (const reply of replys) {
        delete reply.dataset.endanim
      }
      style.textContent = `
      article[data-testid="tweet"][tabindex="0"] {
        transform: scale(1);
      }
      @keyframes kieru {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(0);
        }
      }
      ` + (settings.mode_type1 ? `
        article[data-type1]${badCss}
        article[data-endanim][data-type1]{
          display: none;
        }
      ` : '') + (settings.mode_type2 ? `
        article[data-type2]${badCss}
        article[data-endanim][data-type2]{
          display: none;
        }
      ` : '')
      lastSettings = newSettings
    }
    console.log('steped')
    setTimeout(step, 100)
  }
  step()
})()


