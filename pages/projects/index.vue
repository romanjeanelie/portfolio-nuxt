<template>
  <div class="projects">
    <div class="projects__wrapper">
      <main>
        <div
          v-for="(project, i) in projects"
          :key="project._id"
          class="project__wrapper"
        >
          <Project
            ref="projects"
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
import emitter from '~/assets/js/events/EventsEmitter'
import Project from '~/components/projects/project.vue'

export default {
  components: { Project },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm._data.animationFrom = from.name
    })
  },
  asyncData({ $sanity }) {
    const query = groq`{ "projects": *[_type == 'projects']| order(order asc){ _id, title, slug, date }}`
    return $sanity.fetch(query)
  },

  data() {
    return {
      animationFrom: null,
    }
  },

  mounted() {
    this.els = [...this.$refs.projects]
    this.$nextTick(() => {
      emitter.emit('GLOBAL:RESIZE')
      emitter.emit('PAGE:MOUNTED')
    })
  },
  methods: {
    animateIn() {
      console.log('projects page animate in')
    },

    resize(w, h) {
      this.els.forEach((projectEl) => {
        projectEl.resize(w, h)
      })
    },
    tick(scrollTop) {
      this.scrollTop = scrollTop
      this.els.forEach((projectEl) => {
        projectEl.tick(scrollTop)
      })
    },
  },
}
</script>

<style lang="scss">
.projects {
  opacity: 1;
}
.project__wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  padding-left: vw(110);
  /* margin-top: vw(30); */
}
</style>
