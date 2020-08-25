import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Player from '../views/Player.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      layout: 'clean'
    },
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    meta: {
      layout: 'default'
    },
    component: Home
  },
  {
    path: '/play/:id',
    name: 'Player',
    meta: {
      layout: 'player'
    },
    component: Player
  }
]

const router = new VueRouter({
  routes
})

export default router
