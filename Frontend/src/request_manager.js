import axios from 'axios';

let endPointFlaskAPI = 'http://139.162.208.159:8080';
let endPointSWAPI = 'https://swapi.dev/api';
let url = '';
let headers = {'Content-Type': "application/json","Access-Control-Allow-Origin": "*"};

function make_server_request(server_call, params) {
    switch (server_call) {
      case "get_token_favorites":
        url = `${endPointFlaskAPI}/get_token_favorites?token=`+params.token;
        return get_function(url);
        break;
      case "get_characters":
        url = `${endPointFlaskAPI}/characters`;
        return get_function(url);
        break;
      case "get_movies":
        url = `${endPointFlaskAPI}/films`;
        return get_function(url);
        break;
        case "get_token":
          url = `${endPointFlaskAPI}/get_token`;
          return get_function(url);
          break;
      case "save_suggestions_token":
        url = `${endPointFlaskAPI}/save_suggestions_token`;
        let post_data = {token: params.token, favorites: params.favorites}
        return post_function(url, headers, post_data);
        break;
     
    }
}

function get_function(url) {
  console.log(url)

let request =  axios({
      method: 'get',
      headers: headers,
      url: url,
    })

  return request;
}

function post_function(url, headers, data) {
  console.log(url)

let request =  axios({
      method: 'post',
      headers: headers,
      url: url,
      data: data,
    })

  return request;
}

export { make_server_request }