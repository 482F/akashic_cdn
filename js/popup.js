async function main(){
    let histories = (await getStorage()).dict
    const url = await getActiveURL()
    console.log(url)
    new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data(){
            return {
                isStar: histories[url]?.star ?? false
            }
        },
        methods: {
            star: async function(){
                this.isStar = !this.isStar
                histories = (await getStorage()).dict
                histories[url].star = this.isStar
                await setStorage({dict: histories})
            },
        },
    })
}

main()

