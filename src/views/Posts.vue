<template>
  <div class="posts">
    <h1>This is the posts page</h1>
    <router-link to="/posts/create">New Post</router-link>
    <table border=1>
      <tr>
        <th>Title</th>
        <th>Text</th>
        <th>Image</th>
        <th>Publisher</th>
        <th>Actions</th>
      </tr>
      <tr v-for="(post, index) in posts" :key="index">
        <td>{{ post.title }}</td>
        <td>{{ post.body }}</td>
        <td>
          <img v-if="post.image" :src="post.image"/>
        </td>
        <td>{{ getUsername(post.user_id) }}</td>
        <td><router-link v-if="post.user_id == loggedUser.id" :to="`/posts/${post.id}`">Access</router-link></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    posts() {
      return this.$store.getters.listOfPosts
    },
    users() {
      return this.$store.getters.listOfUsers
    },
    loggedUser() {
      return this.$store.getters.loggedUser
    }
  },
  methods: {
    getUsername(userId) {
      let user = this.users.find(user => user.id === userId)
      return user.username
    }
  },
  created() {
    if ('ownerId' in this.$route.query) {
      this.$store.dispatch('fetchPosts', this.$route.query.ownerId)
    } else {
      this.$store.dispatch('fetchPosts')
    }
  }
}
</script>