<template>
  <div >
      <v-progress-circular v-if="!data_loaded" class="spinner" indeterminate :size="70" color="blue lighten-2"></v-progress-circular>
    <table id='suggestions_table'>
      <thead>
        <v-btn @click="copy_to_cilpboard()" small>
          <v-icon>share</v-icon>
        </v-btn>
        <span v-if="token_missing">Record doesn't exsist. Displying movies ascending.</span>
        <tr>
          <th v-for="(header, key) in headers" :key="key">{{header}}</th>
        </tr>
      </thead>
      <tr v-for="(row, key) in movies" :key="key">
        <td>{{row.title}} ({{getYearFromEpoch(row.release_date)}}) - favorites({{row.characters_counter}})</td>        
      </tr>
    </table>

  </div>
</template>

<script>

import copy from 'copy-to-clipboard';
import {make_server_request} from '../request_manager'

  export default {
    name:'suggested_movies',
    props: [ 'films' ],
    data: () => ({
      table_data: [],
      favorites: {},
      token_missing: false,
      data_loaded: false,
      headers: ['Suggested by order'],
      movies: [],
    }),

  mounted(){
    this.get_favorites_by_token();
  },

  methods:{

    fetch_movies: async function(){

      let response = await make_server_request('get_movies');
      let films_data = response.data.Films;
      this.films_ready = true;

      for(let film of films_data){
        this.movies.push(film)
      }

      this.sort_table()
      this.data_loaded = true;

    },

    get_favorites_by_token: async function(){
      let response = await make_server_request('get_token_favorites', {token: this.$route.params.token});
      if(response.data.IsSuccess){
        this.favorites = (JSON.parse(response.data.favorites[0]));
      }
      else{
        this.token_missing = true;
      }
      this.fetch_movies();

    },

    copy_to_cilpboard: function(){
      copy(window.location.href);
    },

    sort_table: function(){
      this.add_favorites_numbers_to_films();
      this.movies.sort((a,b)=>{ 
      if(b.characters_counter == a.characters_counter){
          return new Date(a.release_date) - new Date(b.release_date);
      }
      else{
          return b.characters_counter - a.characters_counter 
      }
      });
      this.$forceUpdate();
    },

    add_favorites_numbers_to_films: function(){
        for(let film of this.movies){
          film.characters_counter = this.count_favorite_characters(film.characters);
        }
    },

    count_favorite_characters: function(movie_characters){
        let count = 0;
        for(let character of movie_characters){
            if(this.favorites[character]){
                count++;
            }
        }
        return count;
    },

    getYearFromEpoch: function(epoch){
        var date = new Date(epoch);
        return date.getFullYear();
      }
  }

  };

</script>

<style>
#suggestions_table {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 70%;
  margin: 70px auto;
  text-align: left;;
}

#suggestions_table td, #suggestions_table th {
  border: 1px solid #ddd;
  padding: 8px;
}

#suggestions_table tr:nth-child(even){background-color: #f2f2f2;}

#suggestions_table tr:hover {background-color: #ddd;}

#suggestions_table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}

.spinner{
  position: absolute;
  left: 47%;
  top: 45%;
}


</style>