<template>
  <div ref="controlsWrapper" class="controls__wrapper">
    <svg
      ref="controlsSvg"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      class="cursor-slider"
    >
      <path
        id="left"
        ref="left"
        data-name="Icon material-arrow_back"
        d="M24 10.5H5.745l8.385-8.385L12 0 0 12l12 12 2.115-2.115-8.37-8.385H24Z"
        fill="#fff"
      />
      <path
        id="right"
        ref="right"
        data-name="Icon material-arrow-forward"
        d="M12 0 9.885 2.115l8.37 8.385H0v3h18.255l-8.37 8.385L12 24l12-12Z"
        fill="#fff"
      />
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cursorControl: null,
      tlToRight: this.$gsap.timeline({ paused: true }),
    }
  },
  mounted() {
    this.tlToRight.to('#left', {
      duration: 0.5,
      morphSVG: '#right',
    })
  },
  methods: {
    displayIn() {
      this.$gsap.to(this.$refs.controlsWrapper, {
        opacity: 1,
      })
    },
    displayOut() {
      this.$gsap.to(this.$refs.controlsWrapper, {
        opacity: 0,
        duration: 0.6,
      })
    },
    displayLeft(index) {
      this.tlToRight.reverse()

      // Change opacity of control left
      if (index === 0) {
        this.$refs.controlsSvg.style.opacity = 0.5
      } else {
        this.$refs.controlsSvg.style.opacity = 1
      }
    },
    displayRight(index, length) {
      this.tlToRight.play()

      // Change opacity of control right
      if (index === length - 1) {
        this.$refs.controlsSvg.style.opacity = 0.5
      } else {
        this.$refs.controlsSvg.style.opacity = 1
      }
    },
    onMove(mousePosition) {
      this.$el.style.transform = `translate(${mousePosition.x}px,${mousePosition.y}px)`
    },
  },
}
</script>

<style lang="scss">
.controls__wrapper {
  opacity: 0;
  #right {
    display: none;
  }
}
</style>
