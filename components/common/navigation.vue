<template>
  <nav :class="[`navigation`, toggleNav]">
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
    toggleNav() {
      if (this.$route.path === '/' || this.$route.params.slug) {
        return ''
      } else {
        return 'active'
      }
    },

    toggleAboutProjects() {
      return this.$route.path === '/about' ? 'projects' : 'about'
    },
  },
}
</script>

<style lang="scss">
.navigation {
  z-index: z('navigation');
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: $padding-vert $padding-hor;
  justify-content: space-between;

  text-transform: uppercase;

  &.active {
    display: flex;
  }
}
</style>
