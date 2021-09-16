<template>
  <div ref="sliderContainer" class="slider__container">
    <div class="controls__mobile">
      <div class="controls__top">
        <div ref="closeMobile" class="close" @click="animSliderOutMobile">
          close
        </div>
      </div>
      <div class="controls__bottom">
        <div ref="prevMobile" class="prev" @click="prevSlide">prev</div>
        <div ref="nextMobile" class="next" @click="nextSlide">next</div>
      </div>
    </div>

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
        <div
          v-for="image in imagesSpectacles"
          :key="image._key"
          ref="imageSpectacle"
          class="image__wrapper"
        >
          <SanityImage :asset-id="image.asset._ref" />
        </div>
        <div
          v-for="image in imagesFilms"
          :key="image._key"
          ref="imageFilm"
          class="image__wrapper"
        >
          <SanityImage :asset-id="image.asset._ref" />
        </div>
      </div>

      <div class="controls">
        <CursorSlider ref="cursorSlider" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import CursorSlider from '~/components/common/buttons/cursorSlider.vue'

import emitter from '~/assets/js/events/EventsEmitter'

export default {
  components: {
    CursorSlider,
  },
  props: {
    imagesSpectacles: {
      type: Array,
      default: null,
    },
    imagesFilms: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      imagesDisplaid: [],
      indexSlide: 0,
      timerSlider: null,
      isAnimating: false,
      sliderSizes: {},
      mousePosition: { x: 0, y: 0 },
      cursorControl: null,
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
  },
  mounted() {
    this.controlsListeners()
  },
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
      this.$refs.cursorSlider.displayIn()
    },
    mouseMove(e) {
      // compute Mouse
      this.mousePosition.x = e.clientX - this.sliderSizes.x
      this.mousePosition.y = e.clientY - this.sliderSizes.y

      this.$refs.cursorSlider.onMove(this.mousePosition)

      // Toggle cursors prev / next
      if (
        this.mousePosition.x > this.sliderSizes.width / 2 &&
        this.cursorControl !== 'right'
      ) {
        this.cursorControl = 'right'
        this.$refs.cursorSlider.displayRight(
          this.indexSlide,
          this.imagesDisplaid.length
        )
      } else if (
        this.mousePosition.x < this.sliderSizes.width / 2 &&
        this.cursorControl !== 'left'
      ) {
        this.cursorControl = 'left'
        this.$refs.cursorSlider.displayLeft(this.indexSlide)
      }

      // Keep slider
      if (this.timerSlider) {
        clearTimeout(this.timerSlider)
      }
    },
    mouseLeave() {
      document.body.style.cursor = 'default'
      this.cursorControl = null
      this.$refs.cursorSlider.displayOut()

      // Forget slider
      this.timerSlider = setTimeout(() => {
        this.animSliderOut()
      }, 2000)
    },

    /**
     * Mobile
     */
    toggleSliderMobile(category) {
      // Fade in Slider
      this.$gsap.to(this.$refs.sliderContainer, {
        opacity: 1,
      })

      if (this.isAnimating) return
      if (this.timerSlider) {
        clearTimeout(this.timerSlider)
      }
      if (this.categoryDisplaid === category) return

      // Change images depend on category
      if (category === 'imagesSpectacles') {
        this.displayImagesSpectacles()
      } else if (category === 'imagesFilms') {
        this.displayImagesFilms()
      }

      this.categoryDisplaid = category

      this.animSliderInMobile()
    },

    animSliderInMobile() {
      if (this.isAnimating) return
      this.isAnimating = true

      emitter.emit('SLIDER:SHOW', this.categoryDisplaid)

      this.isAnimating = false
      this.sliderShown = true
    },

    animSliderOutMobile() {
      if (this.isAnimating) return

      this.$gsap.to(this.$refs.sliderContainer, {
        opacity: 0,
      })

      const aboutRightEl = document.querySelector('.about__right')
      aboutRightEl.style.pointerEvents = 'none'

      this.isAnimating = true
      this.$refs.slider.style.pointerEvents = 'none'

      this.categoryDisplaid = null
      emitter.emit('SLIDER:HIDE', this.categoryDisplaid)
      this.isAnimating = false
      this.resetSlide()

      this.sliderShown = false
    },

    controlsListeners() {
      if (this.isMobile) return
      this.$el.addEventListener('click', () => {
        if (this.cursorControl === 'left') {
          this.prevSlide()
        }
        if (this.cursorControl === 'right') {
          this.nextSlide()
        }
      })
    },

    toggleSlider(category) {
      if (this.isAnimating) return
      if (this.timerSlider) {
        clearTimeout(this.timerSlider)
      }
      if (this.categoryDisplaid === category) return

      // Change images depend on category
      if (category === 'imagesSpectacles') {
        this.displayImagesSpectacles()
      } else if (category === 'imagesFilms') {
        this.displayImagesFilms()
      }

      this.categoryDisplaid = category

      if (this.sliderShown) {
        this.animSliderOutAndIn()
      } else {
        this.animSliderIn()
      }
    },
    displayImagesSpectacles() {
      this.imagesDisplaid = this.imagesSpectacles

      // Hide film images
      this.$refs.imageFilm.forEach((img) => {
        img.style.display = 'none'
      })
      // Show spectacle images
      this.$refs.imageSpectacle.forEach((img) => {
        img.style.display = 'block'
      })
    },

    displayImagesFilms() {
      this.imagesDisplaid = this.imagesFilms

      // Hide spectacle images
      this.$refs.imageSpectacle.forEach((img) => {
        img.style.display = 'none'
      })
      // Show film images
      this.$refs.imageFilm.forEach((img) => {
        img.style.display = 'block'
      })
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
          this.$refs.slider.style.pointerEvents = 'auto'
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
      this.$refs.slider.style.pointerEvents = 'none'

      const gsap = this.$gsap
      const tl = gsap.timeline()

      tl.to(this.$refs.line, {
        scaleX: 1,
        duration: 0.5,
        onComplete: () => {
          this.resetSlide()
          emitter.emit('SLIDER:SHOW', this.categoryDisplaid)
          this.$refs.slider.style.pointerEvents = 'auto'
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
      this.$refs.slider.style.pointerEvents = 'none'

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
            this.categoryDisplaid = null
            this.resetSlide()
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
      if (this.indexSlide < 1) return

      // // Not change while animating
      // if (this.isAnimating) return
      // this.isAnimating = true
      // setTimeout(() => {
      //   this.isAnimating = false
      // }, 700)

      // Change opacity next control on mobile
      if (this.isMobile && this.indexSlide === this.imagesDisplaid.length - 1) {
        this.$refs.nextMobile.style.opacity = 1
      }

      emitter.emit('PREV:SLIDE')
      this.indexSlide--
      this.$refs.sliderWrapper.style.transform = `translateX(-${
        this.indexSlide * 100
      }%)`

      // Change opacity of control left
      if (this.indexSlide === 0) {
        this.$gsap.to(this.$refs.cursorSlider.$refs.controlsSvg, {
          opacity: 0.5,
        })
        if (this.isMobile) {
          this.$refs.prevMobile.style.opacity = 0.5
        }
      }
    },
    nextSlide() {
      if (this.indexSlide > this.imagesDisplaid.length - 2) return

      // Change opacity prev control on mobile
      if (this.isMobile && this.indexSlide === 0) {
        this.$refs.prevMobile.style.opacity = 1
      }

      emitter.emit('NEXT:SLIDE')
      this.indexSlide++
      this.$refs.sliderWrapper.style.transform = `translateX(-${
        this.indexSlide * 100
      }%)`

      // Change opacity of control right
      if (this.indexSlide === this.imagesDisplaid.length - 1) {
        this.$gsap.to(this.$refs.cursorSlider.$refs.controlsSvg, {
          opacity: 0.5,
        })
        if (this.isMobile) {
          this.$refs.nextMobile.style.opacity = 0.5
        }
      }
    },
    resetSlide() {
      this.indexSlide = 0
      this.$refs.sliderWrapper.style.transform = `translateX(0)`
    },
  },
}
</script>

<style lang="scss">
.slider__container {
  .controls__mobile {
    display: none;
  }
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
}

.slider {
  pointer-events: none;
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

@include media('<phone') {
  .slider__container {
    opacity: 0;
    height: 100%;
    width: 100%;
    background: black;
    display: flex;
    align-items: center;
    .controls__mobile {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: $color-very-light;
      text-transform: uppercase;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 50px;

      .controls__top {
        display: flex;
        justify-content: center;
      }
      .controls__bottom {
        display: flex;
        justify-content: space-between;
        .prev {
          opacity: 0.5;
        }
      }
    }
    .line__wrapper {
      display: none;
    }
  }

  .slider {
    height: auto;
    width: 100%;
    .slider__wrapper {
      height: auto;
      width: 100vw;
      .image__wrapper {
        img {
          width: 100vw;
          height: auto;
          visibility: visible;
        }
      }
    }
  }
}
</style>
