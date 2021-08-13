<template>
  <div class="layout__container">
    <Navigation />
    <Nuxt ref="page" :key="$route.params.slug || $route.name" />
    <div class="main-line"></div>

    <!-- <div class="barre"></div> -->
    <CanvasTransition ref="transition" />
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TransitionPage from '../components/transitions/TransitionPage'
import ResizeHelper from '../assets/js/utils/ResizeHelper'
import emitter from '~/assets/js/events/EventsEmitter'
import CanvasTransition from '~/components/common/transition.vue'
import Navigation from '~/components/common/navigation.vue'
import Footer from '~/components/common/footer.vue'

export default {
  components: {
    CanvasTransition,
    Navigation,
    Footer,
  },
  data() {
    return {
      route: this.$route.name,
    }
  },
  computed: {
    ...mapGetters(['isTouch']),
  },
  mounted() {
    const gsap = this.$gsap
    gsap.ticker.add(this.tick.bind(this))
    console.log('start tick')

    this.setRouterHook()
    emitter.on('GLOBAL:RESIZE', this.onResize.bind(this))
    // emitter.on('PAGE:MOUNTED', this.onMounted.bind(this))
    if (this.isTouch) {
      document.querySelector('html').classList.add('is-touch')
    }
  },

  methods: {
    tick() {
      // this.$refs.transition.tick()
    },
    onResize() {
      console.log('resize layout')
      this.w = ResizeHelper.width()
      this.h = ResizeHelper.height()
      this.$refs.transition.resize(this.w, this.h)
    },
    setRouterHook() {
      const gsap = this.$gsap
      this.transitionPage = new TransitionPage(gsap)
      this.$router.beforeEach((to, from, next) => {
        console.log(from.name, to.name)
        this.transitionPage.transition(to, from, next)
      })
    },
    onMounted() {
      console.log('on mounted')
      this.onResize()
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
      if ('requestIdleCallback' in window) {
        requestIdleCallback(
          () => {
            this.$refs.transition.hideTransition()
          },
          {
            timeout: 500,
          }
        )
      } else {
        setTimeout(() => {
          this.$refs.transition.hideTransition()
        }, 100)
      }
      setTimeout(() => {
        this.onResize()
      }, 3000)
    },
  },
}
</script>

<style lang="scss">
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
