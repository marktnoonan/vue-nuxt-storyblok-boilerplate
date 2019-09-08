<template>
  <div v-editable="blok" class="column feature">
    <div class="title">{{ blok.name }}</div>
    <div class="text text-base leading-tight my-6" v-html="blok.text"></div>
  </div>
</template>

<script>
export default {
  props: ['blok']
}
</script>
