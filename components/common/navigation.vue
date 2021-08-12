<template>
  <nav class="navigation">
    <a href="#" class="navigation__home">ROMAN JEAN-ELIE</a>
    <NuxtLink to="/about" class="navigation__about">About</NuxtLink>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
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
