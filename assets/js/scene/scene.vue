<template>
  <div class="scene"></div>
</template>

<script>
import Main from './comps/Main'

export default {
  name: 'Scene',
  mounted() {
    this.scene = new Main(this.$el)
    this.scene.createBackground()
    // this.scene.addClippingMask()
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
