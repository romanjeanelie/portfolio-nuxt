<template>
  <nav ref="navigation" class="navigation">
    <div class="navigation__desktop">
      <NuxtLink to="/" class="navigation__home">ROMAN JEAN-ELIE</NuxtLink>
      <NuxtLink :to="toggleAboutProjects" class="navigation__about">{{
        toggleAboutProjects
      }}</NuxtLink>
    </div>

    <div class="navigation__phone">
      <NuxtLink to="/projects" class="navigation__projects">projects</NuxtLink>
      <NuxtLink to="/about" class="navigation__projects">about</NuxtLink>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  computed: {
    toggleAboutProjects() {
      return this.$route.path === '/about' ? 'projects' : 'about'
    },
  },

  methods: {
    animateIn() {
      // console.log('nav animate in')
      const gsap = this.$gsap
      gsap.to(this.$el, {
        y: 0,
        duration: 2,
        delay: 1,
        ease: 'expo.out',
      })
    },
  },
}
</script>

<style lang="scss">
.navigation {
  z-index: z('navigation');

  transform: translateY(-100%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: $padding-vert $padding-hor;
  text-transform: uppercase;

  .navigation__desktop {
    display: flex;
    justify-content: space-between;
  }

  .navigation__phone {
    display: none;
  }
}
@include media('<phone') {
  .navigation {
    .navigation__desktop {
      display: none;
    }
    .navigation__phone {
      padding: 16px;
      justify-content: space-between;
      display: flex;
    }
  }
}
</style>
