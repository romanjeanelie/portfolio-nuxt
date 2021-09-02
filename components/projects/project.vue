<template>
  <div class="project-component">
    <div class="info-left">
      <p ref="index" class="index">00{{ index + 1 }}</p>
    </div>
    <div class="canvas">
      <div ref="lineWrapper" class="line__wrapper">
        <div ref="line" class="line"></div>
      </div>
      <NuxtLink :to="`projects/${slug}`" class="plane"></NuxtLink>
    </div>
    <NuxtLink :to="`projects/${slug}`" class="info-right">
      <p ref="name" class="name">{{ name }}</p>
      <p ref="date" class="date">{{ dateConverted }}</p>
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
    previousPage: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      scrollTop: 0,
      activeShow: false,
      isShown: true,
      animateIn: false,
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

  mounted() {},
  methods: {
    init() {
      /* eslint-disable no-new */
      this.indexSplitted = new this.$SplitText(this.$refs.index, {
        type: 'lines',
        linesClass: 'lineText',
      })
      this.nameSplitted = new this.$SplitText(this.$refs.name, {
        type: 'lines',
        linesClass: 'lineText',
      })
      this.dateSplitted = new this.$SplitText(this.$refs.date, {
        type: 'lines',
        linesClass: 'lineText',
      })
      this.reset()
    },
    tick(scrollTop) {
      this.scrollTop = scrollTop
      if (this.scrollTop > this.start) {
        if (!this.isShown) {
          this.show()
        }
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
      this.pageWidth = w

      this.resizeLine()
    },
    resizeLine() {
      if (!this.animateIn) return

      const gsap = this.$gsap
      const scaleLine = 4 * (this.pageWidth / 100)

      gsap.set(this.$refs.lineWrapper, {
        scaleX: scaleLine,
      })

      gsap.set(this.$refs.line, {
        scaleX: 0.014,
      })
    },
    showFromSlugPage() {
      const gsap = this.$gsap
      const scaleLine = 4 * (this.pageWidth / 100)

      gsap.set(
        this.$refs.lineWrapper,

        {
          scaleY: 1,
        }
      )
      gsap.set(
        this.$refs.lineWrapper,

        {
          scaleX: scaleLine,
          onComplete: () => {
            emitter.emit('PROJECT:DISPLAY', this.index)
          },
        }
      )

      gsap.set(
        this.$refs.line,

        {
          scaleX: 0,
        }
      )
      gsap.to(
        this.$refs.line,

        {
          scaleX: 0.014,
        }
      )
    },
    show() {
      this.isShown = true
      const gsap = this.$gsap
      gsap.killTweensOf(this.els)
      const tl = gsap.timeline()

      if (this.index !== 0 || this.previousPage !== 'projects-slug') {
        emitter.emit('PROJECT:SHOW', this.index)

        const scaleLine = 4 * (this.pageWidth / 100)

        tl.to(
          this.$refs.lineWrapper,

          {
            scaleY: 1,
            duration: 0.5,
            ease: 'power2.out',
          }
        )
        tl.to(
          this.$refs.lineWrapper,

          {
            scaleX: scaleLine,
            duration: 0.5,
            onComplete: () => {
              emitter.emit('PROJECT:DISPLAY', this.index)
            },
          }
        )

        tl.to(
          this.$refs.line,

          {
            scaleX: 0.014,
            duration: 2,
            ease: 'expo.out',
            onComplete: () => {
              this.animateIn = true
            },
          }
        )
      }

      if (this.previousPage === 'projects-slug' && this.index === 0) {
        this.showFromSlugPage()
      }

      gsap.fromTo(
        this.indexSplitted.lines,
        {
          yPercent: -200,
        },
        {
          yPercent: 0,
          duration: 2,
        },
        '<'
      )
      gsap.fromTo(
        [this.nameSplitted.lines, this.dateSplitted.lines],
        {
          yPercent: 200,
        },
        {
          yPercent: 0,
          duration: 2,
          delay: 1,
          ease: 'expo.out',
        },
        '<'
      )
    },

    reset() {
      emitter.emit('PROJECT:RESET', this.index)

      this.isShown = false
      const gsap = this.$gsap

      if (!this.nameSplitted || !this.dateSplitted || !this.indexSplitted)
        return

      gsap.killTweensOf([
        this.$refs.line,
        this.indexSplitted.lines,
        this.nameSplitted.lines,
        this.dateSplitted.lines,
      ])

      gsap.set(this.indexSplitted.lines, {
        yPercent: -200,
      })

      gsap.set([[this.nameSplitted.lines, this.dateSplitted.lines]], {
        yPercent: -200,
      })

      gsap.set(this.$refs.line, {
        scaleX: 1,
      })
      gsap.set(this.$refs.lineWrapper, {
        scaleY: 0,
      })
      gsap.set(this.$refs.lineWrapper, {
        scaleX: 1,
      })

      gsap.set(this.$el, {
        opacity: 1,
      })
    },
  },
}
</script>

<style lang="scss">
.project-component {
  opacity: 0;
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-template-rows: repeat(2, max-content);
  margin-top: vw(30);

  .info-left {
    font-size: vw(24);

    margin-right: vw(40);

    .index {
      overflow: hidden;
      opacity: 1;
    }
  }

  .canvas {
    height: vw(465);
    grid-column-start: 2;
    grid-row-start: 1;
    display: flex;

    .plane {
      height: 100%;
      width: vw(315);
    }

    .line__wrapper {
      height: 100%;
      transform-origin: top left;
      transform: scaleX(1) scaleY(0);
      position: relative;
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
  }

  .info-right {
    grid-column-start: 3;
    grid-row-start: 2;

    margin-top: vw(30);
    margin-left: vw(10);

    text-transform: uppercase;

    p {
      overflow: hidden;
    }

    p:nth-child(2) {
      margin-top: vw(6);
    }
  }
}
</style>
