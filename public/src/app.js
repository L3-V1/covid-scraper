new Vue({
    el:'#app',

    mounted(){
        this.loadWorldData();
    },
    
    data: {
        API_URL:location.href.concat('api/covid'),
        loading:false,
        country:'',
        world_data:[],
        world_data_:[]
    },

    methods: {
        async loadWorldData(){
            this.loading = true;
            const resp = await fetch(this.API_URL);
            const data = await resp.json();

            if(data.message){
                alert(data.message);
                this.loading = false;
                return;
            }

            this.world_data = data;
            this.world_data_ = [...this.world_data];
            this.loading = false;
        },

        loadCountry(country_id){
            const new_url = location.href.concat(`country.html?id=${country_id}`);

            window.location.href = new_url;
        },

        filterCountries(){
            this.world_data_ = this.country ? this.world_data.filter((el) => el.country.includes(this.country)) : this.world_data;
        }
    }
});