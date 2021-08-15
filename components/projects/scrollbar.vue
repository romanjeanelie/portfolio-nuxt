<template>
  <div :class="[`scrollbar`, toggleScrollbar]">
    <div
      v-for="item in projects"
      :key="item"
      :style="{ height: heightSegment }"
      class="scrollbar__item"
    >
      <div ref="scrollbarItemActive" class="item__active"></div>
    </div>
  </div>
</template>

<script>
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  name: 'Scrollbar',
  props: {
    projects: {
      type: Number,
      default: 0,
    },
  },
  // data() {
  //   return { projectEls: document.querySelectorAll('.project-component') }
  // },
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
    emitter.addListener('PROJECT:SHOW', (projectIndex) =>
      this.animInItemScrollBar(projectIndex)
    )
  },

  methods: {
    tick(scrollTop) {
      this.scrollTop = scrollTop
      this.normalizedWheelPage = (this.scrollTop / this.pageHeight) % 1

      if (this.animUnroll) {
        this.animUnroll.progress(this.normalizedWheelPage)
      }
    },
    resize(w, h) {
      this.pageHeight = h
    },
    animInItemScrollBar(i) {
      console.log('animInItemScrollBar')
      const gsap = this.$gsap
      gsap.to(this.$refs.scrollbarItemActive[i], {
        transformOrigin: 'top',
        scaleY: 1,
        duration: 2,
        onComplete: () => {
          console.log(i, 'complete animInItemScrollBar')
          this.unrollItemScrollBar(i)
        },
      })
    },
    unrollItemScrollBar(i) {
      const gsap = this.$gsap
      this.animUnroll = gsap.to(this.$refs.scrollbarItemActive[i], {
        transformOrigin: 'bottom',

        scaleY: 0,
        duration: 6,
        paused: true,
      })
    },
  },
}
</script>

<style lang="scss">
.scrollbar {
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

    .item__active {
      background: $color-dark;
      width: 100%;
      height: 100%;

      transform-origin: bottom;
      transform: scaleY(0);
    }
  }
}
</style>
