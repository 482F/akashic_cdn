const historyObjectFactory = function(){
    return {
        host: "",
        path: "",
        title: "",
        number: 0,
        hostCode: 0,
        lastDateTime: new Date(),
        lastDateText: "",
        star: false,
        isHost: false,
    }
}

chrome.commands.onCommand.addListener(function(command) {
    if (command === "openConfig"){
        chrome.tabs.create({"url": "chrome-extension://" + chrome.runtime.id + "/html/history.html"})
    }else if (command === "reload"){
        chrome.runtime.reload()
    }
})

async function init(){
    const dict = (await getStorage()).dict
    if (!dict){
        await setStorage({dict: {}})
    }
}

function fillDigits(str, number){
    return (Array(number).fill("0").join("") + str.toString()).slice(-Math.max(str.toString().length, number))
}

function formatDate(date){
    const y = fillDigits(date.getFullYear(), 4)
    const mo = fillDigits(date.getMonth(), 2)
    const d = fillDigits(date.getDate(), 2)
    const h = fillDigits(date.getHours(), 2)
    const mi = fillDigits(date.getMinutes(), 2)
    const s = fillDigits(date.getSeconds(), 2)
    return y + "/" + mo + "/" + d + " " + h + ":" + mi + ":" + s
}

function addHistory(histories, history){
    const url = history.url
    const title = history.title
    const splittedURL = splitURL(url)
    const host = splittedURL.host
    const path = splittedURL.path
    if (!histories[url]){
        histories[url] = historyObjectFactory()
    }
    histories[url].host = host
    histories[url].path = path
    histories[url].title = title
    histories[url].hostCode = Array.prototype.reduce.call(host, (all, part) => all + part.charCodeAt(), 0)
    histories[url].number++
    const date = new Date()
    histories[url].lastDateTime = date.getTime()
    histories[url].lastDateText = history.lastDateText ?? formatDate(date)
    histories[url].isHost = false
    if (!histories["host-" + host]){
        histories["host-" + host] = historyObjectFactory()
    }
    const hostObject = histories["host-" + host]
    hostObject.host = host
    hostObject.path = ""
    hostObject.title = "host"
    hostObject.hostCode = histories[url].hostCode
    hostObject.number++
    hostObject.lastDateTime = histories[url].lastDateTime
    hostObject.lastDateText = histories[url].lastDateText
    hostObject.isHost = true
}

async function regenerate(){
    let histories = (await getStorage()).dict ?? {}
    await setStorage({dict: {}})
    for (url in histories){
        addHistory(histories, {url: url, ...histories[url]})
    }
    await setStorage({dict: histories})
}

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse){
        if (request.history){
            let histories = (await getStorage()).dict
            addHistory(histories, request.history)
            await setStorage({dict: histories})
        }
    }
)

init()
//regenerate()
