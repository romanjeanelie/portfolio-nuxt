<template>
  <nav ref="navigation" class="navigation">
    <div class="navigation__desktop">
      <NuxtLink to="/" class="navigation__home">ROMAN JEAN-ELIE</NuxtLink>
      <div class="navigation__toggle">
        <NuxtLink ref="about" to="about" class="navigation__about"
          >about</NuxtLink
        >
        <NuxtLink ref="projects" to="projects" class="navigation__projects"
          >projects</NuxtLink
        >
      </div>
      <!-- <NuxtLink :to="toggleAboutProjects" class="navigation__about">{{
        toggleAboutProjects
      }}</NuxtLink> -->
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
    animToAbout() {
      const gsap = this.$gsap
      const tl = gsap.timeline()

      const ease = 'power2.out'

      tl.to(this.$refs.about.$el, {
        y: '-100%',
        duration: 1,
        delay: 0.5,
        ease,
      })
      tl.to(
        this.$refs.projects.$el,
        {
          y: '-100%',
          duration: 1,
          ease,
        },
        '<'
      )
    },
    animToProjects() {
      const gsap = this.$gsap
      const tl = gsap.timeline()

      const ease = 'power2.out'

      tl.to(this.$refs.about.$el, {
        y: 0,
        duration: 1,
        delay: 0.5,
        ease,
      })
      tl.to(
        this.$refs.projects.$el,
        {
          y: '65%',
          duration: 1,
          ease,
        },
        '<'
      )
    },
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

  .navigation__toggle {
    overflow: hidden;
    height: vw(20);

    .navigation__about {
      width: vw(40);
    }
    .navigation__projects {
      transform: translateY(12%);
    }
  }
  a {
    display: block;
    position: relative;
    &:before {
      z-index: 2;
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

.is-touch {
  .navigation {
    a {
      opacity: 1;
      transition: opacity 700ms;
      &:hover {
        opacity: 0.5;

        &:before {
          transform: scaleX(0);
        }
      }
    }
  }
}
@include media('<phone') {
  .navigation {
    a {
      opacity: 1;
      transition: opacity 700ms;
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
