<template>
  <main
    :class="[
      `layout`,
      { 'no-touch': !isTouch },
      { 'is-mobile': isMobile },
      { 'is-touch': isTouch },
      { isScrolling },
    ]"
  >
    <ProjectBarre ref="projectBarre" />
    <!-- <Scene ref="scene" /> -->
    <Navigation ref="navigation" />
    <Scrollbar ref="scrollbar" :projects="3" />

    <div ref="scroll" class="scroll">
      <Nuxt ref="page" :key="$route.params.slug || $route.name" />
    </div>
    <div class="main-line"></div>

    <Footer ref="footer" />
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import transform from 'dom-transform'
import MouseHelper from '../assets/js/utils/MouseHelper'
import ResizeHelper from '../assets/js/utils/ResizeHelper'
import ScrollHelper from '~/assets/js/utils/ScrollHelper'
import TransitionPage from '~/assets/js/transitions/TransitionPage'
import WheelHelper from '~/assets/js/utils/WheelHelper'

import emitter from '~/assets/js/events/EventsEmitter'
import Scrollbar from '~/components/projects/scrollbar.vue'
import Navigation from '~/components/common/navigation.vue'
import ProjectBarre from '~/components/common/projectBarre.vue'
import Footer from '~/components/common/footer.vue'
// import Scene from '~/components/scene/scene.vue'

export default {
  components: {
    Navigation,
    Scrollbar,
    ProjectBarre,
    Footer,
    // Scene,
  },

  data() {
    return {
      route: this.$route.name,
      scrollTop: 0,
      isScrolling: false,
      showScrollbar: false,
      canvasIsLoaded: false,
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
    ...mapGetters(['isTouch']),
  },
  mounted() {
    this.checkMobile()
    emitter.on('GLOBAL:RESIZE', this.resize.bind(this))
    emitter.on('PAGE:MOUNTED', () => {
      // Test without canvas  ////////////////////
      this.resize()
      this.pageAnimateIn()
      // Test without canvas  ////////////////////
      if (this.canvasIsLoaded) {
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
    // this.setRouterHook()
    if (this.isTouch) {
      document.querySelector('html').classList.add('is-touch')
    }
  },

  methods: {
    ...mapActions(['checkMobile']),
    tick() {
      if (!this.w) return
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
      if (this.$refs.scene && this.$refs.scene.tick) {
        this.$refs.scene.tick(scrollTop)
      }
    },
    resize() {
      ScrollHelper.resetScroll(0)

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

    setRouterHook() {
      this.transitionPage = new TransitionPage(
        this.$gsap,
        this.$el,
        this.$refs.scene,
        this.w
      )

      this.$router.beforeEach((to, from, next) => {
        this.transitionPage.transition(to, from, next)
      })

      this.$router.afterEach((to, from) => {
        ScrollHelper.goTo(0)
        this.$refs.scene.changePage(from)
      })
    },
    pageAnimateIn() {
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
  /* overflow: hidden; */
  width: 100vw;
  min-height: 100vh;
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
</style>
