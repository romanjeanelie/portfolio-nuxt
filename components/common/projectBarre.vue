<template>
  <div ref="projectBarre" class="project-barre"></div>
</template>

<script>
export default {
  methods: {},
}
</script>

<style lang="scss">
.project-barre {
  /* display: none; */
  opacity: 0;
  z-index: z('projectBarre');

  position: fixed;
  right: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: $color-dark;
  transform: scaleX(0);
  transform-origin: left;
  will-change: transform;
  /* transform-origin: right center; */
}
</style>
