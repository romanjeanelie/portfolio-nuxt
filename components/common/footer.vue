<template>
  <footer :class="[`footer`, toggleFooter]">
    <p>PARIS, FR {{ time }}</p>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      time: null,
      interval: null,
    }
  },
  computed: {
    toggleFooter() {
      if (this.$route.path === '/' || this.$route.params.slug) {
        return ''
      } else {
        return 'active'
      }
    },
  },
  mounted() {
    this.interval = setInterval(() => {
      let date = new Date()
      date = this.convertTimeZone(date, 'Europe/Paris') // current date-time in jakarta.
      const hours =
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return (this.time = hours + ':' + minutes)
    }, 1000)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    animateIn() {
      this.$gsap.to(this.$el, {
        y: 0,
        duration: 2,
        delay: 1,
        ease: 'expo.out',
      })
    },

    convertTimeZone(date, timezone) {
      return new Date(
        (typeof date === 'string' ? new Date(date) : date).toLocaleString(
          'en-US',
          { timeZone: timezone }
        )
      )
    },
  },
}
</script>

<style lang="scss">
.footer {
  transform: translateY(100%);
  z-index: z('footer');
  display: none;
  justify-content: flex-end;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: $padding-vert $padding-hor;

  text-transform: uppercase;

  &.active {
    display: flex;
  }
}

@include media('<phone') {
  .footer.active {
    display: none;
  }
}
</style>
