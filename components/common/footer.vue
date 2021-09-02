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
  created() {
    setInterval(() => {
      const date = new Date()
      const hours =
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return (this.time = hours + ':' + minutes)
    }, 100)
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
</style>
