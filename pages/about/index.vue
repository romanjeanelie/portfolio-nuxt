<template>
  <div class="about">
    <div class="about__wrapper">
      <h1 class="about__name">{{ about.name }}</h1>

      <section ref="presentation" class="about__presentation">
        <div v-for="(text, i) in texts" :key="i" :class="text.style">
          {{ text.line }}
        </div>
      </section>

      <div class="about__socials">
        <ul>
          <li>
            <a href="#">Email</a>
          </li>
          <li>
            <a href="#">Instagram</a>
          </li>
          <li>
            <a href="#">Twitter</a>
          </li>
        </ul>
      </div>

      <div class="about__right">
        <div class="about__slider">
          <SliderAbout :images="about.imagesSpectacles" />
        </div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import SliderAbout from '~/components/about/sliderAbout.vue'
import emitter from '~/assets/js/events/EventsEmitter'

// https://knapstad.dev/articles/MakingAExternalLinkSerialiserForSanityInVue

export default {
  components: {
    SliderAbout,
  },
  async asyncData({ $sanity }) {
    // const query = groq`{ "about": *[_type == 'about']{ _id, name, presentation, imagesSpectacles, imagesFilms }[0]}`
    const queryAbout = groq`*[_type == 'about']{ _id, name, presentation, imagesSpectacles, imagesFilms }[0]`
    const about = await $sanity.fetch(queryAbout)

    // Block hand made
    const blocksText = about.presentation
    const texts = []
    blocksText.forEach((block) => {
      const line = block.children[0].text
      texts.push({
        line,
      })
      if (block.children[1]) {
        const line = block.children[1].text
        const style = block.children[1].marks[0]
        texts.push({
          line,
          style,
        })
      }
    })

    return { about, texts }
  },

  mounted() {
    const theaterEl = document.querySelectorAll(
      '.about__presentation .strong'
    )[0]
    this.theaterSplitted = new this.$SplitText(theaterEl, {
      type: 'chars',
      charsClass: 'chars',
    })

    const filmsEl = document.querySelectorAll('.about__presentation .strong')[1]
    this.filmsSplitted = new this.$SplitText(filmsEl, {
      type: 'chars',
      charsClass: 'chars',
    })

    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
    })
  },

  methods: {
    animateIn() {
      const tl = this.$gsap.timeline()
      tl.to('.about', {
        opacity: 1,
      })

      this.animateSpans()
    },
    animateSpans() {
      const tlTheater = this.$gsap.timeline({
        repeat: 1,
      })
      tlTheater.to(this.theaterSplitted.chars, {
        opacity: 0.5,
        stagger: 0.1,
        duration: 0.4,
        ease: 'expo.out',
      })
      tlTheater.to(
        this.theaterSplitted.chars,
        {
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
        },
        '-=1'
      )

      const tlFilm = this.$gsap.timeline({
        repeat: 3,
      })
      tlFilm.to(this.filmsSplitted.chars, {
        opacity: 0.5,
        stagger: 0.1,
        duration: 0.8,
        ease: 'expo.out',
      })
      tlFilm.to(
        this.filmsSplitted.chars,
        {
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
        },
        '-=0.7'
      )
    },
  },
}
</script>

<style lang="scss">
.is-touch .about {
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
}

.about {
  opacity: 0;
  height: 100vh;

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
  grid-column: 1;
  grid-row: 1;
  margin-bottom: vw(80);

  text-transform: uppercase;
}

.about__presentation {
  grid-column: 1;
  grid-row: 2;
  width: vw(400);

  line-height: 2.5;
  div {
    display: inline-block;
  }
  .strong {
    display: inline-block;
    font-family: $font-soleil-bold;
    cursor: pointer;
    &:before {
      content: '\00a0 ';
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
      &:not(:first-child) {
        margin-top: vw(10);
      }
    }
  }
}

.about__right {
  margin-left: vw(50);
  grid-column: 2;
  grid-row: 2;
  display: flex;

  .about__slider {
    position: relative;
    margin-left: vw(10);
  }

  .line {
    height: 100%;
    width: 6px;

    background: $color-dark;
    opacity: 0.6;
  }
}
</style>
