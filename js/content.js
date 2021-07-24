async function main(){
    await waitReady()
    sendMessageToBackground("history", {url: decodeURI(location.href), title: document.title})
}
main()
