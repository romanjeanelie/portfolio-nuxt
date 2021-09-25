<template>
  <div ref="loader" class="loader">
    <div class="percentage__wrapper">
      <p ref="percentage">{{ progressComputed }}%</p>
    </div>
    <div ref="line" class="line"></div>
  </div>
</template>

<script>
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      progressComputed: 0,
      animated: false,
      complete: false,
      valuesToAnimate: {},
      interval: null,
    }
  },

  mounted() {},
  methods: {
    init() {
      this.$gsap.to(this.$refs.percentage, {
        opacity: 1,
        onComplete: this.animateIn,
      })
      // this.$gsap.to(this.$refs.line, {
      //   scaleY: 0,
      // })
    },
    animateIn() {
      this.interval = setInterval(() => {
        if (this.progress * 100 > this.progressComputed) {
          this.progressComputed++
          this.$gsap.killTweensOf(this.$refs.line)
          this.$gsap.to(this.$refs.line, {
            scaleY: this.progressComputed / 100,
            onUpdate: () => {
              const value = this.$gsap.getProperty(this.$refs.line, 'scaleY')
              if (value === 1) {
                this.endAnim()
              }
            },
          })
        }
      }, 20)
    },

    endAnim() {
      emitter.emit('LOADER:MOUNTED')
      this.complete = true
      clearInterval(this.interval)
      this.$refs.line.style.transition = 'transform 0'
      this.$gsap.killTweensOf(this.$refs.line)

      const tl = this.$gsap.timeline()

      tl.to(this.$refs.percentage, {
        delay: 0.5,
        y: 30,
        duration: 2,
      })

      tl.set(
        this.$refs.line,
        {
          scaleY: 0,
          delay: 0.8,
        },
        '<'
      )
    },
  },
}
</script>

<style lang="scss">
.loader {
  /* display: none; */
  z-index: z('projectBarre');

  position: fixed;
  left: 50%;
  top: 40%;

  transform: translateX(0);
  .percentage__wrapper {
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    padding-right: vw(10);
    p {
      opacity: 0;
      display: block;
    }
  }

  .line {
    width: 5px;
    height: 60px;
    background: $color-dark;
    transform: scaleX(1) scaleY(0.001);
    transform-origin: center bottom;
    transition: transform 100ms linear;
    &.inactive {
      display: none;
    }
  }
}
</style>
