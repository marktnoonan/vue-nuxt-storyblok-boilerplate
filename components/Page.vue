<template>
  <main v-editable="blok" id="maincontent">
    <component :key="blok._uid" v-for="blok in blok.body" :blok="blok" :is="blok.component | dashify"></component>
  </main>
</template>

<script>
export default {
  props: ['blok']
}
</script>
