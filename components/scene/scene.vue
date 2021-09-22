<template>
  <div class="scene"></div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Main from './comps/Main'
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  name: 'Scene',
  data() {
    return {
      routeName: this.$route.name,
      checkedMotion: false,
    }
  },

  computed: {
    ...mapState(['allProjects', 'about', 'reducedMotion']),
    ...mapGetters(['isMobile', 'isTouch']),
  },

  mounted() {
    this.$nextTick(() => {
      this.checkMotion().then(() => {
        this.checkedMotion = true

        this.scene = new Main(
          this.$el,
          this.allProjects,
          this.about,
          this.routeName,
          this.$route.params.slug,
          this.reducedMotion
        )
        emitter.emit('GLOBAL:RESIZE')
      })
    })
  },
  methods: {
    ...mapActions(['checkMotion']),
    tick(scrollTop) {
      if (this.scene && this.scene.tick) {
        this.scene.tick(scrollTop)
      }
    },
    resize(w, h, pageHeight) {
      if (!this.checkedMotion) return
      if (w && h) {
        this.w = w
        this.h = h
        this.ph = pageHeight
      }
      if (this.scene) {
        this.scene.resize(this.w, this.h, this.ph)
      }
    },
    changePage(from) {
      this.scene.slug = this.$route.params.slug

      switch (this.$route.name) {
        case 'projects':
          this.$nextTick(() => {
            this.scene.sliderProject.destroy()
            if (this.scene.sliderAbout) {
              this.scene.sliderAbout.destroy()
            }
            this.scene.projects.display(this.$route.params.slug, from)
          })
          break
        case 'projects-slug':
          this.$nextTick(() => {
            this.scene.projects.destroy()
            this.scene.sliderProject.destroy()
            this.scene.sliderProject.display(this.$route.params.slug)
          })
          break
        case 'about':
          this.$nextTick(() => {
            this.scene.projects.destroy()
            this.scene.sliderProject.destroy()
            if (this.scene.sliderAbout) {
              this.scene.sliderAbout.display()
            }
          })
          break
      }
    },
  },
}
</script>

<style lang="scss">
.scene {
  z-index: z('scene');
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
