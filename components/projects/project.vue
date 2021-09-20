<template>
  <div class="project-component">
    <div class="canvas">
      <div ref="lineWrapper" class="line__wrapper">
        <div ref="line" class="line"></div>
      </div>
      <NuxtLink :to="`projects/${slug}`" class="plane">
        <SanityImage
          ref="image"
          class="image"
          :asset-id="mainImage.asset._ref"
          :class="isTouch && 'active'"
          @load="checkImgLoad"
        />
      </NuxtLink>
    </div>
    <div class="info-left">
      <p ref="index" class="index">00{{ index + 1 }}</p>
    </div>
    <NuxtLink :to="`projects/${slug}`" class="info-right">
      <p ref="name" class="name">{{ name }}</p>
      <p ref="date" class="date">{{ dateConverted }}</p>
    </NuxtLink>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      default: '',
    },
    slug: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: 'Janvier 2020',
    },
    mainImage: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      scrollTop: 0,
      imageLoaded: false,
      isCreated: false,
      isShown: true,
      lineAnimated: false,
    }
  },
  computed: {
    ...mapGetters(['isMobile', 'isTouch']),
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
  updated() {
    console.log('updated')
  },
  methods: {
    checkImgLoad() {
      this.imageLoaded = true
      console.log('image loaded')
      if (this.isTouch && this.imageLoaded && this.index === 0) {
        this.showFromMobile()
      }
    },
    init() {
      console.log('init project')
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

      console.log('created')

      this.isCreated = true
    },
    tick(scrollTop) {
      if (this.isMobile) return

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
      if (!this.lineAnimated) return
      const gsap = this.$gsap
      const scaleLine = 4 * (this.pageWidth / 100)

      gsap.set(this.$refs.lineWrapper, {
        scaleX: scaleLine,
      })

      gsap.set(this.$refs.line, {
        scaleX: 0.014,
      })
    },
    /**
     * Mobile
     */
    showFromMobile() {
      if (!this.$refs.image) return
      console.log('show from mobile', this.index)
      this.isShown = true
      const gsap = this.$gsap

      emitter.emit('PROJECT:SHOW', this.index)
      emitter.emit('PROJECT:DISPLAY-MOBILE', this.index)

      /**
       * Animation Text Project
       */
      gsap.fromTo(
        this.indexSplitted.lines,
        {
          yPercent: -200,
        },
        {
          yPercent: 0,
          duration: 2,
        }
      )
      gsap.fromTo(
        [this.nameSplitted.lines, this.dateSplitted.lines],
        {
          yPercent: 200,
        },
        {
          yPercent: 0,
          duration: 2,
        }
      )

      /**
       * Animation Image
       */
      gsap.to(this.$refs.image.$el, {
        opacity: 1,
        duration: 1,
      })
    },
    hideFomMobile() {
      const gsap = this.$gsap

      emitter.emit('PROJECT:HIDE-MOBILE', this.index)

      /**
       * Animation Text Project
       */
      gsap.to(this.indexSplitted.lines, {
        yPercent: -200,
      })
      gsap.to([this.nameSplitted.lines, this.dateSplitted.lines], {
        yPercent: 200,
      })

      /**
       * Animation Image
       */
      gsap.to(this.$refs.image.$el, {
        opacity: 0,
        duration: 1,
      })
    },

    showFromSlugPage() {
      /**
       * Animation Line Project from slug page
       */
      const gsap = this.$gsap
      const scaleLine = 4 * (this.pageWidth / 100)

      gsap.set(this.$refs.lineWrapper, {
        scaleY: 1,
      })
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
          scaleY: 0,
          scaleX: 0.014,
        }
      )
      gsap.to(
        this.$refs.line,

        {
          scaleY: 1,
          duration: 1,
          ease: 'power2.out',
        }
      )
    },
    show() {
      this.isShown = true
      const gsap = this.$gsap
      gsap.killTweensOf(this.els)
      const tl = gsap.timeline()

      /**
       * Animation Line Project
       */
      if (
        this.index !== 0 ||
        this.previousPage !== 'projects-slug' ||
        this.isTouch
      ) {
        emitter.emit('PROJECT:SHOW', this.index)

        const scaleLine = 4 * (this.pageWidth / 100)

        tl.to(
          this.$refs.lineWrapper,

          {
            scaleY: 1,
            delay: 0.4,
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
              if (this.isTouch) {
                this.$refs.image.$el.style.opacity = 1
              }
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
              this.lineAnimated = true
            },
          }
        )
      }

      if (
        this.previousPage === 'projects-slug' &&
        this.index === 0 &&
        !this.isTouch
      ) {
        this.showFromSlugPage()
      }

      /**
       * Animation Text Project
       */
      gsap.fromTo(
        this.indexSplitted.lines,
        {
          yPercent: -200,
        },
        {
          yPercent: 0,
          delay: 1,
          duration: 1,
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
          duration: 1,
          delay: 1,
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
    grid-column-start: 1;
    grid-row-start: 1;
    margin-right: vw(40);
    font-size: vw(24);

    .index {
      overflow: hidden;
      opacity: 1;
    }
  }

  .canvas {
    height: vw(442);
    grid-column-start: 2;
    grid-row-start: 1;
    display: flex;

    .plane {
      height: 100%;
      width: vw(315);

      .image {
        opacity: 0;
        visibility: hidden;
        width: 100%;
        height: auto;

        &.active {
          visibility: visible;
        }
      }
    }

    .line__wrapper {
      /* border: 1px solid salmon; */
      height: 100%;
      transform-origin: top left;
      transform: scaleX(1) scaleY(0) translateZ(0);
      position: relative;
      width: 6px;
      pointer-events: none;
      /* backface-visibility: hidden;
      -webkit-font-smoothing: subpixel-antialiased; */
      will-change: transform;

      .line {
        will-change: transform;

        /* display: none; */
        position: absolute;
        height: 100%;
        width: 100%;
        transform-origin: right top;

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

@include media('<phone') {
  .line__wrapper {
    display: none;
  }
  .project-component {
    display: grid;
    grid-template-columns: repeat(2, 50vw);
    grid-template-rows: repeat(2, max-content);

    .canvas {
      grid-column: 1 / span 2;
      grid-row-start: 1;
      height: 60vh;

      .plane {
        height: 100%;
        width: 100vw;
        overflow: hidden;
        .image {
          transform: translateY(-10%);
        }
      }
    }

    .info-left {
      font-size: vwM(14);
      margin: 16px 0 0 16px;
      margin-right: 0;
      grid-column-start: 1;
      grid-row-start: 2;
    }
    .info-right {
      margin-top: 0;
      margin-left: 0;
      margin: 16px 16px 0 0;
      grid-column-start: 2;
      grid-row-start: 2;
      .lineText {
        text-align: right !important;
      }
    }
  }
}
</style>
