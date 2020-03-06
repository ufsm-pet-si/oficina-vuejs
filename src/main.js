import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios

// Pega o token do localStorage
const token = localStorage.getItem('token')

// Se esse token existir, define o headers['Authorization'] como um Bearer e o valor do token
if (token)
  Vue.prototype.$http.defaults.headers['Authorization'] = `Bearer ${token}`

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
