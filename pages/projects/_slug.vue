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
            <p ref="description">{{ project.description }}</p>
            <a ref="link" :href="project.url" target="_blank"
              >Visit the website</a
            >
          </div>
        </div>
      </div>

      <div class="project__right">
        <figure>
          <SanityImage
            v-for="(image, i) in project.images"
            ref="imagesSlider"
            :key="image._key"
            :asset-id="image.asset._ref"
            :class="toggleSlider(i)"
          />
        </figure>
        <div ref="details" class="details">
          <p>design / development / video editing</p>
          <p>Three js</p>
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
import { groq } from '@nuxtjs/sanity'
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  async asyncData({ params, $sanity }) {
    const queryProjects = groq`*[_type == "projects"]| order(order asc)`
    const projects = await $sanity.fetch(queryProjects)
    let project
    let index
    const nbProjects = projects.length
    projects.forEach((item, i) => {
      if (item.slug.current === params.slug) {
        project = item
        index = i
      }
    })

    return { projects, nbProjects, project, index }
  },

  data() {
    return {
      indexSlider: 2,
      imagesPositions: [],
      prevSlug: null,
      nextSlug: null,
    }
  },
  computed: {
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
    new this.$SplitText(this.$refs.description, {
      type: 'lines',
      linesClass: 'lineText',
    })
    this.linkSplitted = new this.$SplitText(this.$refs.link, {
      type: 'lines',
      linesClass: 'lineText',
    })
    this.detailsSplitted = new this.$SplitText(this.$refs.details, {
      type: 'lines',
      linesClass: 'sublineText',
    })
    new this.$SplitText(this.$refs.details, {
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
            ease: 'power2.inOut',
          },
          '-=0.35'
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
            ease: 'power2.inOut',
          },
          '-=0.35'
        )
      }

      // this.$refs.barreImages.style.width = `${this.imagesPositions[i].width}px`
      // this.$refs.barreImages.style.left = `${this.imagesPositions[i].x}px`

      this.indexSlider = i
    },

    animateIn() {
      this.animateInBasic()
    },

    animateInBasic() {
      const tl = this.$gsap.timeline()

      tl.to('.project-barre', {
        scaleX: 0.01,
        delay: 0.3,
        duration: 2,
        ease: 'expo.out',
      })

      tl.set(
        '.project__index',
        {
          opacity: 0.1,
          onComplete: this.displayText,
        },
        '<'
      )

      tl.to(
        this.$refs.images,
        {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          onComplete: this.resize,
        },
        '-=0.3'
      )

      tl.to(
        this.$refs.barreImages,

        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
        }
      )

      tl.fromTo(
        this.$refs.projectTop,
        {
          y: '-3vw',
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
          y: '3vw',
        },
        {
          y: 0,
          duration: 1,
        },
        '-=1.5'
      )
    },

    displayText() {
      const delayLinesText = 1

      this.$gsap.to('.project__index .chars', {
        y: 0,
        stagger: 0.2,
        duration: 1,
      })

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
        transformOrigin: 'left',
      })

      gsap.set(this.titleSplitted.lines, {
        y: '-10vw',
      })
      gsap.set(this.descriptionSplitted.lines, {
        y: '-4vw',
      })
      gsap.set(this.linkSplitted.lines, {
        y: '-2vw',
      })
      gsap.set(this.detailsSplitted.lines, {
        y: '-2vw',
      })
    },
  },
}
</script>

<style lang="scss">
.is-touch .project {
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
}

.project {
  opacity: 1;
  width: 100vw;
  min-height: 100vh;
  position: relative;
  color: $color-very-light;
}

.project__top {
  position: absolute;
  width: 100%;
  top: 0;
  padding: $padding-vert $padding-hor;
  opacity: 0.5;

  text-transform: uppercase;
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
      max-width: vw(300);
      text-transform: uppercase;
      line-height: 1.8;
      .lineText {
        overflow: hidden;
      }

      a {
        overflow: hidden;
        cursor: pointer;
        display: block;
        text-align: right;
        margin-top: vw(70);
      }
    }
  }
  .project__right {
    margin-left: vw(100);
    figure {
      position: relative;
      width: vw(500);
      height: vw(300);
      overflow: hidden;
      border: 1px solid grey;
      /* background: #000; */
      img {
        visibility: hidden;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        height: 100%;

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
</style>
