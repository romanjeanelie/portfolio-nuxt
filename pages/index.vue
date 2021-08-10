<template>
  <div class="home">
    <ul>
      <li v-for="(project, i) in projects" :key="`award-${i}`">
        <NuxtLink class="link" :to="project.slug.current">
          {{ project.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'

const query = groq`{ "projects": *[_type == 'projects']{ _id, title, subtitlte, slug, body }}`

export default {
  asyncData({ $sanity }) {
    return $sanity.fetch(query)
  },
}
</script>
