new Vue({
    el:'#app',

    mounted(){
        this.loadParams();
        this.loadCountry();
    },

    data: {
        API_URL:location.origin.concat('/api/covid'),
        loading:false,
        country_data:'',
        params:{
            country:''
        }
    },

    methods: {
        loadParams(){
            const query = location.search;

            this.params.country = query.match(/id=(.*)$/)[1];
        },

        async loadCountry(){
            this.loading = true;
            const resp = await fetch(`${this.API_URL}/${this.params.country}`);
            const data = await resp.json();

            if(data.message){
                alert(data.message);
                this.loading = false;
                return;
            }

            this.country_data = data;
            this.loading = false;
        }
    }
});