async function sleep(msec){
    return new Promise(resolve => {
        setTimeout(resolve, msec)
    })
}

async function setStorage(items){
    chrome.storage.local.set(items, () => null)
}

async function getStorage(){
    let returnItems = null
    await chrome.storage.local.get({
        dict: null,
    }, items => {
        returnItems = items
    })
    while (returnItems === null){
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    return returnItems
}

async function waitReady(){
    while (document.readyState !== "complete"){
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    let index = 0
    const invalidTitles = [
        "",
        "Twitter",
    ]
    while (invalidTitles.indexOf(document.title) !== -1 && ++index < 50){
        await new Promise(resolve => setTimeout(resolve, 100))
    }
}

async function getActiveURL(){
    let url = null;
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let tab = tabs[0];
        url = tab.url;
    });
    while (url === null){
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    return decodeURI(url)
}

function splitURL(url){
    const index = url.indexOf("/", 8)
    if (index === -1){
        return {host: url, path: ""}
    } else {
        return {host: url.slice(0, index), path: url.slice(index)}
    }
}

function sendMessageToBackground(key, value){
    chrome.runtime.sendMessage({
        [key]: value,
    })
}

