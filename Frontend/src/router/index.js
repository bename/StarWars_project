import Vue from 'vue'
import Router from 'vue-router'
import main_page from '@/components/main_page'
import suggested_movies from '@/components/suggested_movies'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main_page',
      component: main_page
    },
    {
      path: '/suggested_movies/token/:token',
      name: 'suggested_movies',
      component: suggested_movies
    }
  ]
})
