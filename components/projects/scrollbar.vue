<template>
  <div ref="scrollbar" class="scrollbar">
    <div
      v-for="item in projects"
      :key="item"
      :style="{ height: heightSegment }"
      class="scrollbar__part"
    >
      <div ref="scrollBarItemWrapper" class="scrollbar__part__wrapper">
        <div ref="scrollbarItem" class="scrollbar__item"></div>
      </div>
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

  data() {
    return { projectInViewport: 0, projectShowed: 0, animUnrollItems: [] }
  },
  computed: {
    heightSegment() {
      const totalHeight = 85

      return `${totalHeight / this.projects}vh`
    },
  },

  mounted() {
    console.log('scrollbar mounted')
  },

  methods: {
    tick(scrollTop) {
      this.scrollTop = scrollTop
      this.wheelPage = this.scrollTop / this.pageHeight
      this.flooredWheelPage = Math.floor(this.wheelPage)

      this.normalizedWheelPage =
        this.scrollTop / this.pageHeight - this.projectInViewport

      this.animUnrollItems.forEach((anim, i) => {
        anim.progress(this.wheelPage - i)
      })
    },

    resize(w, h) {
      this.pageHeight = h
    },

    animateIn() {
      const gsap = this.$gsap
      const tl = gsap.timeline()

      tl.to(this.$refs.scrollbar, {
        x: 0,
        delay: 0,
        duration: 1.5,
        ease: 'power2.out',
      })

      tl.add(() => {
        this.animInItemScrollBar(0)
        emitter.addListener('PROJECT:SHOW', (projectIndex) => {
          this.animInItemScrollBar(projectIndex)
        })
        emitter.addListener('PROJECT:RESET', (projectIndex) => {
          this.animOutItemScrollBar(projectIndex)
        })

        this.$refs.scrollbarItem.forEach((item) => {
          this.unrollItemScrollBar(item)
        })
      })
    },

    animInItemScrollBar(i) {
      const gsap = this.$gsap
      gsap.to(this.$refs.scrollBarItemWrapper[i], {
        transformOrigin: 'top',
        scaleY: 1,
        duration: 2,
      })
    },

    animOutItemScrollBar(i) {
      const gsap = this.$gsap
      gsap.to(this.$refs.scrollBarItemWrapper[i], {
        transformOrigin: 'top',
        scaleY: 0,
        duration: 2,
      })
    },

    unrollItemScrollBar(item) {
      const gsap = this.$gsap
      const animUnroll = gsap.to(item, {
        transformOrigin: 'bottom',
        scaleY: 0,
        duration: 6,
        paused: true,
      })
      this.animUnrollItems.push(animUnroll)
    },
  },
}
</script>

<style lang="scss">
.scrollbar {
  z-index: z('scrollbar');

  transform: translateX(-7vw);

  position: fixed;
  top: vw(70);
  left: $padding-hor;
  width: 5px;
  height: 85vh;

  display: flex;
  flex-direction: column;

  .scrollbar__part {
    background: rgba($color-dark, 0.2);
    &:not(:first-child) {
      margin-top: vw(10);
    }

    .scrollbar__part__wrapper {
      width: 100%;
      height: 100%;
      transform-origin: top;
      transform: scaleY(0);

      .scrollbar__item {
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
