<template>
  <div class="projects">
    <div class="projects__wrapper">
      <main>
        <Scrollbar :projects="3" />
        <div
          v-for="(project, i) in projects"
          :key="project._id"
          class="project__wrapper"
        >
          <Project
            :index="i"
            :name="project.title"
            :slug="project.slug.current"
            :date="project.date"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Project from '~/components/projects/project.vue'
import Scrollbar from '~/components/projects/scrollbar.vue'

const query = groq`{ "projects": *[_type == 'projects']{ _id, title, slug, date }}`

export default {
  components: { Project, Scrollbar },
  asyncData({ $sanity }) {
    return $sanity.fetch(query)
  },
  mounted() {
    console.log(this.projects[0].title)
  },
}
</script>

<style lang="scss">
.project__wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  padding-left: vw(110);
  margin-top: vw(30);
}
</style>
