<template>
  <div class="project-component">
    <div class="info-left">
      <p class="index">00{{ index + 1 }}</p>
    </div>
    <div class="canvas">
      <NuxtLink :to="`projects/${slug}`" class="plane"></NuxtLink>
      <div class="line"></div>
    </div>
    <NuxtLink :to="`projects/${slug}`" class="info-right">
      <p class="name">{{ name }}</p>
      <p class="date">{{ dateConverted }}</p>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'Project',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: 'name',
    },
    slug: {
      type: String,
      default: 'name',
    },
    date: {
      type: String,
      default: 'Janvier 2020',
    },
  },
  computed: {
    dateConverted() {
      const fullDate = new Date(this.date)
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      const year = fullDate.getFullYear()
      const month = fullDate.getMonth()

      return monthNames[month] + ' ' + year
    },
  },
}
</script>

<style lang="scss">
.project-component {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-template-rows: repeat(2, max-content);

  .info-left {
    font-size: vw(24);

    margin-right: vw(40);
  }

  .canvas {
    height: vw(465);
    grid-column-start: 2;
    grid-row-start: 1;
    display: flex;

    .plane {
      height: 100%;
      width: vw(315);
      border: 1px solid $color-dark;
    }

    .line {
      margin-left: vw(14);
      height: 100%;
      width: 6px;

      background: $color-dark;
      opacity: 60%;
    }
  }

  .info-right {
    grid-column-start: 3;
    grid-row-start: 2;

    margin-top: vw(30);
    margin-left: vw(10);

    text-transform: uppercase;

    p:nth-child(2) {
      margin-top: vw(6);
    }
  }
}
</style>
