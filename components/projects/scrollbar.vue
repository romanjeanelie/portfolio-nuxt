<template>
  <div :class="[`scrollbar`, toggleScrollbar]">
    <div
      v-for="item in projects"
      :key="item"
      :style="{ height: heightSegment }"
      class="scrollbar__item"
    >
      <div ref="scrollBarItemActiveWrapper" class="item__active__wrapper">
        <div ref="scrollbarItemActive" class="item__active"></div>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '~/assets/js/events/EventsEmitter'
// import clamp from '~/assets/js/math/clamp'

export default {
  name: 'Scrollbar',
  props: {
    projects: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return { projectInViewport: 0, projectShowed: 0 }
  },
  computed: {
    heightSegment() {
      const totalHeight = 85
      return `${totalHeight / this.projects}vh`
    },
    toggleScrollbar() {
      if (this.$route.path === '/projects') {
        return 'active'
      } else {
        return ''
      }
    },
  },
  mounted() {
    emitter.addListener('PROJECT:SHOW', (projectIndex) => {
      console.log('PROJECT:SHOW', projectIndex)
      this.animInItemScrollBar(projectIndex)
    })
    emitter.addListener('PROJECT:RESET', (projectIndex) => {
      console.log('PROJECT:RESET', projectIndex)
      this.animOutItemScrollBar(projectIndex)
    })
    this.unrollItemScrollBar(0)
    this.animInItemScrollBar(0)
  },

  methods: {
    tick(scrollTop) {
      this.scrollTop = scrollTop
      this.wheelPage = this.scrollTop / this.pageHeight
      this.flooredWheelPage = Math.floor(this.wheelPage)

      this.normalizedWheelPage =
        this.scrollTop / this.pageHeight - this.projectInViewport

      if (this.animUnroll) {
        this.animUnroll.progress(this.normalizedWheelPage)
      }
      if (this.animRoll) {
        this.animUnroll.progress(this.normalizedWheelPage)
      }

      // Display next scroll bar
      if (this.projectInViewport < this.flooredWheelPage) {
        this.projectInViewport = this.flooredWheelPage
        console.log('///////////////// next scroll', this.projectInViewport)
        this.unrollItemScrollBar(this.projectInViewport)
      }
      // Display previous scroll bar
      if (this.projectInViewport > this.flooredWheelPage) {
        this.projectInViewport = this.flooredWheelPage
        console.log('///////////////// previous scroll', this.projectInViewport)
        this.rollItemScrollBar(this.projectInViewport)
      }
      // // Display previous scroll bar
      // if (this.flooredWheelPage === 0) {
      //   this.projectInViewport = this.flooredWheelPage
      //   console.log('///////////////// previous scroll', this.projectInViewport)
      //   this.unrollItemScrollBar(this.projectInViewport)
      // }
    },
    resize(w, h) {
      this.pageHeight = h
    },
    animInItemScrollBar(i) {
      console.log('animInItemScrollBar')
      const gsap = this.$gsap
      gsap.to(this.$refs.scrollBarItemActiveWrapper[i], {
        transformOrigin: 'top',
        scaleY: 1,
        duration: 2,
      })
    },
    animOutItemScrollBar(i) {
      console.log('animOutItemScrollBar')
      const gsap = this.$gsap
      gsap.to(this.$refs.scrollBarItemActiveWrapper[i], {
        transformOrigin: 'top',
        scaleY: 0,
        duration: 2,
      })
    },
    unrollItemScrollBar(i) {
      console.log('**** unroll', i)
      const gsap = this.$gsap
      gsap.killTweensOf(this.$refs.scrollbarItemActive)
      this.animUnroll = gsap.to(this.$refs.scrollbarItemActive[i], {
        transformOrigin: 'bottom',
        scaleY: 0,
        duration: 6,
        paused: true,
      })
    },
    rollItemScrollBar(i) {
      console.log('**** roll', i)
      const gsap = this.$gsap
      gsap.killTweensOf(this.$refs.scrollbarItemActive)
      this.animRoll = gsap.to(this.$refs.scrollBarItemActiveWrapper[i], {
        transformOrigin: 'top',
        scaleY: 1,
        duration: 6,
        paused: true,
      })
    },
  },
}
</script>

<style lang="scss">
.scrollbar {
  z-index: z('scrollbar');

  position: fixed;
  top: vw(70);
  left: $padding-hor;
  width: 5px;
  height: 85vh;

  display: none;
  flex-direction: column;

  &.active {
    display: flex;
  }

  .scrollbar__item {
    background: rgba($color-dark, 0.2);
    &:not(:first-child) {
      margin-top: vw(10);
    }

    .item__active__wrapper {
      width: 100%;
      height: 100%;
      transform-origin: top;
      transform: scaleY(0);

      .item__active {
        background: $color-dark;
        width: 100%;
        height: 100%;

        transform-origin: bottom;
        transform: scaleY(1);
      }
    }
  }
}
</style>
