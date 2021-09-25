<template>
  <div ref="projectsPage" class="projects">
    <div class="projects__wrapper">
      <main ref="projectsMain">
        <div
          v-for="(project, i) in projects"
          :key="project._id"
          ref="projectWrapper"
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

    <div ref="controlsMobile" class="projects-controls__mobile">
      <button ref="prevMobile" class="prev" @click="prevProject">prev</button>
      <button ref="nextMobile" class="next" @click="nextProject">next</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      isAnimating: false,
      timer: null,
    }
  },
  head: {
    title: 'Projects - Roman Jean-Elie',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: "All projects since December '20",
      },
    ],
  },
  computed: {
    ...mapGetters(['isMobile']),
  },

  mounted() {
    this.$nextTick(() => {
      emitter.emit('GLOBAL:RESIZE')
      emitter.emit('PAGE:MOUNTED')
    })
  },

  methods: {
    animateIn() {
      const gsap = this.$gsap

      if (this.isMobile) {
        gsap.fromTo(
          this.$refs.projectWrapper,
          {
            scale: 0.5,
          },
          { scale: 1, duration: 1.5, ease: 'power2.out' }
        )
        gsap.to(this.$refs.controlsMobile, {
          y: 0,
          delay: 1,
        })

        gsap.set(this.$refs.projectWrapper[0], {
          pointerEvents: 'auto',
        })
      }

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
    /**
     * Mobile
     */
    prevProject() {
      if (this.isAnimating) return
      if (this.indexProject === 0) return

      clearTimeout(this.timer)
      this.isAnimating = true
      this.timer = setTimeout(() => {
        this.isAnimating = false
      }, 1000)

      this.indexProject--

      if (this.$refs.project[this.indexProject + 1]) {
        this.$refs.projectWrapper[this.indexProject + 1].style.pointerEvents =
          'auto'
        this.$refs.project[this.indexProject + 1].hideFomMobile()
      }

      this.$refs.projectWrapper[this.indexProject].style.pointerEvents = 'auto'
      this.$refs.project[this.indexProject].showFromMobile()

      // Fade in next btn
      if (this.indexProject < this.projects.length - 1) {
        this.$refs.nextMobile.style.opacity = 1
      }
      // Fade out prev btn
      if (this.indexProject === 0) {
        this.$refs.prevMobile.style.opacity = 0.5
      }
    },
    nextProject() {
      if (this.isAnimating) return
      if (this.indexProject === this.projects.length - 1) return

      clearTimeout(this.timer)
      this.isAnimating = true
      this.timer = setTimeout(() => {
        this.isAnimating = false
      }, 1000)

      this.indexProject++

      if (this.$refs.project[this.indexProject - 1]) {
        this.$refs.projectWrapper[this.indexProject - 1].style.pointerEvents =
          'auto'
        this.$refs.project[this.indexProject - 1].hideFomMobile()
      }

      this.$refs.projectWrapper[this.indexProject].style.pointerEvents = 'auto'
      this.$refs.project[this.indexProject].showFromMobile()

      // Fade in prev btn
      if (this.indexProject > 0) {
        this.$refs.prevMobile.style.opacity = 1
      }
      // Fade out next btn
      if (this.indexProject === this.projects.length - 1) {
        this.$refs.nextMobile.style.opacity = 0.5
      }
    },
  },
}
</script>

<style lang="scss">
.projects {
  opacity: 1;
  .project__wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    transform: translateX(-4%);
    padding-left: vw(110);
  }
}

.projects-controls__mobile {
  display: none;
}

@include media('<phone') {
  .projects {
    .project__wrapper {
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      min-width: 100vw;
      padding-left: 0;
      transform: translateX(0);
    }
  }

  .projects-controls__mobile {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    transform: translateY(50px);

    button {
      border: none;
      background: transparent;
      outline: none;
      cursor: pointer;
    }
    .prev {
      opacity: 0.5;
    }
  }
  @supports (-webkit-touch-callout: none) {
    .is-touch {
      .projects {
        .project__wrapper {
          min-height: stretch;
        }
      }
    }
  }
}
</style>
