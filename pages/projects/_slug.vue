<template>
  <div class="project">
    <div class="slider">
      <div class="slider__image"></div>
      <div class="slider__controls">
        <button id="slider-close" class="close">
          <close />
        </button>
        <button id="slider-left" class="left">
          <left />
        </button>
        <button id="slider-right" class="right">
          <right />
        </button>
      </div>
    </div>

    <div class="project__wrapper">
      <div ref="projectTop" class="project__top">
        <NuxtLink to="/projects">Close</NuxtLink>
      </div>
      <div :if="project.images" class="project__images">
        <div
          v-for="image in project.images"
          ref="images"
          :key="image._key"
          class="image__container"
        >
          <SanityImage :asset-id="image.asset._ref" />
        </div>
      </div>
      <h1 ref="title" class="project__title">{{ project.title }}</h1>
      <div class="project__description">
        <p ref="description">{{ project.description }}</p>
        <a ref="link" :href="project.url" target="_blank">Visit the website</a>
      </div>

      <footer ref="projectFooter" class="project__footer">
        <a href="#">Previous project</a>
        <p class="index">00{{ index + 1 }}</p>
        <a href="#">Next Project</a>
      </footer>
    </div>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import emitter from '~/assets/js/events/EventsEmitter'
import close from '~/components/common/buttons/close'
import left from '~/components/common/buttons/left'
import right from '~/components/common/buttons/right'
export default {
  components: {
    close,
    left,
    right,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm._data.animationFrom = from.name
    })
  },
  async asyncData({ params, $sanity }) {
    const queryProjects = groq`*[_type == "projects"]| order(order asc)`
    const projects = await $sanity.fetch(queryProjects)
    let project
    let index
    projects.forEach((item, i) => {
      if (item.slug.current === params.slug) {
        project = item
        index = i
      }
    })

    return { project, index }
  },

  data() {
    return {
      animationFrom: null,
    }
  },
  mounted() {
    /* eslint-disable no-new */
    new this.$SplitText(this.$refs.title, {
      type: 'lines',
      linesClass: 'sublineText',
    })
    new this.$SplitText(this.$refs.title, {
      type: 'lines',
      linesClass: 'lineText',
    })
    new this.$SplitText(this.$refs.description, {
      type: 'lines',
      linesClass: 'sublineText',
    })
    new this.$SplitText(this.$refs.description, {
      type: 'lines',
      linesClass: 'lineText',
    })
    new this.$SplitText(this.$refs.link, {
      type: 'lines',
      linesClass: 'lineText',
    })

    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
      emitter.emit('GLOBAL:RESIZE')
    })
  },
  methods: {
    animateIn() {
      this.animateInBasic()
    },
    animateInBasic() {
      // const tl = this.$gsap.timeline()

      this.$gsap.fromTo(
        '.project__title .sublineText',
        {
          y: '-10vw',
        },
        {
          y: 0,
          duration: 1,
          delay: 1,
          stagger: 0.2,
        }
      )
      this.$gsap.fromTo(
        '.project__description p .sublineText',
        {
          y: '-4vw',
        },
        {
          y: 0,
          duration: 1,
          delay: 1,
          stagger: 0.2,
        }
      )
      this.$gsap.fromTo(
        '.project__description a .lineText',
        {
          y: '-2vw',
        },
        {
          y: 0,
          duration: 1,
          delay: 1,
          stagger: 0.2,
        }
      )

      // this.$gsap.to(
      //   this.$refs.images,

      //   {
      //     y: 0,
      //     duration: 1,
      //     delay: 1,
      //     stagger: 0.2,
      //   }
      // )

      this.$gsap.fromTo(
        this.$refs.projectTop,
        {
          y: '-3vw',
        },
        {
          y: 0,
          duration: 1,
          delay: 2,
          stagger: 0.2,
        }
      )
      this.$gsap.fromTo(
        this.$refs.projectFooter,
        {
          y: '3vw',
        },
        {
          y: 0,
          duration: 1,
          delay: 2,
          stagger: 0.2,
        }
      )
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

  /* background: linear-gradient(
    -90deg,
    rgba(8, 8, 8, 1) 0%,
    rgba(54, 52, 52, 1) 100%
  ); */
  color: $color-very-light;
}

.slider {
  $margin: vw(30);
  position: fixed;
  width: 100vw;
  height: 100vh;
  .slider__image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 80%;
    height: 80%;
  }
  .slider__controls {
    opacity: 0;
    button {
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;

      pointer-events: none;
    }
    svg {
      width: 100%;
      height: auto;
    }

    .close,
    .left,
    .right {
      width: vw(30);
      position: absolute;
    }
    .close {
      top: $margin;
      left: 50%;
      transform: translateX(-50%);
    }

    .left {
      left: $margin;
      top: 50%;
      transform: translateY(-50%);
    }

    .right {
      right: $margin;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.project__top {
  position: absolute;
  width: 100%;
  top: 0;
  padding: $padding-vert $padding-hor;
  opacity: 0.5;

  text-transform: uppercase;
}

.project__title {
  overflow: hidden;
  .lineText {
    overflow: hidden;
  }
  text-transform: uppercase;
  font-size: vw(100);
  word-spacing: 100vw;
  line-height: 1;

  position: absolute;
  top: 50%;
  left: vw(70);
  transform: translateY(-60%);
}

.project__description {
  overflow: hidden;
  .lineText {
    overflow: hidden;
  }
  position: absolute;
  top: 50%;
  right: vw(160);
  transform: translateY(-40%);
  width: vw(300);

  text-transform: uppercase;
  line-height: 1.8;

  a {
    overflow: hidden;
    cursor: pointer;
    display: block;
    text-align: right;
    margin-top: vw(70);
  }
}

.project__images {
  display: flex;
  position: absolute;
  top: $padding-vert;
  left: 50%;
  transform: translateX(-50%);

  .image__container {
    border: 1px solid rgba($color-light, 0.5);
    height: 100px;
    width: 200px;
    margin: 0 vw(30);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    cursor: pointer;
    img {
      height: 100%;
    }
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
    opacity: 0.5;
    transition: opacity 300ms ease;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
