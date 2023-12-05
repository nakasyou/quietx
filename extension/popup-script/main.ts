/// <reference types="npm:@types/chrome" />
const $checkType1 = document.getElementById('check-type1') as HTMLInputElement
const $checkType2 = document.getElementById('check-type2') as HTMLInputElement
const $devMode = document.getElementById('devmode') as HTMLInputElement

const regesterCheckEvent = (elem: HTMLInputElement, mode: string) => {
  elem.oninput = () => {
    const storageNew: Record<string, boolean> = {}
    storageNew[`mode_${mode}`] = elem.checked
    chrome.storage.local.set(storageNew)
  }
  chrome.storage.local.get([`mode_${mode}`]).then(data => {
    if (data[`mode_${mode}`]) {
      elem.checked = true
    }
  })
}

regesterCheckEvent($checkType1, 'type1')
regesterCheckEvent($checkType2, 'type2')
regesterCheckEvent($devMode, 'devmode')
