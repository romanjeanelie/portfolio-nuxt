<template>
  <div ref="projectsPage" class="projects">
    <div class="projects__wrapper">
      <main ref="projectsMain">
        <div
          v-for="(project, i) in projects"
          :key="project._id"
          class="project__wrapper"
        >
          <Project
            ref="project"
            :index="i"
            :name="project.title"
            :slug="project.slug.current"
            :date="project.date"
            :main-image="project.mainImage"
            :previous-page="previousPage"
          />
        </div>
      </main>
    </div>

    <div class="projects__mobile">
      <button class="prev" @click="prevProject">prev</button>
      <button class="next" @click="nextProject">next</button>
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
      vm._data.previousPage = from.name
    })
  },
  asyncData({ $sanity }) {
    const query = groq`{ "projects": *[_type == 'projects']| order(order asc){ _id, title, slug, date, mainImage }}`
    return $sanity.fetch(query)
  },

  data() {
    return {
      previousPage: 'test prev',
      indexProject: 0,
    }
  },

  mounted() {
    this.$nextTick(() => {
      console.log(this.projects)
      // this.reset()
      emitter.emit('GLOBAL:RESIZE')
      emitter.emit('PAGE:MOUNTED')
    })
  },
  methods: {
    animateIn() {
      this.$nextTick(() => {
        this.$refs.project.forEach((project) => {
          project.init()
        })
      })
    },

    resize(w, h) {
      this.$refs.project.forEach((projectEl) => {
        projectEl.resize(w, h)
      })
    },
    tick(scrollTop) {
      this.scrollTop = scrollTop
      this.$refs.project.forEach((projectEl) => {
        projectEl.tick(scrollTop)
      })
    },
    reset() {
      const gsap = this.$gsap

      // gsap.killTweensOf(this.$refs.projects)

      gsap.set(this.$refs.projectsPage, {
        opacity: 1,
      })
    },
    /**
     * Mobile
     */
    prevProject() {
      if (this.indexProject === 0) return
      this.indexProject--

      if (this.$refs.project[this.indexProject + 1]) {
        this.$refs.project[this.indexProject + 1].hideFomMobile()
      }

      this.$refs.project[this.indexProject].showFromMobile()
    },
    nextProject() {
      if (this.indexProject === this.projects.length - 1) return
      this.indexProject++

      if (this.$refs.project[this.indexProject - 1]) {
        this.$refs.project[this.indexProject - 1].hideFomMobile()
      }

      this.$refs.project[this.indexProject].showFromMobile()
    },
  },
}
</script>

<style lang="scss">
.projects {
  opacity: 1;
  .project__wrapper {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    transform: translateX(-4%);
    padding-left: vw(110);
  }
}

.projects__mobile {
  display: none;
}

@include media('<phone') {
  .projects {
    height: 100vh;
    .project__wrapper {
      position: absolute;
      top: 0;
      left: 0;
      min-width: 100vw;
      padding-left: 0;
      transform: translateX(0);
    }
  }

  .projects__mobile {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 16px;
    display: flex;
    justify-content: space-between;

    button {
      border: none;
      background: transparent;
      outline: none;
      cursor: pointer;
    }
  }
}
</style>
