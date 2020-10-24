<template>
  <div >
      <div class="search_container">
        <v-text-field @input="filter(filter_input)" @click:clear="filter('')" clearable append-icon="search" label="Search" outline v-model="filter_input"></v-text-field>
        <v-btn :disabled="suggestions_in_progress || !data_loaded" @click="suggest_click">
          <v-progress-circular v-if="suggestions_in_progress" indeterminate :size="12" color="blue lighten-2"></v-progress-circular>
          suggest movies
        </v-btn>
      </div>

      <v-progress-circular v-if="!data_loaded" class="spinner" indeterminate :size="70" color="blue lighten-2"></v-progress-circular>

      <table id='character_table'>
        <thead>
          <tr>
            <th v-for="(header, key) in headers" :key="key">{{header}}</th>
          </tr>
        </thead>
        <tr v-for="(row, key) in filter_characters" @click="update_favorite(row.name)" :key="key">
          <td style="width: 50px; text-align: center;">
            <v-icon v-if="favorite_names[row.name]" color="yellow darken-3">star</v-icon>
            <v-icon v-if="!favorite_names[row.name]" color="gray'">star</v-icon>
          </td>
          <td>{{row.name}}</td>        
        </tr>
      </table>

  </div>
</template>

<script>

  import {make_server_request} from '../request_manager'
  import suggested_movies from './suggested_movies';

  export default {
    components:{suggested_movies},
    data: () => ({
      filter_input: '',
      table_data: [],
      suggestions_in_progress: false,
      films: [],
      data_loaded: false,
      token: '',
      films_ready: false,
      show_suggested: false,
      favorite_names: {},
      headers: ['Favourites','Character']
    }),

  beforeMount(){
    this.handle_token();
    this.fetch_characters();
  },

  computed:{
    filter_characters(){
      let characters = []
      for(let row in this.table_data){
        let character = this.table_data[row];
        if(character.display){
          characters.push(character);
        }
    }
    return characters;
    },
  },

  methods:{

    suggest_click: async function(){
      this.show_suggested = true;
      this.suggestions_in_progress = true;
      let response = await make_server_request('save_suggestions_token', {token: this.token, favorites: this.favorite_names});

      if(response.data.IsSuccess){
        this.$router.push('/suggested_movies/token/'+this.token)
      }

    },

    update_favorite: function(name){
      if(!this.favorite_names[name]){
        this.favorite_names[name] = true;
      }
      else{
        this.favorite_names[name] = false;
      }
      this.$forceUpdate();
    },

    filter: function(filter_input){
      let filter = filter_input.toLowerCase()
      for(let row of this.table_data){
        let name = row.name.toLowerCase();
        if(name.includes(filter)){
          row.display = true;
        }
        else{
          row.display =false;
        }
      }
      this.$forceUpdate();
    },

    fetch_characters: async function(){

      let response = await make_server_request('get_characters');
      let people_data = response.data.People;
      this.data_loaded = true;

      for(let people of people_data){
        this.table_data.push({"name": people.name, "display": true})
      }
    },
    
    handle_token: async function(){

      if(!document.cookie){
        let response = await make_server_request('get_token');
        this.token = response.data.Token;
        document.cookie = "SWToken = "+response.data.Token;
      }
      else{
        this.token = document.cookie.split('SWToken=')[1];
      }

    },

  }
  };

</script>
<style>
.search_container{
  position: relative;
  width: 400px;
  margin: 50px auto;
}

#character_table {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 70%;
  margin: 0 auto;
  text-align: left;;
}

#character_table td, #character_table th {
  border: 1px solid #ddd;
  padding: 8px;
}

#character_table tr:nth-child(even){background-color: #f2f2f2;}

#character_table tr:hover {background-color: #ddd;}

#character_table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}

.spinner{
  position: absolute;
  left: 47%;
  top: 50%;
}


</style>