<template>
  <div class="container">
    <div class="content">
      <p>{{ editing ? 'Edit Post' : 'Create new Post' }}</p>
  
      <form @submit.prevent="handleSubmit">
        <label for="title">Title</label>
        <input
          v-model="post.title"
          type="text"
          name="title"
          >
        
        <label for="body">Text</label>
        <textarea 
          v-model="post.body"
          name="body"
          />

        <label>Image</label>
        <input 
          type="file"
          ref="image"
          @change="handleFileUpload"
          >
  
        <button type="submit">{{ editing ? 'Edit' : 'Create' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
  import { API_URL } from '@/assets/variables'

  export default {
    data() {
      return {
        post: {},
        image: '',
        editing: false
      }
    },
    computed: {
      posts() {
        return this.$store.getters.listOfPosts
      }
    },
    methods: {
      handleSubmit() {
        if (this.editing)
          this.updatePost()
        else
          this.savePost()
      },
      handleFileUpload() {
        this.image = this.$refs.image.files[0]
      },
      async savePost() {
        let post = this.post
        try {
          const response = await this.$http.post(`${API_URL}/posts`, {
            ...post
          })

          if (response.status === 201) {
            this.$toasted.success('Successfully created post!')
          }

          post = response.data
          
          await this.submitFile(post.id)

          this.$router.push('/posts')
        } catch(e) {
          this.$toasted.error(e.message)
        }
      },
      async updatePost() {
        let post = this.post
        try {
          const response = await this.$http.put(`${API_URL}/posts/${post.id}`,{
            ...post
          })

          if (response.status === 200)
            this.$toasted.success('Successfully updated post!')

            this.submitFile(post.id)

          this.$router.push('/posts')
        } catch(e) {
          this.$toasted.error(e.message)
        }
      },
      async submitFile(postId) {
        let formData = new FormData()
        
        formData.append('image', this.image)

        try {
          const response = await this.$http.post(`${API_URL}/posts/${postId}/images`,
            formData,
            {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          )

          if (response.status === 204)
            this.$toasted.success('Successfully uploaded image!')
        } catch(e) {
          this.$toasted.error(e)
        }
      }
    },
    created() {
      if ('postId' in this.$route.params) {
        this.post = this.posts.find(post => post.id === +this.$route.params.postId)
        this.editing = true
      }
    }
  }
</script>