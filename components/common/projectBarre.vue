<template>
  <div class="project-barre"></div>
</template>

<script>
export default {
  methods: {},
}
</script>

<style lang="scss">
.project-barre {
  z-index: z('projectBarre');

  position: absolute;
  right: 0;
  top: 0;
  width: 0;
  height: 100vh;
  background: $color-dark;
  transform-origin: left;
  /* transform-origin: right center; */
}
</style>
