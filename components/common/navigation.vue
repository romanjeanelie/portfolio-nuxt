<template>
  <nav class="navigation">
    <a href="#" class="navigation__home">ROMAN JEAN-ELIE</a>
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
}
</script>

<style lang="scss">
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: $padding-vert $padding-hor;
  display: flex;
  justify-content: space-between;

  text-transform: uppercase;
}
</style>
