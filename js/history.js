async function main(){
    let histories = (await getStorage()).dict
    function calcHistories(){
        return Object.entries(histories)
        .map(history => {return {url: history[0], ...history[1]};})
        .sort((a, b) => b.lastDateTime - a.lastDateTime)
        .filter(history => !history.isHost)
        .map((history, index) => {return {index, ...history};})
    }
    const colors = [
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "deep-orange",
        "brown",
        "blue-grey",
        "grey",
    ].map(color => color + " lighten-5")
    new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data(){
            return {
                isIncludeHost: false,
                isOnlyStar: false,
                histories: calcHistories(),
            }
        },
        methods: {
            myColor(history){
                return colors[history.hostCode % colors.length]
            },
            star: async function(index){
                const targetHistory = this.histories[index]
                this.histories[index].star = !this.histories[index].star
                histories = (await getStorage()).dict
                histories[targetHistory.url].star = !histories[targetHistory.url].star
                await setStorage({dict: histories})
            },
            deleteHistory: async function(index){
                const targetHistory = this.histories[index]
                this.histories.splice(index, 1)
                histories = (await getStorage()).dict
                delete histories[targetHistory.url]
                await setStorage({dict: histories})
            },
        },
    })
}

main()
