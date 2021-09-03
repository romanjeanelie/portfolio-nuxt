<template>
  <strong class="strong"><slot /></strong>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style></style>
