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
import emitter from '~/assets/js/events/EventsEmitter'
import Project from '~/components/projects/project.vue'
import Scrollbar from '~/components/projects/scrollbar.vue'

const query = groq`{ "projects": *[_type == 'projects']{ _id, title, slug, date }}`

export default {
  components: { Project, Scrollbar },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === 'index') {
        console.log('data before route', vm._data)
        vm._data.animationFrom = from.name
      }
    })
  },
  asyncData({ $sanity }) {
    return $sanity.fetch(query)
  },

  data() {
    return {
      animationFrom: null,
    }
  },

  mounted() {
    if (this.animationFrom === 'index') {
      this.animateFromIndex()
    } else {
      this.animateIn()
    }
    emitter.emit('PAGE:MOUNTED')
  },
  methods: {
    animateFromIndex() {
      const tl = this.$gsap.timeline()

      tl.fromTo(
        '.navigation',
        {
          opacity: 0,
        },
        {
          delay: 0.7,
          duration: 1,
          opacity: 1,
        },
        '<'
      )
      tl.fromTo(
        '.footer',
        {
          opacity: 0,
        },
        {
          duration: 1,
          opacity: 1,
        },
        '<'
      )
      tl.fromTo(
        '.projects',
        {
          opacity: 0,
        },
        {
          duration: 1,
          opacity: 1,
        },
        '<'
      )
      tl.fromTo(
        '.projects .line',
        {
          x: -40,
        },
        {
          x: 0,
          duration: 1,
        },
        '<'
      )
    },

    animateIn() {
      this.$gsap.to('.projects', {
        opacity: 1,
      })
    },
  },
}
</script>

<style lang="scss">
.projects {
  opacity: 0;
}
.project__wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  padding-left: vw(110);
  margin-top: vw(30);
}
</style>
