<template>
  <h1>{{ slug }}</h1>
</template>

<script>
export default {
  asyncData({ params }) {
    const slug = params.slug // When calling /abc the slug will be "abc"
    return { slug }
  },
}
</script>

<style></style>
