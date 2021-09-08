<template>
  <div class="slider__container">
    <div ref="lineWrapper" class="line__wrapper">
      <div ref="line" class="line"></div>
    </div>
    <div
      ref="slider"
      class="slider"
      @mouseenter="mouseEnter"
      @mousemove="mouseMove"
      @mouseleave="mouseLeave"
    >
      <div ref="sliderWrapper" class="slider__wrapper">
        <div v-for="image in images" :key="image._key" class="image__wrapper">
          <SanityImage :asset-id="image.asset._ref" />
        </div>
      </div>

      <div class="controls">
        <Left ref="controlLeft" />
        <Right />
      </div>
    </div>
  </div>
</template>

<script>
import Left from '~/components/common/buttons/left.vue'
import Right from '~/components/common/buttons/right.vue'
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  components: {
    Left,
    Right,
  },
  props: {
    images: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      indexSlide: 0,
      timerSlider: null,
      timerInterval: null,
      isAnimating: false,
      sliderSizes: {},
      mousePosition: { x: 0, y: 0 },
    }
  },
  mounted() {},
  methods: {
    resize(w) {
      this.pageWidth = w

      this.sliderSizes.x = this.$refs.slider.getBoundingClientRect().x
      this.sliderSizes.y = this.$refs.slider.getBoundingClientRect().y
      this.sliderSizes.width = this.$refs.slider.getBoundingClientRect().width
      this.sliderSizes.height = this.$refs.slider.getBoundingClientRect().height
    },
    mouseEnter() {
      document.body.style.cursor = 'none'
    },
    mouseMove(e) {
      this.mousePosition.x = e.clientX - this.sliderSizes.x
      this.mousePosition.y = e.clientY - this.sliderSizes.y

      this.$refs.controlLeft.$el.style.transform = `translate(${this.mousePosition.x}px,${this.mousePosition.y}px)`

      // Keep slider
      if (this.timerSlider) {
        clearTimeout(this.timerSlider)
      }
    },
    mouseLeave() {
      document.body.style.cursor = 'default'
      // Forget slider
      this.timerSlider = setTimeout(() => {
        this.animSliderOut()
      }, 4000)
    },
    toggleSlider(category) {
      if (this.timerSlider) {
        clearTimeout(this.timerSlider)
      }
      if (this.categoryDisplaid === category) return
      this.categoryDisplaid = category

      if (this.sliderShown) {
        this.animSliderOutAndIn()
      } else {
        this.animSliderIn()
      }

      // this.timerSlider = setTimeout(() => {
      //   this.animSliderOut()
      //   this.categoryDisplaid = null
      // }, 4000)

      // this.timerSlider = setInterval(() => {
      //   this.nextSlide()
      // }, 2000)
    },
    animSliderIn() {
      if (this.isAnimating) return
      this.isAnimating = true
      const gsap = this.$gsap
      const tl = gsap.timeline()
      const scaleLine = 5.6 * (this.pageWidth / 100)

      tl.to(this.$refs.lineWrapper, {
        scaleX: scaleLine,
        duration: 0.5,
        onComplete: () => {
          emitter.emit('SLIDER:SHOW', this.categoryDisplaid)
        },
      })

      tl.to(
        this.$refs.line,

        {
          scaleX: 0.012,
          duration: 2,
          ease: 'expo.out',
          onComplete: () => {
            this.isAnimating = false
          },
        }
      )

      this.sliderShown = true
    },
    animSliderOutAndIn() {
      if (this.isAnimating) return
      this.isAnimating = true
      const gsap = this.$gsap
      const tl = gsap.timeline()

      tl.to(this.$refs.line, {
        scaleX: 1,
        duration: 1,
        ease: 'power1.out',
        onComplete: () => {
          emitter.emit('SLIDER:SHOW', this.categoryDisplaid)
        },
      })

      tl.to(this.$refs.line, {
        scaleX: 0.012,
        delay: 0.2,
        duration: 2,
        ease: 'expo.out',
        onComplete: () => {
          this.isAnimating = false
        },
      })
      this.sliderShown = true
    },
    animSliderOut() {
      if (this.isAnimating) return
      this.isAnimating = true
      const gsap = this.$gsap
      const tl = gsap.timeline()

      tl.to(
        this.$refs.line,

        {
          scaleX: 1,
          duration: 0.5,
          onComplete: () => {
            emitter.emit('SLIDER:HIDE', this.categoryDisplaid)
            this.isAnimating = false
          },
        }
      )
      tl.to(
        this.$refs.lineWrapper,

        {
          scaleX: 1,
          duration: 2,
          ease: 'expo.out',
        }
      )

      this.sliderShown = false
    },

    prevSlide() {
      if (this.indexSlide < 0) return
      emitter.emit('PREV:SLIDE')
      this.indexSlide--
      this.$refs.sliderWrapper.style.transform = `translateX(-${
        this.indexSlide * 100
      }%)`
    },
    nextSlide() {
      if (this.indexSlide > this.images.length - 2) {
        // this.animSliderOut()
        // this.categoryDisplaid = null
      } else {
        emitter.emit('NEXT:SLIDE')
        this.indexSlide++
        this.$refs.sliderWrapper.style.transform = `translateX(-${
          this.indexSlide * 100
        }%)`
      }
    },
  },
}
</script>

<style lang="scss">
.line__wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transform-origin: bottom left;
  transform: scaleX(1) scaleY(1);
  width: 6px;
  pointer-events: none;

  .line {
    position: absolute;
    height: 100%;
    width: 100%;
    transform-origin: right;

    background: $color-dark;
  }
}

.slider {
  position: relative;
  height: vw(300);
  width: vw(450);
  overflow: hidden;

  .slider__wrapper {
    height: 100%;
    position: relative;
    display: flex;
    transform: translateX(0); // value to modify
    transition: 300ms transform ease;
    .image__wrapper {
      flex-shrink: 0;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      img {
        visibility: hidden;
        height: 100%;
        width: auto;
      }
    }
  }

  .controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    svg {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
