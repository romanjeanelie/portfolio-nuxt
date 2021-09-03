<template>
  <div class="slider__container">
    <div
      class="slider"
      @mouseenter="showControls"
      @mouseleave="hideControls"
      @mousemove="showControls"
    >
      <div ref="sliderWrapper" class="slider__wrapper">
        <div v-for="image in images" :key="image._key" class="image__wrapper">
          <SanityImage :asset-id="image.asset._ref" />
        </div>
      </div>

      <div ref="controls" class="controls">
        <div class="controls__left">
          <button id="btnLeft" @click="prevSlide">
            <Left />
          </button>
        </div>
        <div class="controls__right">
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
      controlsShown: false,
      timerControls: null,
    }
  },
  methods: {
    prevSlide() {
      if (this.indexSlide < 0) return
      this.indexSlide--
      console.log(this.indexSlide)
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
    showControls() {
      const gsap = this.$gsap

      if (!this.controlsShown) {
        gsap.to(this.$refs.controls, {
          opacity: 1,
        })
        this.controlsShown = true

        this.timerControls = setTimeout(() => {
          this.hideControls()
        }, 1500)
      }
    },
    hideControls() {
      if (this.timerControls) {
        console.log('clear time out')
        clearTimeout(this.timerControls)
      }
      const gsap = this.$gsap
      if (this.controlsShown) {
        gsap.to(this.$refs.controls, {
          opacity: 0,
        })
        this.controlsShown = false
      }
    },
  },
}
</script>

<style lang="scss">
.slider {
  height: vw(300);
  width: vw(500);
  overflow: hidden;

  background: black;
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
        height: 100%;
        width: auto;
      }
    }
  }

  .controls {
    opacity: 0;

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    div {
      flex: 1;
      display: flex;
      align-items: center;
      padding: vw(15);
      button {
        background: transparent;
        border: none;
        cursor: pointer;
        outline: none;
      }
    }

    .controls__left {
      justify-content: flex-start;
      background: linear-gradient(
        -90deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 100%
      );
    }
    .controls__right {
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
