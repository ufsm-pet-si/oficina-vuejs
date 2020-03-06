<template>
<div class="container">
  <div class="content">
    <p>Type your e-mail and password to Sign In!</p>

    <form @submit.prevent="login">
      <label for="email">E-mail</label>
      <input 
        v-model="email" 
        type="email" 
        name="email" 
        placeholder="Digite o seu e-mail"
        >
      
      <label for="password">Senha</label>
      <input 
        v-model="password" 
        type="password" 
        name="password" 
        placeholder="Digite a sua senha"
        >

      <button type="submit">{{ status === 'loading' ? 'Loading...' : 'Sign In' }}</button>
    </form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    status() {
      return this.$store.getters.authStatus
    }
  },
  methods: {
    async login() {
      let email = this.email
      let password = this.password
      try {
        await this.$store.dispatch('login', { email, password })
        this.$router.push('/')
      } catch(e) {
        if (e.response.status === 401)
          this.$toasted.error('E-mail ou senha não cadastrados!')
        else
          this.$toasted.error('Ocorreu um erro inesperado!')
      }
    }
  }
}
</script>