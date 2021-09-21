<template>
  <nav ref="navigation" class="navigation">
    <div class="navigation__desktop">
      <NuxtLink to="/" class="navigation__home">ROMAN JEAN-ELIE</NuxtLink>
      <NuxtLink :to="toggleAboutProjects" class="navigation__about">{{
        toggleAboutProjects
      }}</NuxtLink>
    </div>

    <div class="navigation__phone">
      <NuxtLink
        to="/projects"
        :class="[
          `navigation__projects`,
          { active: $route.name === `projects` },
        ]"
        >projects</NuxtLink
      >
      <NuxtLink
        to="/about"
        :class="[`navigation__projects`, { active: $route.name === `about` }]"
        >about</NuxtLink
      >
    </div>
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

  methods: {
    animateIn() {
      const gsap = this.$gsap
      gsap.to(this.$el, {
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
.navigation {
  z-index: z('navigation');

  transform: translateY(-100%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: $padding-vert $padding-hor;
  text-transform: uppercase;
  a {
    display: block;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: -50%;
      width: 100%;
      height: vw(2);
      background: $color-dark;
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 700ms;
    }

    &:hover {
      &:before {
        transform: scaleX(1);
        transform-origin: right;
      }
    }
  }

  .navigation__desktop {
    display: flex;
    justify-content: space-between;
  }

  .navigation__phone {
    display: none;
  }
}
@include media('<phone') {
  .navigation {
    a {
      opacity: 1;
      &:before {
        height: 1px;
      }
      &:hover {
        opacity: 1;
        &:before {
          transform: scaleX(0);
        }
      }
      &.active {
        opacity: 0.5;
        &:before {
          transform: scaleX(0);
        }
      }
    }
    .navigation__desktop {
      display: none;
    }
    .navigation__phone {
      padding: 16px;
      justify-content: space-between;
      display: flex;
    }
  }
}
</style>
