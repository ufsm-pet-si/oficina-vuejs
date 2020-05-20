<template>
  <div class="container">
    <div class="content">
      <p>{{ editing ? 'My Info' : 'Register' }}</p>
  
      <form v-if="!editing" @submit.prevent="handleSubmit">
        <label for="username">Username</label>
        <input 
          v-model="user.username"
          type="text"
          name="username"
          >

        <label for="email">E-mail</label>
        <input 
          v-model="user.email"
          type="email"
          name="email"
          >
        
        <label for="password">Password</label>
        <input
          v-model="user.password"
          type="password"
          name="password"
          >
  
        <button type="submit">{{ editing ? 'Edit' : 'Sign Up' }}</button>
      </form>
      
      <div v-else>
        <h3>Username: {{ user.username }}</h3>
        <h3>E-mail: {{ user.username }}</h3>
      </div>
      
      <router-link v-if="!editing" to="/login">Sign In</router-link>
      <router-link v-else to="/users/create">Sign In</router-link>
    </div>
  </div>
</template>

<script>
  import { API_URL } from '@/assets/variables'

  export default {
    data() {
      return {
        user: {},
        editing: false
      }
    },
    computed: {
      loggedUser() {
        return this.$store.getters.loggedUser
      },
      users() {
        return this.$store.getters.listOfUsers
      }
    },
    methods: {
      handleSubmit() {
        if (this.editing)
          this.updateUser()
        else
          this.saveUser()
      },
      async saveUser() {
        let user = this.user
        try {
          const response = await this.$http.post(`${API_URL}/users`, {
            ...user
          })

          if (response.status === 201)
            this.$toasted.success('Successfully created user!')

          this.$router.push('/login')
        } catch(e) {
          this.$toasted.error(e.message)
        }
      },
      async updateUser() {
        let user = this.user
        try {
          const response = await this.$http.put(`${API_URL}/users/${user.id}`,{
            ...user
          })

          if (response.status === 200)
            this.$toasted.success('Successfully updated user!')

          this.$router.push('/')
        } catch(e) {
          this.$toasted.error(e.message)
        }
      }
    },
    mounted() {
      if (+this.$route.params.userId === this.loggedUser.id) {
        this.user = this.loggedUser
        this.editing = true
      } else {
        this.user = this.users.find(user => user.id === +this.$route.params.userId)
        if (!this.user)
          this.user = {
            username: '',
            password: '',
            email: ''
          }
      }
    }
  }
</script>