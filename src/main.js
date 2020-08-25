import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import PortalVue from 'portal-vue'

import './assets/scss/tailwind.scss'
import Axios from 'axios';

import DefaultLayout from "@/layouts/Default";
import PlayerLayout from "@/layouts/Player";
import CleanLayout from "@/layouts/Clean";

import Icon from '@/components/ui/Icon'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'

Vue.use(PortalVue)

Vue.component('DefaultLayout', DefaultLayout)
Vue.component('PlayerLayout', PlayerLayout)
Vue.component('CleanLayout', CleanLayout)
Vue.component('Icon', Icon)
Vue.component('Badge', Badge)
Vue.component('Loader', Loader)

Vue.config.productionTip = false

const axios = Axios.create({
  baseURL: 'https://jkaraoke.test/api'
});
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
