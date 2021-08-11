<template>
  <canvas class="transition"></canvas>
</template>

<script>
export default {
  name: 'CanvasTransition',
  mounted() {
    this.ctx = this.$el.getContext('2d')
    this.fakeCanvas = document.createElement('canvas')
    this.fakeCtx = this.fakeCanvas.getContext('2d')
  },
  methods: {
    resize(w, h) {
      console.log('resize canvas')
      this.w = w
      this.h = h
      this.fakeCanvas.width = this.$el.width = w
      this.fakeCanvas.height = this.$el.height = h
    },
    tick() {
      this.draw()
    },
    draw() {
      const transition = -0.5 + this.transition * 2
      const top = transition * this.h
      const h = this.h - top
      this.ctx.clearRect(0, 0, this.w, this.h)
      this.fakeCtx.fillStyle = '#1a1a1a'
      this.fakeCtx.clearRect(0, 0, this.w, this.h)
      this.fakeCtx.beginPath()
      this.fakeCtx.rect(0, h, this.w, top)
      this.fakeCtx.rect(0, h, this.w, top)
      this.fakeCtx.moveTo(0, h)
      this.fakeCtx.fill()
      this.ctx.drawImage(this.fakeCanvas, 0, 0, this.w, this.h)
    },
    doTransition() {
      const gsap = this.$gsap
      this.isTransition = true
      this.transition = 0
      gsap.to('.barre', {
        y: '100%',
        scaleY: 10,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          console.log('transition complete')
        },
      })
    },
    hideTransition() {
      const gsap = this.$gsap

      if (!this.isTransition) return
      setTimeout(() => {
        this.isTransition = false
      }, 500)

      gsap
        .to(this.$el, {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        })
        .then(() => {
          gsap.set(this, {
            transition: 0,
          })
        })
    },
  },
}
</script>

<style lang="scss">
.transition {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  pointer-events: none;

  height: 100vh;
  width: 100vw;
  /* min-height: -webkit-fill-available; */
}
</style>
