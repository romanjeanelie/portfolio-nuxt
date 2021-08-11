<template>
  <div class="project">
    <h1 class="project__title">{{ project.title }}</h1>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'

export default {
  asyncData({ params, $sanity }) {
    const query = groq`{"project":*[_type == "projects" && slug.current == "${params.slug}"][0]}`
    return $sanity.fetch(query)
  },
}
</script>

<style lang="scss">
.project {
  width: 100vw;
  height: 100vh;
  background: $color-dark;
  color: $color-very-light;
}

.project__title {
  text-transform: uppercase;
  font-size: vw(100);
  word-spacing: 100vw;
}
</style>
