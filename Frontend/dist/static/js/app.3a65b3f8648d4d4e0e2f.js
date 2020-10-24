webpackJsonp([1],{"5wVK":function(e,t){},"7zck":function(e,t){},NHnr:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("7+uW"),n=s("mtWM"),r=s.n(n);let o="http://139.162.208.159:8080",i="",c={"Content-Type":"application/json","Access-Control-Allow-Origin":"*"};function _(e,t){switch(e){case"get_token_favorites":return l(i=`${o}/get_token_favorites?token=`+t.token);case"get_characters":return l(i=`${o}/characters`);case"get_movies":return l(i=`${o}/films`);case"get_token":return l(i=`${o}/get_token`);case"save_suggestions_token":i=`${o}/save_suggestions_token`;let _={token:t.token,favorites:t.favorites};return s=i,a=c,n=_,console.log(s),r()({method:"post",headers:a,url:s,data:n})}var s,a,n}function l(e){return console.log(e),r()({method:"get",headers:c,url:e})}var u=s("Quol"),d=s.n(u),f={name:"suggested_movies",props:["films"],data:()=>({table_data:[],favorites:{},token_missing:!1,data_loaded:!1,headers:["Suggested by order"],movies:[]}),mounted(){this.get_favorites_by_token()},methods:{fetch_movies:async function(){let e=(await _("get_movies")).data.Films;this.films_ready=!0;for(let t of e)this.movies.push(t);this.sort_table(),this.data_loaded=!0},get_favorites_by_token:async function(){let e=await _("get_token_favorites",{token:this.$route.params.token});e.data.IsSuccess?this.favorites=JSON.parse(e.data.favorites[0]):this.token_missing=!0,this.fetch_movies()},copy_to_cilpboard:function(){d()(window.location.href)},sort_table:function(){this.add_favorites_numbers_to_films(),this.movies.sort((e,t)=>t.characters_counter==e.characters_counter?new Date(e.release_date)-new Date(t.release_date):t.characters_counter-e.characters_counter),this.$forceUpdate()},add_favorites_numbers_to_films:function(){for(let e of this.movies)e.characters_counter=this.count_favorite_characters(e.characters)},count_favorite_characters:function(e){let t=0;for(let s of e)this.favorites[s]&&t++;return t},getYearFromEpoch:function(e){return new Date(e).getFullYear()}}},v=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[e.data_loaded?e._e():s("v-progress-circular",{staticClass:"spinner",attrs:{indeterminate:"",size:70,color:"blue lighten-2"}}),e._v(" "),s("table",{attrs:{id:"suggestions_table"}},[s("thead",[s("v-btn",{attrs:{small:""},on:{click:function(t){return e.copy_to_cilpboard()}}},[s("v-icon",[e._v("share")])],1),e._v(" "),e.token_missing?s("span",[e._v("Record doesn't exsist. Displying movies ascending.")]):e._e(),e._v(" "),s("tr",e._l(e.headers,function(t,a){return s("th",{key:a},[e._v(e._s(t))])}),0)],1),e._v(" "),e._l(e.movies,function(t,a){return s("tr",{key:a},[s("td",[e._v(e._s(t.title)+" ("+e._s(e.getYearFromEpoch(t.release_date))+") - favorites("+e._s(t.characters_counter)+")")])])})],2)],1)};v._withStripped=!0;var h={render:v,staticRenderFns:[]},p=h;var g=!1;var m=s("VU/8")(f,p,!1,function(e){g||s("cqt3")},null,null);m.options.__file="src/components/suggested_movies.vue";var k=m.exports,b={components:{suggested_movies:k},data:()=>({filter_input:"",table_data:[],suggestions_in_progress:!1,films:[],data_loaded:!1,token:"",films_ready:!1,show_suggested:!1,favorite_names:{},headers:["Favourites","Character"]}),beforeMount(){this.handle_token(),this.fetch_characters()},computed:{filter_characters(){let e=[];for(let t in this.table_data){let s=this.table_data[t];s.display&&e.push(s)}return e}},methods:{suggest_click:async function(){this.show_suggested=!0,this.suggestions_in_progress=!0,(await _("save_suggestions_token",{token:this.token,favorites:this.favorite_names})).data.IsSuccess&&this.$router.push("/suggested_movies/token/"+this.token)},update_favorite:function(e){this.favorite_names[e]?this.favorite_names[e]=!1:this.favorite_names[e]=!0,this.$forceUpdate()},filter:function(e){let t=e.toLowerCase();for(let e of this.table_data){e.name.toLowerCase().includes(t)?e.display=!0:e.display=!1}this.$forceUpdate()},fetch_characters:async function(){let e=(await _("get_characters")).data.People;this.data_loaded=!0;for(let t of e)this.table_data.push({name:t.name,display:!0})},handle_token:async function(){if(document.cookie)this.token=document.cookie.split("SWToken=")[1];else{let e=await _("get_token");this.token=e.data.Token,document.cookie="SWToken = "+e.data.Token}}}},w=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"search_container"},[s("v-text-field",{attrs:{clearable:"","append-icon":"search",label:"Search",outline:""},on:{input:function(t){return e.filter(e.filter_input)},"click:clear":function(t){return e.filter("")}},model:{value:e.filter_input,callback:function(t){e.filter_input=t},expression:"filter_input"}}),e._v(" "),s("v-btn",{attrs:{disabled:e.suggestions_in_progress||!e.data_loaded},on:{click:e.suggest_click}},[e.suggestions_in_progress?s("v-progress-circular",{attrs:{indeterminate:"",size:12,color:"blue lighten-2"}}):e._e(),e._v("\n        suggest movies\n      ")],1)],1),e._v(" "),e.data_loaded?e._e():s("v-progress-circular",{staticClass:"spinner",attrs:{indeterminate:"",size:70,color:"blue lighten-2"}}),e._v(" "),s("table",{attrs:{id:"character_table"}},[s("thead",[s("tr",e._l(e.headers,function(t,a){return s("th",{key:a},[e._v(e._s(t))])}),0)]),e._v(" "),e._l(e.filter_characters,function(t,a){return s("tr",{key:a,on:{click:function(s){return e.update_favorite(t.name)}}},[s("td",{staticStyle:{width:"50px","text-align":"center"}},[e.favorite_names[t.name]?s("v-icon",{attrs:{color:"yellow darken-3"}},[e._v("star")]):e._e(),e._v(" "),e.favorite_names[t.name]?e._e():s("v-icon",{attrs:{color:"gray'"}},[e._v("star")])],1),e._v(" "),s("td",[e._v(e._s(t.name))])])})],2)],1)};w._withStripped=!0;var y={render:w,staticRenderFns:[]},$=y;var S=!1;var x=s("VU/8")(b,$,!1,function(e){S||s("xAXB")},null,null);x.options.__file="src/components/main_page.vue";var A=x.exports,C={name:"App",components:{main_page:A}},F=function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)};F._withStripped=!0;var E={render:F,staticRenderFns:[]},T=E;var U=!1;var V=s("VU/8")(C,T,!1,function(e){U||s("5wVK")},null,null);V.options.__file="src/App.vue";var z=V.exports,D=s("/ocq");a.default.use(D.a);var R=new D.a({mode:"history",routes:[{path:"/",name:"main_page",component:A},{path:"/suggested_movies/token/:token",name:"suggested_movies",component:k}]}),W=s("3EgV"),q=s.n(W);s("7zck");a.default.config.productionTip=!1,a.default.use(q.a),new a.default({el:"#app",router:R,components:{App:z},template:"<App/>"})},cqt3:function(e,t){},xAXB:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.3a65b3f8648d4d4e0e2f.js.map