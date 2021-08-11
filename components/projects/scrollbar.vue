<template>
  <div class="scrollbar">
    <div
      v-for="item in projects"
      :key="item"
      :style="{ height: heightSegment }"
      class="scrollbar__item"
      :class="[projectHover === item ? 'active' : '']"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'Scrollbar',
  props: {
    projects: {
      type: Number,
      default: 0,
    },
  },
  data: () => {
    return {
      projectHover: 1,
    }
  },
  computed: {
    heightSegment() {
      const totalHeight = 85
      return `${totalHeight / this.projects}vh`
    },
  },
}
</script>

<style lang="scss">
.scrollbar {
  position: fixed;
  top: vw(70);
  left: vw(20);
  width: 5px;
  height: 85vh;

  display: flex;
  flex-direction: column;
  .scrollbar__item {
    background: $color-dark;
    opacity: 20%;
    &:not(:first-child) {
      margin-top: vw(10);
    }
    &.active {
      opacity: 100%;
    }
  }
}
</style>
