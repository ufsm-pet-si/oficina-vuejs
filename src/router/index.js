import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import store from '@/store'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
  meta: { 
    requiresAuth: true
  }
},{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/Login')
}]

const router = new VueRouter({
  routes
})

// Faz a verificação do token de autenticação
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router
