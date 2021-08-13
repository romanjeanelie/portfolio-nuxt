<template>
  <div class="project">
    <div class="project__top">
      <NuxtLink to="/projects">Close</NuxtLink>
    </div>
    <div :if="project.images" class="project__images">
      <div
        v-for="image in project.images"
        :key="image._key"
        class="image__container"
      >
        <SanityImage :asset-id="image.asset._ref" />
      </div>
    </div>
    <h1 class="project__title">{{ project.title }}</h1>
    <div class="project__description">
      <p>{{ project.description }}</p>
      <a :href="project.url" target="_blank">Visit the website</a>
    </div>

    <footer class="project__footer">
      <a href="#">Previous project</a>
      <p class="index">00{{ index + 1 }}</p>
      <a href="#">Next Project</a>
    </footer>
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'

export default {
  async asyncData({ params, $sanity }) {
    const queryProjects = groq`*[_type == "projects"]`
    const projects = await $sanity.fetch(queryProjects)
    let project
    let index
    projects.forEach((item, i) => {
      if (item.slug.current === params.slug) {
        project = item
        index = i
      }
    })

    return { project, index }
  },
}
</script>

<style lang="scss">
.is-touch .project {
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
}

.project {
  width: 100vw;
  min-height: 100vh;

  position: relative;

  background: linear-gradient(
    -90deg,
    rgba(8, 8, 8, 1) 0%,
    rgba(54, 52, 52, 1) 100%
  );
  color: $color-very-light;
}

.project__top {
  position: absolute;
  width: 100%;
  top: 0;
  padding: $padding-vert $padding-hor;
  opacity: 0.5;

  text-transform: uppercase;
}

.project__title {
  text-transform: uppercase;
  font-size: vw(100);
  word-spacing: 100vw;
  line-height: 1;

  position: absolute;
  top: 50%;
  left: vw(70);
  transform: translateY(-60%);
}

.project__description {
  position: absolute;
  top: 50%;
  right: vw(160);
  transform: translateY(-40%);
  width: vw(300);

  text-transform: uppercase;
  line-height: 1.8;

  a {
    display: block;
    text-align: right;
    margin-top: vw(70);
  }
}

.project__images {
  display: flex;
  position: absolute;
  top: $padding-vert;
  left: 50%;
  transform: translateX(-50%);

  .image__container {
    border: 1px solid rgba($color-light, 0.5);
    height: 100px;
    width: 200px;
    margin: 0 vw(30);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img {
      height: 100%;
    }
  }
}

.project__footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: $padding-vert $padding-hor;

  text-transform: uppercase;

  a {
    opacity: 0.5;
    transition: opacity 300ms ease;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
