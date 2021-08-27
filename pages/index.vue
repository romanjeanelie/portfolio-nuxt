<template>
  <div ref="home" class="home">
    <div class="home__wrapper">
      <main class="home__main">
        <div class="home__line"></div>
        <div class="content__wrapper">
          <h1 ref="title">
            {{ home.title }}
          </h1>
          <h3 ref="subtitle">
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
    /* eslint-disable no-new */
    new this.$SplitText(this.$refs.title, {
      type: 'lines',
      linesClass: 'lineText',
    })
    new this.$SplitText(this.$refs.subtitle, {
      type: 'lines',
      linesClass: 'lineText',
    })
    new this.$SplitText('.home__bottom a', {
      type: 'lines',
      linesClass: 'lineText',
    })

    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
    })
  },
  methods: {
    animateIn() {
      const tl = this.$gsap.timeline()
      tl.fromTo(
        '.home__line',
        {
          scaleY: 0,
          transformOrigin: 'top',
        },
        {
          scaleY: 1,
          delay: 0.2,
          duration: 1,
        }
      )
      tl.fromTo(
        ['.home h1 .lineText', '.home h3 .lineText', '.home a .lineText'],
        {
          y: '-110%',
        },
        {
          y: '0%',
          duration: 1,
        },
        '<'
      )
      // this.$gsap.to('.home', {
      //   opacity: 1,
      // })
    },

    resize(w, h, ph) {},
    tick(scrollTop) {},
  },
}
</script>

<style lang="scss">
.home {
  opacity: 1;
  width: 100vw;
  height: 100vh;

  position: relative;
}
.home__main {
  position: absolute;
  top: 40%;
  left: 50%;
  display: flex;
  .content__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  h1 {
    overflow: hidden;
    text-transform: uppercase;
  }
  h3 {
    overflow: hidden;
    margin-top: vw(7);
    text-transform: lowercase;
  }

  .home__line {
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
  a {
    display: inline-block;
    overflow: hidden;
  }
}
</style>
