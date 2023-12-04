const $checkType1 = document.getElementById("check-type1");
const $checkType2 = document.getElementById("check-type2");
const regesterCheckEvent = (elem, mode) => [
  elem.oninput = () => {
    const storageNew = {};
    storageNew[`mode-${mode}`] = elem.checked;
    chrome.storage.local.set(storageNew);
  }
];
regesterCheckEvent($checkType1, "type1");
regesterCheckEvent($checkType2, "type2");
