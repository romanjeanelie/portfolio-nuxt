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
      const gsap = this.$gsap
      gsap.to(this.$refs.navigation, {
        y: 0,
        duration: 1.5,
        delay: 2,
        ease: 'power2.out',
      })
    },
  },
}
</script>

<style lang="scss">
.navigation {
  z-index: z('navigation');

  transform: translateY(-3vw);
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
