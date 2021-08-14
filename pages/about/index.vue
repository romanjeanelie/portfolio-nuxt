<template>
  <div class="about">
    <div class="about__wrapper">
      <h1 class="about__name">{{ about.name }}</h1>
      <SanityContent :blocks="about.presentation" class="about__presentation" />

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
        <div class="line"></div>

        <div class="slider__container">
          <div class="slider">
            <div class="slider__wrapper">
              <div
                v-for="image in about.imagesSpectacles"
                :key="image._key"
                class="image__wrapper"
              >
                <SanityImage :asset-id="image.asset._ref" />
              </div>
            </div>
          </div>
          <div class="slider__controls">
            <p class="prev">prev</p>
            <p class="close">close</p>
            <p class="next">next</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  asyncData({ $sanity }) {
    const query = groq`{ "about": *[_type == 'about']{ _id, name, presentation, imagesSpectacles, imagesFilms }[0]}`
    return $sanity.fetch(query)
  },
  mounted() {
    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
    })
  },
}
</script>

<style lang="scss">
.is-touch .about {
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
}

.about {
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

  strong {
    font-family: $font-soleil-bold;
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

  .slider__container {
    position: relative;
    margin-left: vw(10);

    .slider__controls {
      position: absolute;
      left: 0;
      bottom: -23px;
      width: 100%;
      display: flex;
      justify-content: space-between;

      text-transform: uppercase;
      font-size: vw(8);
    }
  }

  .slider {
    height: vw(300);
    width: vw(500);
    overflow: hidden;

    background: black;
    .slider__wrapper {
      height: 100%;
      position: relative;
      display: flex;
      transform: translateX(0); // value to modify
      transition: 300ms transform ease;
      .image__wrapper {
        flex-shrink: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        img {
          height: 100%;
          width: auto;
        }
      }
    }
  }

  .line {
    height: 100%;
    width: 6px;

    background: $color-dark;
    opacity: 0.6;
  }
}
</style>
