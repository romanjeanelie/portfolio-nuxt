<template>
  <div ref="sliderContainer" class="slider__container">
    <div class="controls__mobile">
      <div class="controls__top"></div>
      <div class="controls__bottom">
        <div ref="prevMobile" class="prev" @click="prevSlide">prev</div>
        <div ref="closeMobile" class="close" @click="animSliderOutMobile">
          close
        </div>
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
          <SanityImage :asset-id="image.asset._ref" alt="spectalce" />
        </div>
        <div
          v-for="image in imagesFilms"
          :key="image._key"
          ref="imageFilm"
          class="image__wrapper"
        >
          <SanityImage :asset-id="image.asset._ref" alt="film" />
        </div>
      </div>

      <div class="controls">
        <CursorSlider ref="cursorSlider" />
        <div class="is-touch__controls">
          <Left ref="touchLeft" class="left" />
          <Right ref="touchRight" class="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import CursorSlider from '~/components/common/buttons/cursorSlider.vue'
import Left from '~/components/common/buttons/left.vue'
import Right from '~/components/common/buttons/right.vue'

import emitter from '~/assets/js/events/EventsEmitter'

export default {
  components: {
    CursorSlider,
    Left,
    Right,
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
      lineAnimated: false,
      sliderShown: false,
    }
  },
  computed: {
    ...mapState(['reducedMotion']),
    ...mapGetters(['isMobile', 'isTouch']),
  },
  mounted() {
    this.$nextTick(() => {
      // Force resize  for istouch devices

      this.controlsListeners()
      if (this.isMobile) {
        this.controlsMobileSplitted = new this.$SplitText(
          [
            this.$refs.prevMobile,
            this.$refs.closeMobile,
            this.$refs.nextMobile,
          ],
          {
            type: 'lines',
            linesClass: 'lineControls',
          }
        )
      }
    })
  },
  methods: {
    resize(w) {
      this.pageWidth = w

      this.sliderSizes.x = this.$refs.slider.getBoundingClientRect().x
      this.sliderSizes.y = this.$refs.slider.getBoundingClientRect().y
      this.sliderSizes.width = this.$refs.slider.getBoundingClientRect().width
      this.sliderSizes.height = this.$refs.slider.getBoundingClientRect().height

      this.resizeLine()
    },
    resizeLine() {
      if (!this.lineAnimated) return
      const gsap = this.$gsap
      const scaleLine = 5.6 * (this.pageWidth / 100)

      gsap.set(this.$refs.lineWrapper, {
        scaleX: scaleLine,
      })

      gsap.set(this.$refs.line, {
        scaleX: 0.012,
      })
    },
    mouseEnter() {
      if (!this.sliderShown) return
      if (this.isTouch || this.reducedMotion) return
      document.body.style.cursor = 'none'
      this.$refs.cursorSlider.displayIn()
    },
    mouseMove(e) {
      if (!this.sliderShown) return
      if (this.isTouch || this.reducedMotion) return
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
      if (!this.sliderShown) return
      if (this.isTouch || this.reducedMotion) return
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

      const tl = this.$gsap.timeline()

      tl.to('.about__presentation', {
        scale: 0.95,
        opacity: 0,
      })
      tl.to(
        '.about__name__wrapper',
        {
          scale: 0.95,
          delay: 0.2,
          opacity: 0,
        },
        '<'
      )

      // Fade in Slider
      tl.fromTo(
        this.$refs.sliderContainer,
        {
          scale: 0.9,
          opacity: 0,
        },
        {
          scale: 1,
          duration: 1,
          opacity: 1,
        }
      )

      tl.to(
        '.navigation__phone',
        {
          opacity: 0,
        },
        '<'
      )

      tl.fromTo(
        this.controlsMobileSplitted.lines,
        {
          y: 30,
        },
        {
          y: 0,
          duration: 1,
          onComplete: () => {
            this.isAnimating = false
            this.sliderShown = true
          },
        },
        '<'
      )
    },

    animSliderOutMobile() {
      if (this.isAnimating) return
      this.isAnimating = true

      const tl = this.$gsap.timeline()

      tl.to(
        this.controlsMobileSplitted.lines,
        {
          y: 20,
          duration: 1,
        },
        '<'
      )

      // Fade out Slider
      tl.to(
        this.$refs.sliderContainer,
        {
          scale: 0.9,
          opacity: 0,
        },
        '-=1'
      )

      tl.to(
        '.about__presentation',
        {
          scale: 1,
          opacity: 1,
        },
        '<'
      )
      tl.to(
        '.about__name__wrapper',
        {
          scale: 1,
          delay: 0.2,
          opacity: 1,
        },
        '<'
      )

      tl.to(
        '.navigation__phone',
        {
          opacity: 1,
          onComplete: () => {
            this.isAnimating = false
            this.sliderShown = false
          },
        },
        '<'
      )

      const aboutRightEl = document.querySelector('.about__right')
      aboutRightEl.style.pointerEvents = 'none'

      this.$refs.slider.style.pointerEvents = 'none'

      this.categoryDisplaid = null
      emitter.emit('SLIDER:HIDE', this.categoryDisplaid)
      setTimeout(() => {
        this.resetSlide()
      }, 500)
    },

    controlsListeners() {
      if (this.isMobile) return
      this.$el.addEventListener('click', (e) => {
        // Check where click is
        if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
          this.mousePosition.x = e.clientX - this.sliderSizes.x
          this.mousePosition.y = e.clientY - this.sliderSizes.y
          if (
            this.mousePosition.x > this.sliderSizes.width / 2 &&
            this.cursorControl !== 'right'
          ) {
            this.cursorControl = 'right'
          } else if (
            this.mousePosition.x < this.sliderSizes.width / 2 &&
            this.cursorControl !== 'left'
          ) {
            this.cursorControl = 'left'
          }
        }
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
        if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
          setTimeout(() => {
            img.style.display = 'none'
          }, 600)
        } else {
          img.style.display = 'none'
        }
      })
      // Show spectacle images
      this.$refs.imageSpectacle.forEach((img) => {
        if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
          setTimeout(() => {
            img.style.display = 'block'
          }, 600)
        } else {
          img.style.display = 'block'
        }
      })
    },

    displayImagesFilms() {
      this.imagesDisplaid = this.imagesFilms

      // Hide spectacle images
      this.$refs.imageSpectacle.forEach((img) => {
        if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
          setTimeout(() => {
            img.style.display = 'none'
          }, 600)
        } else {
          img.style.display = 'none'
        }
      })
      // Show film images
      this.$refs.imageFilm.forEach((img) => {
        if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
          setTimeout(() => {
            img.style.display = 'block'
          }, 600)
        } else {
          img.style.display = 'block'
        }
      })
    },

    animSliderIn() {
      if (this.isAnimating) return
      this.isAnimating = true
      const gsap = this.$gsap
      const tl = gsap.timeline()
      // const scaleLine = 5.6 * (this.pageWidth / 100)
      const scaleLine = 5.6 * (this.pageWidth / 100)

      tl.to(this.$refs.lineWrapper, {
        scaleX: scaleLine,
        duration: 0.5,
        onComplete: () => {
          emitter.emit('SLIDER:SHOW', this.categoryDisplaid)
          if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
            gsap.to(this.$refs.slider, {
              opacity: 1,
            })
          }
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
            this.lineAnimated = true
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
        scaleX: this.reducedMotion ? 1.05 : 1,
        x: this.reducedMotion ? 0.3 : 0,
        duration: 0.5,
        onComplete: () => {
          this.resetSlide()
          emitter.emit('SLIDER:SHOW', this.categoryDisplaid)
          this.$refs.slider.style.pointerEvents = 'auto'
        },
      })

      tl.to(this.$refs.line, {
        scaleX: 0.012,
        x: 0,
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

      // Change opacity next control on mobile
      if (this.isMobile && this.indexSlide === this.imagesDisplaid.length - 1) {
        this.$refs.nextMobile.style.opacity = 1
      }

      // Change opacity next control on touch not mobile
      if (
        (!this.isMobile && this.isTouch) ||
        (this.reducedMotion &&
          this.indexSlide === this.imagesDisplaid.length - 1)
      ) {
        this.$refs.touchRight.$el.style.opacity = 1
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
        if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
          this.$refs.touchLeft.$el.style.opacity = 0.5
        }
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

      // Change opacity next control on touch not mobile
      if (
        (!this.isMobile && this.isTouch) ||
        (this.reducedMotion && this.indexSlide === 0)
      ) {
        this.$refs.touchLeft.$el.style.opacity = 1
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
        if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
          this.$refs.touchRight.$el.style.opacity = 0.5
        }
        if (this.isMobile) {
          this.$refs.nextMobile.style.opacity = 0.5
        }
      }
    },

    resetSlide() {
      this.indexSlide = 0
      this.$refs.sliderWrapper.style.transform = `translateX(0)`
      // isMobile controls
      this.$refs.prevMobile.style.opacity = 0.5
      this.$refs.nextMobile.style.opacity = 1
      // isTouch controls
      this.$refs.touchLeft.$el.style.opacity = 0.5
      this.$refs.touchRight.$el.style.opacity = 1
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
    bottom: 0;
    left: 0;
    height: vw(300);
    transform-origin: bottom left;
    transform: scaleX(1) scaleY(1); // Test origin: scaleX(1) scaleY(1)
    width: 6px;
    pointer-events: none;
    /* will-change: transform; */
    .line {
      position: absolute;
      height: 100%;
      width: 100%;
      transform-origin: right;
      background: $color-dark;
      will-change: transform;
    }
  }
}

.slider {
  /* pointer-events: none; */
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
    /* will-change: transform; */
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

    .is-touch__controls {
      display: none;
    }
  }
}

.is-touch {
  .slider__container {
    .line__wrapper {
      z-index: 2;
    }
  }
  .slider {
    opacity: 0;
    z-index: 0;
    .slider__wrapper {
      .image__wrapper {
        img {
          visibility: visible;
        }
      }
    }

    .controls {
      .is-touch__controls {
        display: block;
        width: 100%;
        height: 100%;
        /* background: red; */
        position: relative;
        .left {
          position: absolute;
          top: 50%;
          left: 10px;
          cursor: pointer;
          opacity: 0.5;
          transform: scale(0.7) translateY(-50%);
        }
        .right {
          display: block;
          position: absolute;
          top: 50%;
          left: unset;
          right: 10px;
          cursor: pointer;
          transform: scale(0.7) translateY(-50%);
        }
      }
    }
  }
}

.is-reduced {
  .slider__container {
    .line__wrapper {
      z-index: 2;
    }
  }
  .slider {
    opacity: 0;
    z-index: 0;
    .slider__wrapper {
      .image__wrapper {
        img {
          visibility: visible;
        }
      }
    }

    .controls {
      .is-touch__controls {
        display: block;
        width: 100%;
        height: 100%;
        /* background: red; */
        position: relative;
        .left {
          position: absolute;
          top: 50%;
          left: 10px;
          cursor: pointer;
          opacity: 0.5;
          transform: scale(0.7) translateY(-50%);
        }
        .right {
          display: block;
          position: absolute;
          top: 50%;
          left: unset;
          right: 10px;
          cursor: pointer;
          transform: scale(0.7) translateY(-50%);
        }
      }
    }
  }
}

@include media('<phone') {
  .slider__container {
    opacity: 0;
    height: 100vh;
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
        div {
          overflow: hidden;
        }
        .prev {
          opacity: 0.5;
        }
      }
    }
    .line__wrapper {
      display: none;
    }
  }

  .is-touch {
    .slider {
      opacity: 1;
      z-index: unset;
      .controls {
        .is-touch__controls {
          display: none;
        }
      }
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
