import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

import { API_URL } from '@/assets/variables'

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {}
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    loggedUser: state => state.user
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, { auth, user }) {
      state.status = 'success',
      state.token = auth.token
      state.user = user
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = '',
      state.token = '',
      state.user = {}
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        commit('auth_request')
        const response = await axios.post(`${API_URL}/sessions`, {
          ...credentials
        })
        
        const { auth, user } = response.data

        localStorage.setItem('token', auth.token)
        localStorage.setItem('user', JSON.stringify(user))
        axios.defaults.headers.common['Authentication'] = `Bearer ${auth.token}`

        commit('auth_success', { auth, user })
      } catch(e) {
        commit('auth_error')
        localStorage.removeItem('token')
        throw(e)
      }
    },
    logout({ commit }) {
      commit('logout')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('users')
      localStorage.removeItem('posts')
      delete axios.defaults.headers.common['token']
    }
  },
  modules: {
  }
})
