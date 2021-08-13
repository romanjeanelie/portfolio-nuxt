<template>
  <div class="home">
    <div class="home__wrapper">
      <main class="home__main">
        <div class="line"></div>
        <div class="content__wrapper">
          <h1>
            {{ home.title }}
          </h1>
          <h3>
            {{ home.subtitle }}
          </h3>
        </div>
      </main>

      <div class="home__bottom">
        <NuxtLink to="/projects">{{ home.button }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import emitter from '~/assets/js/events/EventsEmitter'

export default {
  asyncData({ $sanity }) {
    const query = groq`{ "home": *[_type == 'home']{ _id, title, subtitle, slug, button }[0]}`
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
.home__main {
  top: 40%;
  left: 50%;

  position: absolute;
  display: flex;
  .content__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  h1 {
    text-transform: uppercase;
  }
  h3 {
    margin-top: vw(7);
    text-transform: lowercase;
  }

  .line {
    width: 5px;
    height: vw(60);
    margin-right: vw(50);
    background: $color-dark;
  }
}

.home__bottom {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: vw(100);
}
</style>
