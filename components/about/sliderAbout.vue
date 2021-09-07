<template>
  <div class="slider__container">
    <div ref="lineWrapper" class="line__wrapper">
      <div ref="line" class="line"></div>
    </div>
    <div class="slider" @mousemove="keepSlider" @mouseleave="forgetSlider">
      <div ref="sliderWrapper" class="slider__wrapper">
        <div v-for="image in images" :key="image._key" class="image__wrapper">
          <SanityImage :asset-id="image.asset._ref" />
        </div>
      </div>

      <div ref="controls" class="controls">
        <div
          id="controlsLeft"
          ref="controlsLeft"
          class="controls__left"
          @mouseenter="showControls"
          @mouseleave="hideControls"
          @mousemove="showControls"
        >
          <button id="btnLeft" @click="prevSlide">
            <Left />
          </button>
        </div>
        <div
          id="controlsRight"
          ref="controlsRight"
          class="controls__right"
          @mouseenter="showControls"
          @mouseleave="hideControls"
          @mousemove="showControls"
        >
          <button id="btnRight" @click="nextSlide">
            <Right />
          </button>
        </div>
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
      controlsShown: false,
    }
  },
  methods: {
    resize(w) {
      this.pageWidth = w
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

      this.timerSlider = setTimeout(() => {
        this.animSliderOut()
      }, 4000)
    },
    animSliderIn() {
      const gsap = this.$gsap
      const tl = gsap.timeline()
      const scaleLine = 6.2 * (this.pageWidth / 100)

      tl.to(
        this.$refs.lineWrapper,

        {
          scaleX: scaleLine,
          duration: 0.5,
          onComplete: () => {
            emitter.emit('SLIDER:SHOW', this.categoryDisplaid)
            this.$refs.controls.style.visibility = 'visible'
          },
        }
      )

      tl.to(
        this.$refs.line,

        {
          scaleX: 0.012,
          duration: 2,
          ease: 'expo.out',
        }
      )

      this.sliderShown = true
    },
    animSliderOutAndIn() {
      const gsap = this.$gsap
      const tl = gsap.timeline()

      tl.to(
        this.$refs.line,

        {
          scaleX: 1,
          duration: 1,
          ease: 'power1.out',
          onComplete: () => {
            emitter.emit('SLIDER:SHOW', this.categoryDisplaid)
            this.$refs.controls.style.visibility = 'hidden'
          },
        }
      )

      tl.to(
        this.$refs.line,

        {
          scaleX: 0.012,
          delay: 0.2,
          duration: 2,
          ease: 'expo.out',
          onComplete: () => {
            this.$refs.controls.style.visibility = 'visible'
          },
        }
      )
      this.sliderShown = true
    },
    animSliderOut() {
      console.log('anim line out')
      const gsap = this.$gsap
      const tl = gsap.timeline()

      tl.to(
        this.$refs.line,

        {
          scaleX: 1,
          duration: 0.5,
          onComplete: () => {
            emitter.emit('SLIDER:HIDE', this.categoryDisplaid)
            this.$refs.controls.style.visibility = 'hidden'
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
    keepSlider() {
      if (this.timerSlider) {
        clearTimeout(this.timerSlider)
      }
    },
    forgetSlider() {
      this.timerSlider = setTimeout(() => {
        this.animSliderOut()
      }, 4000)
    },
    prevSlide() {
      if (this.indexSlide < 0) return
      this.indexSlide--
      this.$refs.sliderWrapper.style.transform = `translateX(-${
        this.indexSlide * 100
      }%)`
    },
    nextSlide() {
      if (this.indexSlide > this.images.length - 2) return
      this.indexSlide++
      this.$refs.sliderWrapper.style.transform = `translateX(-${
        this.indexSlide * 100
      }%)`
    },
    showControls(e) {
      const gsap = this.$gsap
      if (!this.controlsShown) {
        switch (e.target.id) {
          case 'controlsRight':
            gsap.to(this.$refs.controlsRight, {
              opacity: 1,
            })
            this.controlsShown = true
            break
          case 'controlsLeft':
            gsap.to(this.$refs.controlsLeft, {
              opacity: 1,
            })
            this.controlsShown = true
            break
        }
      }
    },
    hideControls(e) {
      const gsap = this.$gsap
      if (this.controlsShown) {
        switch (e.target.id) {
          case 'controlsRight':
            gsap.to(this.$refs.controlsRight, {
              opacity: 0,
            })
            this.controlsShown = false
            break
          case 'controlsLeft':
            gsap.to(this.$refs.controlsLeft, {
              opacity: 0,
            })
            this.controlsShown = false
            break
        }
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
  transform-origin: top left;
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
  width: vw(500);
  overflow: hidden;

  /* background: black; */

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
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    div {
      opacity: 0;

      position: absolute;
      width: vw(130);
      height: 100%;
      top: 0;

      display: flex;
      align-items: center;
      padding: vw(15);
      button {
        z-index: 3;
        background: transparent;
        border: none;
        cursor: pointer;
        outline: none;
      }
    }

    .controls__left {
      left: 0;
      justify-content: flex-start;
      background: linear-gradient(
        -90deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 100%
      );
    }
    .controls__right {
      right: 0;
      justify-content: flex-end;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 100%
      );
    }
  }
}
</style>
