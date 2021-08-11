<template>
  <nav class="navigation">
    <a href="#" class="home">ROMAN JEAN-ELIE</a>
    <a href="#" class="about">About</a>
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
  padding: vw(20) vw(20);
  display: flex;
  justify-content: space-between;

  text-transform: uppercase;
}
</style>
