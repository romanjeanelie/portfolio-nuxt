<template>
  <div class="project">
    <div ref="projectTop" class="project__top">
      <NuxtLink to="/projects">Close</NuxtLink>
    </div>

    <div ref="barreImages" class="project__images__barre"></div>
    <div ref="projectImages" :if="project.images" class="project__images">
      <div
        v-for="(image, i) in project.images"
        ref="images"
        :key="image._key"
        class="image__container"
        @mouseenter="sliderMouseEnter(i)"
      >
        <SanityImage :asset-id="image.asset._ref" />
      </div>
    </div>

    <main class="project__main">
      <div class="project__left">
        <h1 ref="title" class="project__title">{{ project.title }}</h1>
        <div class="project__description__wrapper">
          <div class="project__description">
            <div v-for="(text, i) in texts" :key="i" ref="description">
              {{ text.line }}
            </div>
            <div class="link__wrapper">
              <a ref="link" :href="project.url" target="_blank"
                >Visit the website</a
              >
            </div>
          </div>
        </div>
      </div>

      <div class="project__right">
        <figure ref="figure">
          <SanityImage
            v-for="(image, i) in project.images"
            ref="imagesSlider"
            :key="image._key"
            :asset-id="image.asset._ref"
            :class="toggleSlider(i)"
          />
        </figure>

        <div v-if="isMobile" ref="sliderMobile" class="slider-mobile">
          <SanityImage
            v-for="(image, i) in project.images"
            ref="imagesSlider"
            :key="image._key"
            :asset-id="image.asset._ref"
            :class="toggleSlider(i)"
          />
        </div>

        <div class="details">
          <div ref="detailsAwards" class="awards">
            <p>{{ project.awwwards }}</p>
          </div>
          <div ref="detailsTech" class="tech">
            <p>{{ project.detailsCreation }}</p>
            <p>{{ project.detailsTech }}</p>
          </div>
        </div>
      </div>
    </main>

    <div ref="projectIndex" class="project__index">
      <p class="index">00{{ index + 1 }}</p>
    </div>

    <footer ref="projectFooter" class="project__footer">
      <NuxtLink v-if="prevSlug" :to="prevSlug" class="active"
        >Previous project</NuxtLink
      >
      <p v-else class="inactive">Previous project</p>

      <p>{{ dateConverted }}</p>

      <NuxtLink v-if="nextSlug" :to="nextSlug" :class="nextSlug ? 'active' : ''"
        >Next Project</NuxtLink
      >
      <p v-else class="inactive">Next project</p>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { groq } from '@nuxtjs/sanity'
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  async asyncData({ params, $sanity }) {
    const queryProjects = groq`*[_type == "projects"]| order(order asc)`
    const projects = await $sanity.fetch(queryProjects)

    // Get project from slug
    let project
    let index
    const nbProjects = projects.length
    projects.forEach((item, i) => {
      if (item.slug.current === params.slug) {
        project = item
        index = i
      }
    })

    // Block hand made
    const blocksText = project.description
    const texts = []
    blocksText.forEach((block) => {
      const line = block.children[0].text
      texts.push({
        line,
      })
    })

    return { projects, nbProjects, project, index, texts }
  },

  data() {
    return {
      indexSlider: 2,
      imagesPositions: [],
      prevSlug: null,
      nextSlug: null,
    }
  },
  head() {
    return {
      title: `${this.project.title} - Roman Jean-Elie`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Project created on ${this.dateConverted}`,
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['isTouch', 'isMobile']),
    dateConverted() {
      const fullDate = new Date(this.project.date)
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
    /* eslint-disable no-new */
    this.titleSplitted = new this.$SplitText(this.$refs.title, {
      type: 'lines',
      linesClass: 'sublineText',
    })
    new this.$SplitText(this.$refs.title, {
      type: 'lines',
      linesClass: 'lineText',
    })

    this.descriptionSplitted = new this.$SplitText(this.$refs.description, {
      type: 'lines',
      linesClass: 'sublineText',
    })

    this.linkSplitted = new this.$SplitText(this.$refs.link, {
      type: 'lines',
      linesClass: 'lineText',
    })

    this.detailsSplitted = new this.$SplitText(
      [this.$refs.detailsTech, this.$refs.detailsAwards],
      {
        type: 'lines',
        linesClass: 'sublineText',
      }
    )
    new this.$SplitText([this.$refs.detailsTech, this.$refs.detailsAwards], {
      type: 'lines',
      linesClass: 'lineText',
    })

    this.indexSplitted = new this.$SplitText(this.$refs.projectIndex, {
      type: 'chars',
      charsClass: 'chars',
    })

    this.reset()
    this.setPrevNextProject()

    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
      emitter.emit('GLOBAL:RESIZE')
    })
  },
  methods: {
    resize() {
      this.imagesPositions = []

      this.$refs.images.forEach((image) => {
        const x = image.getBoundingClientRect().x
        const y = image.getBoundingClientRect().y
        const width = image.getBoundingClientRect().width
        const height = image.getBoundingClientRect().height
        this.imagesPositions.push({ x, y, width, height })
      })

      this.$refs.barreImages.style.top = `${
        this.imagesPositions[this.indexSlider].y +
        this.imagesPositions[this.indexSlider].height +
        10
      }px`
      this.$refs.barreImages.style.left = `${
        this.imagesPositions[this.indexSlider].x
      }px`
      this.$refs.barreImages.style.width = `${
        this.imagesPositions[this.indexSlider].width
      }px`
    },
    setPrevNextProject() {
      if (this.projects[this.index + 1]) {
        this.nextSlug =
          '/projects/' + this.projects[this.index + 1].slug.current
      }
      if (this.projects[this.index - 1]) {
        this.prevSlug =
          '/projects/' + this.projects[this.index - 1].slug.current
      }
    },

    toggleSlider(i) {
      if (i === this.indexSlider) {
        return 'active'
      }
    },
    sliderMouseEnter(i) {
      const gsap = this.$gsap

      if (i > this.indexSlider) {
        const tl = gsap.timeline()
        gsap.set(this.$refs.barreImages, {
          transformOrigin: 'right',
        })
        tl.to(this.$refs.barreImages, {
          width: this.imagesPositions[i].width,
          left: this.imagesPositions[i].x,
          scaleX: 2,
        })
        tl.to(
          this.$refs.barreImages,
          {
            scaleX: 1,
            ease: 'power2.out',
          },
          '-=0.15'
        )
      }

      if (i < this.indexSlider) {
        const tl = gsap.timeline()
        gsap.set(this.$refs.barreImages, {
          transformOrigin: 'left',
        })
        tl.to(this.$refs.barreImages, {
          width: this.imagesPositions[i].width,
          left: this.imagesPositions[i].x,
          scaleX: 2,
        })
        tl.to(
          this.$refs.barreImages,
          {
            scaleX: 1,
            ease: 'power2.out',
          },
          '-=0.35'
        )
      }

      this.indexSlider = i
    },

    animateIn() {
      this.animateInBasic()
    },

    animateInBasic() {
      const tl = this.$gsap.timeline()

      tl.to('.project-barre', {
        scaleX: 0.01,
        // delay: 0.3,
        delay: 1,
        duration: 2,
        ease: 'expo.out',
        // onComplete: this.resize,
      })

      tl.set(
        '.project__index',
        {
          opacity: 0.1,
          onComplete: this.displayText,
        },
        '-=2.2'
      )

      if (this.isTouch && !this.isMobile) {
        tl.fromTo(
          this.$refs.figure,
          {
            scale: 0.9,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
          },
          '<'
        )
      }

      if (this.isMobile) {
        tl.to(
          this.$refs.sliderMobile,
          {
            y: 0,
            duration: 1,
          },
          '-=2'
        )
      }

      tl.to(
        this.$refs.images,
        {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          onComplete: this.resize,
        },
        '-=1'
      )

      tl.fromTo(
        this.$refs.projectTop,
        {
          y: -100,
        },
        {
          y: 0,
          duration: 1,
        },
        '-=1.5'
      )

      tl.fromTo(
        this.$refs.projectFooter,
        {
          y: 100,
        },
        {
          y: 0,
          duration: 1,
        },
        '-=1.5'
      )
      tl.to(
        this.$refs.barreImages,

        {
          scaleX: 1,
          duration: 0.7,
          ease: 'power2.out',
        }
      )
    },

    displayText() {
      const delayLinesText = 1

      if (!this.isTouch) {
        this.$gsap.to('.project__index .chars', {
          y: 0,
          stagger: 0.2,
          duration: 1,
        })
      }

      this.$gsap.to(
        this.titleSplitted.lines,

        {
          y: 0,
          duration: 1,
          delay: delayLinesText,
          stagger: 0.2,
        }
      )
      this.$gsap.to(
        this.descriptionSplitted.lines,

        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: delayLinesText,
          stagger: 0.2,
        }
      )
      this.$gsap.to(
        this.linkSplitted.lines,

        {
          y: 0,
          duration: 1,
          delay: delayLinesText,
          stagger: 0.2,
        }
      )
      this.$gsap.to(
        this.detailsSplitted.lines,

        {
          y: 0,
          duration: 1,
          delay: delayLinesText,
          stagger: 0.2,
        }
      )
    },

    reset() {
      const gsap = this.$gsap

      // Reset
      gsap.set('.project-barre', {
        width: '100vw',
        scaleX: 1,
        opacity: 1,
        transformOrigin: 'left',
      })
      gsap.set(this.$el, {
        opacity: 1,
      })
      gsap.set(this.$refs.figure, {
        opacity: 1,
      })

      gsap.set(this.titleSplitted.lines, {
        y: -100,
      })
      gsap.set(this.descriptionSplitted.lines, {
        opacity: 0,
        y: 30,
      })
      gsap.set(this.linkSplitted.lines, {
        y: -100,
      })
      gsap.set(this.detailsSplitted.lines, {
        y: -100,
      })
    },
  },
}
</script>

<style lang="scss">
.is-touch {
  .project {
    background: rgb(45, 45, 45);
    background: linear-gradient(-10deg, #151414 0%, #353434 100%);

    .project__footer {
      position: fixed;
      bottom: 0;
    }
  }
  .project__main {
    .project__right {
      figure {
        img {
          visibility: visible;
        }
      }
    }
  }
  .project__index {
    display: none;
    bottom: 0;
    z-index: 0;
  }
}

.project {
  opacity: 0;
  position: relative;
  width: 100vw;
  min-height: 100vh;
  color: $color-very-light;
}

.project__top {
  position: absolute;
  width: 100%;
  top: 0;
  padding: $padding-vert $padding-hor;

  text-transform: uppercase;

  a {
    transition: opacity 300ms ease;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
}

.project__images__barre {
  position: absolute;
  top: 20px;
  left: 0;
  width: 2px;
  height: 4px;
  background: $color-light;
  transform-origin: left;
  transform: scaleX(0);
}

.project__images {
  display: flex;
  position: absolute;
  top: $padding-vert;
  left: 50%;
  transform: translateX(-50%);

  .image__container {
    border: 1px solid rgba($color-light, 0.3);
    height: 100px;
    width: 200px;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    transform: translateY(-150%);

    cursor: pointer;

    &:not(:first-child) {
      margin-left: vw(60);
    }
    img {
      width: 100%;
    }
  }
}

.project__main {
  position: absolute;
  margin-top: vw(30);
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  .project__left {
    position: relative;
    display: flex;
    flex-direction: column;

    .project__title {
      overflow: hidden;
      text-transform: uppercase;
      font-size: vw(40);
      .lineText {
        overflow: hidden;
      }
    }

    .project__description__wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: vw(10);
    }
    .project__description {
      overflow: hidden;
      max-width: vw(310);
      text-transform: uppercase;
      line-height: 1.8;

      display: flex;
      flex-direction: column;
      .lineText {
        overflow: hidden;
      }

      .link__wrapper {
        margin-left: auto;
        /* align-self: end; */

        a {
          display: inline-block;
          height: vw(20);
          overflow: hidden;
          cursor: pointer;

          position: relative;
          text-align: right;
          margin-top: vw(70);

          &:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: vw(2);
            background: $color-light;
            transform-origin: left;
            transform: scaleX(0);
            transition: transform 700ms;
          }

          &:hover {
            &:before {
              transform: scaleX(1);
              transform-origin: right;
            }
          }
        }
      }
    }
  }
  .project__right {
    margin-left: vw(100);
    .slider-mobile {
      display: none;
    }
    figure {
      position: relative;
      width: vw(494);
      height: vw(300);
      overflow: hidden;
      box-shadow: 5px -1px 15px 0px rgba(0, 0, 0, 0.47);
      opacity: 0;
      img {
        visibility: hidden;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        height: 100%;
        transition: opacity 1s;

        &.active {
          opacity: 1;
        }
      }
    }
    .details {
      opacity: 0.5;
      font-size: vw(8);
      line-height: 1.5;

      text-align: right;
      margin-top: vw(5);
      text-transform: uppercase;
      overflow: hidden;

      display: flex;
      justify-content: space-between;

      .awards {
        p {
          text-align: left;
        }
      }

      .lineText {
        overflow: hidden;
      }
    }
  }
}

.project__index {
  z-index: -1;
  position: absolute;
  bottom: vw(10);
  left: 50%;
  transform: translateX(-110%);
  font-size: vw(200);
  opacity: 0;

  .chars {
    transform: translateY(-30%);
  }
}

.project__footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: $padding-vert $padding-hor;

  text-transform: uppercase;

  a {
    transition: opacity 300ms ease;

    &.active {
      opacity: 0.5;
    }

    &:hover {
      opacity: 1;
    }
  }

  p {
    opacity: 0.5;

    &.inactive {
      opacity: 0.1;
    }
  }
}

@include media('<phone') {
  $font-mobile: 12px;
  .project__top {
    z-index: 1;
    padding: 16px;
    opacity: 1;
    mix-blend-mode: luminosity;
    font-size: 12px;
  }
  .project__images__barre {
    display: none;
  }

  .project__images {
    display: none;
  }

  .project__main {
    margin-top: 0;
    min-height: 100vh;

    position: relative;
    transform: unset;
    top: unset;
    flex-direction: column-reverse;

    .project__left {
      flex: 1;
      display: flex;
      justify-content: center;
      margin-top: -10vh;
      padding: 0 20px;
      .project__title {
        font-size: 15px;
      }
      .project__description__wrapper {
        flex: unset;
        margin-top: 30px;
        justify-content: unset;
        font-size: $font-mobile;
        .project__description {
          max-width: unset;
          .lineText {
            margin-bottom: 6px;
          }
          .link__wrapper {
            margin-left: auto;

            a {
              height: 20px;
              margin-top: 35px;
              text-align: unset;
            }
          }
        }
      }
    }

    .project__right {
      margin-left: 0;
      figure {
        display: none;
      }
      .slider-mobile {
        display: block;
        overflow-y: hidden;

        scroll-snap-type: x mandatory;
        display: flex;
        transform: translateY(-100%);
        img {
          scroll-snap-align: center;
          width: 100vw;
          height: auto;
        }
      }
      .details {
        padding: 8px 16px;
        font-size: $font-mobile;
      }
    }
  }

  .project__index {
    bottom: 80px;
    left: unset;
    right: 30px;
    transform: unset;
    font-size: 90px;
  }

  .project__footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    font-size: $font-mobile;
    padding: 16px 16px;
  }
}
@supports (-webkit-touch-callout: none) {
  .is-touch {
    .project {
      min-height: stretch;
    }
  }
  .project__main {
    min-height: stretch;
  }
}
</style>
