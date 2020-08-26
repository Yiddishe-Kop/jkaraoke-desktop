import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Player from '../views/Player.vue'

import store from '../store'

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

// Auth guard
router.beforeEach((to, from, next) => {
  // if not logged in
  if (to.name !== 'Login' && !store.state.auth.user) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
