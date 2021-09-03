<template>
  <nav ref="navigation" class="navigation">
    <NuxtLink to="/" class="navigation__home">ROMAN JEAN-ELIE</NuxtLink>
    <NuxtLink :to="toggleAboutProjects" class="navigation__about">{{
      toggleAboutProjects
    }}</NuxtLink>
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
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: $padding-vert $padding-hor;
  justify-content: space-between;

  text-transform: uppercase;
}
</style>
