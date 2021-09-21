<template>
  <div class="about">
    <div class="about__wrapper">
      <h1 ref="name" class="about__name">{{ about.name }}</h1>

      <section ref="presentation" class="about__presentation">
        <div
          v-for="(text, i) in texts"
          :key="i"
          ref="presentationEls"
          class="about__presentation-els"
        >
          {{ text.line }}
          <p v-if="text.subLine" class="strong">
            {{ text.subLine }}
            <span ref="lineHover" class="line-hover"></span>
          </p>
          {{ text.line2 && text.line2 }}
        </div>
      </section>

      <div class="about__socials">
        <ul>
          <li>
            <a href="mailto:contact@romanjeanelie.com">Email</a>
          </li>
          <li>
            <a href="https://www.instagram.com/_romanjeanelie/" target="_blank"
              >Instagram</a
            >
          </li>
          <li>
            <a href="https://twitter.com/romanjeanelie" target="_blank"
              >Twitter</a
            >
          </li>
        </ul>
      </div>

      <div ref="aboutRight" class="about__right">
        <SliderAbout
          ref="slider"
          :images-spectacles="about.imagesSpectacles"
          :images-films="about.imagesFilms"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { groq } from '@nuxtjs/sanity'
import SliderAbout from '~/components/about/sliderAbout.vue'
import emitter from '~/assets/js/events/EventsEmitter'

// Serializer for Sanity
// https://knapstad.dev/articles/MakingAExternalLinkSerialiserForSanityInVue

export default {
  components: {
    SliderAbout,
  },
  async asyncData({ $sanity }) {
    const queryAbout = groq`*[_type == 'about']{ _id, name, presentation, imagesSpectacles, imagesFilms }[0]`
    const about = await $sanity.fetch(queryAbout)

    // Block hand made
    const blocksText = about.presentation
    const texts = []
    blocksText.forEach((block) => {
      const line = block.children[0].text
      if (block.children[2]) {
        const subLine = block.children[1].text
        const line2 = block.children[2].text
        texts.push({
          line,
          subLine,
          line2,
        })
      } else if (block.children[1]) {
        const subLine = block.children[1].text
        texts.push({
          line,
          subLine,
        })
      } else {
        texts.push({
          line,
        })
      }
    })
    return { about, texts }
  },
  data() {
    return {
      sliderShown: false,
      categoryDisplaid: null,
    }
  },
  computed: {
    ...mapGetters(['isMobile', 'isTouch']),
  },
  mounted() {
    /* eslint-disable no-new */
    this.theaterEl = document.querySelectorAll(
      '.about__presentation .strong'
    )[0]
    this.filmsEl = document.querySelectorAll('.about__presentation .strong')[1]
    this.linesHoverTheater = this.theaterEl.querySelector('span')
    this.linesHoverFilms = this.filmsEl.querySelector('span')

    this.nameSplitted = new this.$SplitText(this.$refs.name, {
      type: 'lines',
      linesClass: 'lineText',
    })

    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
      console.log(this.isMobile)
      this.hoverLinks()
      if (this.isTouch) {
        this.touchClickLinks()
      }
      if (this.isMobile) {
        this.mobileClickLinks()
      }
    })
  },

  methods: {
    resize(w, h) {
      this.$refs.slider.resize(w)
      this.pageHeight = h
      this.pageWidth = w
    },
    hoverLinks() {
      if (this.isMobile || this.isTouch) return
      const gsap = this.$gsap

      this.theaterEl.addEventListener('mouseenter', () => {
        gsap.set(this.linesHoverTheater, {
          transformOrigin: 'right',
        })
        gsap.to(this.linesHoverTheater, {
          scaleX: 0,
          ease: 'power1.in',
        })
        this.$refs.slider.toggleSlider('imagesSpectacles')
      })

      this.theaterEl.addEventListener('mouseleave', () => {
        gsap.set(this.linesHoverTheater, {
          transformOrigin: 'left',
        })
        gsap.to(this.linesHoverTheater, {
          scaleX: 1,
          ease: 'power1.in',
        })
      })

      this.filmsEl.addEventListener('mouseenter', () => {
        gsap.set(this.linesHoverFilms, {
          transformOrigin: 'right',
        })
        gsap.to(this.linesHoverFilms, {
          scaleX: 0,
          ease: 'power1.in',
        })
        this.$refs.slider.toggleSlider('imagesFilms')
      })

      this.filmsEl.addEventListener('mouseleave', () => {
        gsap.set(this.linesHoverFilms, {
          transformOrigin: 'left',
        })
        gsap.to(this.linesHoverFilms, {
          scaleX: 1,
          ease: 'power1.in',
        })
      })
    },
    touchClickLinks() {
      const gsap = this.$gsap

      this.theaterEl.addEventListener('click', () => {
        gsap.set(this.linesHoverTheater, {
          transformOrigin: 'right',
        })
        gsap.to(this.linesHoverTheater, {
          scaleX: 0,
          ease: 'power1.in',
        })
        this.$refs.slider.toggleSlider('imagesSpectacles')
      })

      this.theaterEl.addEventListener('mouseleave', () => {
        gsap.set(this.linesHoverTheater, {
          transformOrigin: 'left',
        })
        gsap.to(this.linesHoverTheater, {
          scaleX: 1,
          ease: 'power1.in',
        })
      })

      this.filmsEl.addEventListener('click', () => {
        gsap.set(this.linesHoverFilms, {
          transformOrigin: 'right',
        })
        gsap.to(this.linesHoverFilms, {
          scaleX: 0,
          ease: 'power1.in',
        })
        this.$refs.slider.toggleSlider('imagesFilms')
      })

      this.filmsEl.addEventListener('mouseleave', () => {
        gsap.set(this.linesHoverFilms, {
          transformOrigin: 'left',
        })
        gsap.to(this.linesHoverFilms, {
          scaleX: 1,
          ease: 'power1.in',
        })
      })
    },

    mobileClickLinks() {
      console.log('mobile click links')
      this.theaterEl.addEventListener('click', () => {
        console.log('click theater')

        this.$refs.aboutRight.style.pointerEvents = 'auto'

        this.$refs.slider.toggleSliderMobile('imagesSpectacles')
      })

      this.filmsEl.addEventListener('click', () => {
        this.$refs.aboutRight.style.pointerEvents = 'auto'

        this.$refs.slider.toggleSliderMobile('imagesFilms')
      })
    },

    animateIn() {
      const tl = this.$gsap.timeline()
      tl.to('.about', {
        opacity: 1,
      })

      tl.fromTo(
        this.nameSplitted.lines,
        {
          y: -20,
        },
        {
          y: 0,
          duration: 1.4,
          ease: 'power2.inOut',
        }
      )
      tl.fromTo(
        '.about__socials a',
        {
          y: -20,
        },
        {
          y: 0,
          duration: 2,
          ease: 'power2.inOut',
        },
        '<'
      )

      tl.fromTo(
        '.about .line__wrapper',
        {
          scaleY: 0,
        },
        {
          scaleY: 1,
          duration: 1.4,
          ease: 'power2.inOut',
        },
        '<'
      )
      tl.fromTo(
        this.$refs.presentationEls,
        {
          y: 100,
          opacity: 0,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power2.inOut',
          stagger: 0.1,
          onComplete: this.animateLinesHover,
        },
        '<'
      )
    },
    animateLinesHover() {
      const tl = this.$gsap.timeline()
      tl.set(this.$refs.lineHover, {
        transformOrigin: 'left',
      })

      tl.to(this.$refs.lineHover, {
        scaleX: 1,
        ease: 'power1.out',
      })
    },
  },
}
</script>

<style lang="scss">
.about {
  opacity: 0;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.about__wrapper {
  max-width: vw(1200);
  display: grid;

  grid-template-columns: repeat (2, max-content);
  grid-template-rows: repeat (2, max-content);
}

.about__name {
  overflow: hidden;
  grid-column: 1;
  grid-row: 1;
  margin-bottom: vw(80);

  text-transform: uppercase;
}

.about__presentation {
  grid-column: 1;
  grid-row: 2;
  width: vw(470);

  line-height: 2.5;

  .strong {
    /* font-family: $font-soleil-bold; */
    display: inline-block;
    cursor: pointer;
    position: relative;

    .line-hover {
      position: absolute;
      left: 0;
      bottom: 5px;
      content: '';
      width: 100%;
      height: vw(0.8);
      background: $color-dark;
      transform: scaleX(0);
    }
  }
}

.about__socials {
  grid-column: 2;
  grid-row: 1;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  text-align: right;
  text-transform: uppercase;
  ul {
    li {
      overflow: hidden;
      &:not(:first-child) {
        margin-top: vw(5);
      }

      a {
        display: block;
        height: vw(20);

        &:before {
          content: '';
          position: absolute;
          bottom: 0;
          width: 100%;
          height: vw(2);
          background: $color-dark;
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

.about__right {
  margin-left: vw(150);
  grid-column: 2;
  grid-row: 2;
  position: relative;
  display: flex;
  align-items: flex-end;
}

@include media('<phone') {
  .about__wrapper {
    margin-top: 0;
    max-width: vw(1200);
    display: block;
  }
  .about__presentation {
    width: unset;

    .strong {
      .line-hover {
        height: 1px;
      }
    }
  }

  .about__socials {
    position: fixed;
    bottom: 16px;
    right: 16px;
    ul {
      li {
        &:not(:first-child) {
          margin-top: 10px;
        }

        a {
          display: block;
          height: 15px;

          &:before {
            display: none;
          }
        }
      }
    }
  }

  .about__right {
    pointer-events: none;
    margin-left: unset;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

@supports (-webkit-touch-callout: none) {
  .is-touch {
    .about {
      min-height: stretch;
    }
  }
}
</style>
