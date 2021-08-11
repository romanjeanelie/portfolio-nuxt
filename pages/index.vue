<template>
  <div class="home">
    <div class="home__wrapper">
      <main class="main">
        <h1>
          {{ home.title }}
        </h1>
        <h3>
          {{ home.subtitle }}
        </h3>
      </main>

      <div class="bottom">
        <!-- <p>
          {{ home.button }}
        </p> -->
        <NuxtLink to="/projects">voir les projets</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import emitter from '~/assets/js/events/EventsEmitter'

const query = groq`{ "home": *[_type == 'home']{ _id, title, subtitle, slug, button }[0]}`

export default {
  asyncData({ $sanity }) {
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
.main {
  top: 40%;
  left: 55%;
  position: absolute;
  h1 {
    text-transform: uppercase;
  }
  h3 {
    text-transform: lowercase;
  }
}

.bottom {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: vw(100);
}
</style>
