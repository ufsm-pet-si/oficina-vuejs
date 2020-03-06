<template>
<div class="container">
  <div class="content">
    <p>Type your e-mail and password to Sign In!</p>

    <form>
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

      <button type="submit">Sign In!</button>
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
  }
}
</script>