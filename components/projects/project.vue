<template>
  <div class="project-component">
    <div class="info-left">
      <p class="index">00{{ index + 1 }}</p>
    </div>
    <div class="canvas">
      <NuxtLink :to="`projects/${slug}`" class="plane"></NuxtLink>
      <div class="line"></div>
    </div>
    <NuxtLink :to="`projects/${slug}`" class="info-right">
      <p class="name">{{ name }}</p>
      <p class="date">{{ dateConverted }}</p>
    </NuxtLink>
  </div>
</template>

<script>
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  name: 'Project',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: 'name',
    },
    slug: {
      type: String,
      default: 'name',
    },
    date: {
      type: String,
      default: 'Janvier 2020',
    },
  },
  data() {
    return {
      scrollTop: 0,
      isShown: true,
    }
  },
  computed: {
    dateConverted() {
      const fullDate = new Date(this.date)
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      const year = fullDate.getFullYear()
      const month = fullDate.getMonth()

      return monthNames[month] + ' ' + year
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    tick(scrollTop) {
      this.scrollTop = scrollTop

      if (this.scrollTop > this.start) {
        if (!this.isShown) this.show()
      }
      if (this.scrollTop < this.start) {
        if (this.isShown) this.reset()
      }
    },
    resize(w, h) {
      const { top, height } = this.$el.getBoundingClientRect()
      this.start = this.scrollTop + top - h
      this.end = this.start + h + height

      this.topProjectEl = top
      this.pageHeight = h
    },
    show() {
      emitter.emit('PROJECT:SHOW', this.index)

      this.isShown = true
      const gsap = this.$gsap

      gsap.killTweensOf(this.els)
      gsap.to(this.$el, {
        scale: 1,
        translateY: 0,
        opacity: 1,
        force3D: true,
        ease: 'power2.out',
        delay: 0.7,
        duration: 2,
        onStart: (el) => {
          this.$el.style.willChange = 'transform, opacity'
        },
        onComplete: () => {
          this.$el.style.willChange = 'auto'
        },
      })
    },
    reset() {
      emitter.emit('PROJECT:RESET', this.index)

      this.isShown = false
      const gsap = this.$gsap

      gsap.killTweensOf(this.els)
      gsap.set(this.$el, { translateY: '0', scale: 1.1, opacity: 0 })
    },
  },
}
</script>

<style lang="scss">
.project-component {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-template-rows: repeat(2, max-content);
  margin-top: vw(30);

  .info-left {
    font-size: vw(24);

    margin-right: vw(40);
  }

  .canvas {
    height: vw(465);
    grid-column-start: 2;
    grid-row-start: 1;
    display: flex;

    .plane {
      height: 100%;
      width: vw(315);
      border: 1px solid $color-dark;
    }

    .line {
      margin-left: vw(14);
      height: 100%;
      width: 6px;

      background: $color-dark;
      opacity: 0.6;
    }
  }

  .info-right {
    grid-column-start: 3;
    grid-row-start: 2;

    margin-top: vw(30);
    margin-left: vw(10);

    text-transform: uppercase;

    p:nth-child(2) {
      margin-top: vw(6);
    }
  }
}
</style>
