<template>
  <main
    :class="[
      `layout`,
      { 'no-touch': !isTouch },
      { 'is-touch': isTouch },
      { isScrolling },
    ]"
  >
    <Scene v-if="isResized" ref="scene" />
    <Navigation />
    <Scrollbar ref="scrollbar" :projects="3" />

    <div ref="scroll" class="scroll">
      <Nuxt ref="page" :key="$route.params.slug || $route.name" />
    </div>
    <div class="main-line"></div>

    <Footer />
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

import transform from 'dom-transform'
import MouseHelper from '../assets/js/utils/MouseHelper'
import ResizeHelper from '../assets/js/utils/ResizeHelper'
import ScrollHelper from '~/assets/js/utils/ScrollHelper'

import WheelHelper from '~/assets/js/utils/WheelHelper'

import Scrollbar from '~/components/projects/scrollbar.vue'

import emitter from '~/assets/js/events/EventsEmitter'
import Navigation from '~/components/common/navigation.vue'
import Footer from '~/components/common/footer.vue'
import Scene from '~/components/scene/scene.vue'

export default {
  components: {
    Navigation,
    Scrollbar,
    Footer,
    Scene,
  },

  data() {
    return {
      route: this.$route.name,
      scrollTop: 0,
      isScrolling: false,
      isResized: false,
    }
  },
  computed: {
    ...mapGetters(['isTouch']),
  },
  mounted() {
    console.log('mounted')

    const gsap = this.$gsap
    gsap.ticker.add(this.tick.bind(this))

    emitter.on('GLOBAL:RESIZE', this.onResize.bind(this))
    emitter.on('PAGE:MOUNTED', this.onMounted.bind(this))
    if (this.isTouch) {
      document.querySelector('html').classList.add('is-touch')
    }
  },

  methods: {
    tick() {
      if (!this.w) return
      // console.log('tick layout')
      WheelHelper.tick()
      ScrollHelper.tick()
      if (!this.isTouch) MouseHelper.tick()
      const scrollTop = this.isTouch
        ? ScrollHelper.scrollTop
        : Math.round(ScrollHelper.ease)
      if (this.$refs.page && this.$refs.page.$children[0]) {
        this.$refs.page.$children[0].tick &&
          this.$refs.page.$children[0].tick(scrollTop)
      }
      if (!this.isTouch) {
        transform(this.$refs.scroll, {
          translate3d: [0, -scrollTop, 0],
        })
      }

      if (Math.abs(this.scrollTop - scrollTop) >= 1) {
        this.isScrolling = true
      } else {
        this.isScrolling = false
      }

      this.scrollTop = scrollTop
      this.$refs.scrollbar.tick(scrollTop)
      if (this.$refs.scene.tick) {
        this.$refs.scene.tick(scrollTop)
      }
    },
    onResize() {
      this.isResized = true
      console.log('resize layout')
      this.w = ResizeHelper.width()
      this.h = ResizeHelper.height()

      const pageHeight = this.$refs.scroll.clientHeight
      if (!this.isTouch) {
        document.body.style.height = pageHeight + 'px'
      }

      if (this.$refs.page && this.$refs.page.$children[0])
        this.$refs.page.$children[0].resize &&
          this.$refs.page.$children[0].resize(this.w, this.h, pageHeight)

      this.$refs.scrollbar.resize(this.w, this.h, pageHeight)

      if (this.$refs.scene) {
        this.$refs.scene.resize(this.w, this.h, pageHeight)
      }
    },

    onMounted() {
      console.log('on mounted')
      ScrollHelper.goTo(0)
      if ('requestIdleCallback' in window) {
        requestIdleCallback(this.onMountedReady.bind(this), {
          timeout: 500,
        })
      } else {
        setTimeout(() => {
          this.onMountedReady()
        }, 500)
      }
    },
    onMountedReady() {
      console.log('on mounted ready')

      this.onResize()
    },
  },
}
</script>

<style lang="scss">
.isScrolling * {
  user-select: none;
}

.no-touch.isScrolling .scroll {
  will-change: transform;
}
.layout {
  position: relative;
  overflow: hidden;
  width: 100vw;
  min-height: 100vh;

  &.no-touch {
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }
  .scroll {
    z-index: z('scroll');
    position: relative;
  }
}

.main-line {
  display: none;
  opacity: 1;
  width: 6px;
  height: 70px;
  position: absolute;
  top: 39%;
  left: 53%;
  background: $color-dark;
}
</style>
