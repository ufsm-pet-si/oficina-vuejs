import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

import { API_URL } from '@/assets/variables'

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {},
    posts: JSON.parse(localStorage.getItem('posts')) || [],
    users: JSON.parse(localStorage.getItem('posts')) || []
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    loggedUser: state => state.user,
    listOfPosts: state => state.posts,
    listOfUsers: state => state.users
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
    },
    set_posts(state, posts) {
      state.posts = posts
    },
    set_users(state, users) {
      state.users = users
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
    },
    async fetchPosts({ commit }, ownerId = null) {
      const response = await axios.get(`${API_URL}/posts${ownerId ? `?ownerId=${ownerId}` : ''}`)
      const posts = response.data

      localStorage.setItem('posts', JSON.stringify(posts))

      posts.map(async post => {
        if (post.image.path) {
          const responseImg = await axios.get(`${API_URL}/images/${post.image.path}`)
          post.image = responseImg.config.url
        }
      })
      
      commit('set_posts', posts)
    },
    async fetchUsers({ commit }) {
      const response = await axios.get(`${API_URL}/users`)
      const users = response.data

      localStorage.setItem('users', JSON.stringify(users))

      commit('set_users', users)
    }
  },
  modules: {
  }
})
