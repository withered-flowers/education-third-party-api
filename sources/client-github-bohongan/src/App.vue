<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      repos: []
    }
  },
  // methods: {
  // },
  async created() {
    const { data } = await axios.get('http://localhost:10000/custom-repos')
    this.repos = data.dataKembalian
  }
}
</script>

<template>
  <h1>Halo Dunia</h1>

  <ul>
    <li v-for="repo in repos" :key="repo.id">
      {{ repo.name }}
    </li>
  </ul>
</template>

<style scoped></style>
