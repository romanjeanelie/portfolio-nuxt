<template>
  <div class="scene"></div>
</template>

<script>
import { mapState } from 'vuex'
import Main from './comps/Main'

export default {
  name: 'Scene',
  computed: {
    ...mapState(['allProjects']),
  },
  mounted() {
    setTimeout(() => {
      this.scene = new Main(this.$el, this.allProjects)
    }, 0)
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
      this.scene.resize(this.w, this.$el.clientHeight, pageHeight)
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
