<template>
  <div v-editable="blok" class="column feature">
    <div class="title">{{ blok.name }}</div>
    <p class="text text-base">{{ blok.text }}</p>
  </div>
</template>

<script>
export default {
  props: ['blok']
}
</script>
