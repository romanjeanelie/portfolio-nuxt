<template>
  <div class="scene"></div>
</template>

<script>
import { mapState } from 'vuex'
import Main from './comps/Main'
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  name: 'Scene',
  computed: {
    ...mapState(['allProjects']),
  },
  mounted() {
    this.scene = new Main(this.$el, this.allProjects, this.$route.name)
    emitter.emit('GLOBAL:RESIZE')
    emitter.on('PROJECT:SHOW', (index) => {
      // this.scene.animateInPlanesProjects(index)
      this.scene.projectShow = true
    })
  },
  methods: {
    tick(scrollTop) {
      this.scene.tick(scrollTop)
    },
    resize(w, h, pageHeight) {
      if (w && h) {
        this.w = w
        this.h = h
        this.ph = pageHeight
      }
      this.scene.resize(this.w, this.h, this.ph)
      // this.scene.resize(this.w, this.$el.clientHeight, pageHeight)
    },
    changePage() {
      switch (this.$route.name) {
        case 'projects':
          this.$nextTick(() => {
            this.scene.createPlanesProject()
          })
          break
        case 'index':
          this.scene.destroyPlanesProjects()
          break
        case 'about':
          this.scene.destroyPlanesProjects()
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
