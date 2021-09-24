<template>
  <div
    :class="[
      `layout`,
      { 'no-touch': !isTouch },
      { 'is-mobile': isMobile },
      { 'is-touch': isTouch },
      { 'is-reduced': reducedMotion },
      { isScrolling },
    ]"
  >
    <div ref="rotate" class="rotate">
      <p>Please rotate your device</p>
    </div>
    <client-only>
      <Loader v-if="!isTouch" ref="loader" :progress="progress" />
    </client-only>

    <ProjectBarre ref="projectBarre" />

    <client-only>
      <Scene v-if="!isTouch" ref="scene" />
    </client-only>

    <Navigation ref="navigation" />
    <Scrollbar ref="scrollbar" :projects="3" />

    <div ref="scroll" class="scroll">
      <Nuxt ref="page" :key="$route.params.slug || $route.name" />
    </div>
    <div class="main-line"></div>

    <Footer ref="footer" />
  </div>
</template>

<script>
/* eslint-disable */

import { mapState, mapGetters, mapActions } from 'vuex'

import transform from 'dom-transform'

import MouseHelper from '../assets/js/utils/MouseHelper'
import ResizeHelper from '../assets/js/utils/ResizeHelper'
import ScrollHelper from '~/assets/js/utils/ScrollHelper'
import TransitionPage from '~/assets/js/transitions/TransitionPage'
import WheelHelper from '~/assets/js/utils/WheelHelper'
import emitter from '~/assets/js/events/EventsEmitter'

import Loader from '~/components/common/loader.vue'
import Scrollbar from '~/components/projects/scrollbar.vue'
import Navigation from '~/components/common/navigation.vue'
import ProjectBarre from '~/components/common/projectBarre.vue'
import Footer from '~/components/common/footer.vue'
import Scene from '~/components/scene/scene.vue'

export default {
  components: {
    Loader,
    Navigation,
    Scrollbar,
    ProjectBarre,
    Footer,
    Scene,
  },

  data() {
    return {
      firstVisit: true,
      route: this.$route.name,
      scrollTop: 0,
      isScrolling: false,
      showScrollbar: false,
      canvasIsLoaded: false,
      progress: 0,
      isMobileOriented: false,
    }
  },
  computed: {
    ...mapGetters(['isMobile', 'isTablet', 'isTouch']),
    ...mapState(['reducedMotion']),
  },

  mounted() {
    this.checkMobile()
    this.checkTablet()
    this.checkMotion().then(() => {
      this.setRouterHook()
    })

    this.$nextTick(() => {
      this.$nextTick(() => {
        if (this.$route.name === 'index' && this.firstVisit && !this.isTouch) {
          this.$refs.loader.init()
        }
      })
    })

    emitter.on('GLOBAL:RESIZE', this.resize.bind(this))
    emitter.on('PAGE:MOUNTED', () => {
      if (this.isTouch) {
        // Correction to resize after scrolling
        window.requestAnimationFrame(() => {
          this.resize()
        })
        this.pageAnimateIn()
      } else if (this.canvasIsLoaded) {
        this.resize()
        this.pageAnimateIn()
      } else {
        emitter.on('CANVAS:LOADED', () => {
          this.canvasIsLoaded = true
          this.resize()
          this.pageAnimateIn()
        })
      }
    })

    this.resize()

    const gsap = this.$gsap
    gsap.ticker.add(this.tick.bind(this))
    if (this.isTouch) {
      document.querySelector('html').classList.add('is-touch')
    }
  },

  methods: {
    ...mapActions(['checkMobile', 'checkTablet', 'checkMotion']),

    tick() {
      if (!this.w) return
      if (WheelHelper && WheelHelper.tick) {
        WheelHelper.tick()
      }

      if (ScrollHelper && ScrollHelper.tick) {
        ScrollHelper.tick()
      }

      if (!this.isTouch && MouseHelper && MouseHelper.tick) {
        MouseHelper.tick()
      }

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
      if (this.$refs.scrollbar && this.$refs.scrollbar.tick) {
        this.$refs.scrollbar.tick(scrollTop)
      }

      if (
        this.$refs.scene &&
        this.$refs.scene.tick &&
        this.$refs.scene.checkedMotion
      ) {
        if (!this.canvasIsLoaded) {
          this.progress = this.$refs.scene.scene.progress
        }
        this.$refs.scene.tick(scrollTop)
      }
    },
    resize() {
      if (this.isTouch && this.isScrolling) return
      this.checkRotation()
      if (this.isTouch) {
        ScrollHelper.resetScroll(0)
      }
      this.w = ResizeHelper.width()
      this.h = ResizeHelper.height()
      this.pageHeight = this.$refs.scroll.clientHeight
      if (!this.isTouch) {
        document.body.style.height = this.pageHeight + 'px'
      }
      if (this.$refs.page && this.$refs.page.$children[0])
        this.$refs.page.$children[0].resize &&
          this.$refs.page.$children[0].resize(this.w, this.h, this.pageHeight)

      this.$refs.scrollbar.resize(this.w, this.h, this.pageHeight)

      if (this.$refs.scene) {
        this.$refs.scene.resize(this.w, this.h, this.pageHeight)
      }

      if (this.transitionPage) {
        this.transitionPage.resize(this.w, this.h, this.pageHeight)
      }
    },
    checkRotation() {
      // Mobile
      if (this.isMobile) {
        if (window.innerHeight < window.innerWidth) {
          this.$refs.rotate.style.display = 'flex'
        } else {
          this.$refs.rotate.style.display = 'none'
        }
      }
      // Tablet
      if (this.isTablet) {
        if (window.innerHeight > window.innerWidth) {
          this.$refs.rotate.style.display = 'flex'
        } else {
          this.$refs.rotate.style.display = 'none'
        }
      }
    },
    setRouterHook() {
      this.transitionPage = new TransitionPage(
        this.$gsap,
        this.$el,
        this.$refs.scene,
        this.w,
        this.isTouch,
        this.isMobile,
        this.reducedMotion
      )

      this.$router.beforeEach((to, from, next) => {
        this.transitionPage.transition(to, from, next)
      })

      this.$router.afterEach((to, from) => {
        ScrollHelper.goTo(0)
        if (this.$refs.scene) {
          this.$refs.scene.changePage(from)
        }
      })
    },

    pageAnimateIn() {
      if (this.$route.name === 'index' && !this.isTouch) {
        if (!this.firstVisit) {
          this.$refs.page.$children[0].animateIn()
          return
        } else {
          return
        }
      }

      this.$refs.page.$children[0].animateIn()

      if (this.$route.path === '/projects') {
        this.$refs.scrollbar.animateIn()
        this.$refs.navigation.animateIn()
        this.$refs.footer.animateIn()
      }
      if (this.$route.path === '/about') {
        this.$refs.navigation.animateIn()
        this.$refs.footer.animateIn()
      }

      this.firstVisit = false
    },
  },
}
</script>

<style lang="scss">
.isScrolling * {
  user-select: none;
}

.is-touch {
  background: #e2e2e2;
}

.rotate {
  z-index: z('rotate');
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e2e2e2;
  display: none;
  font-size: 12px;
}

.no-touch .scene,
canvas {
  display: block !important;
}

.no-touch.isScrolling .scroll {
  /* will-change: transform; */
}

.layout {
  position: relative;
  /* overflow: hidden; */
  width: 100vw;
  /* min-height: 100vh; */
  height: 100%;

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

/* @include media('<phone') {
  @supports (-webkit-touch-callout: none) {
    .is-touch {
      overflow: hidden;
    }
  }
} */
</style>
