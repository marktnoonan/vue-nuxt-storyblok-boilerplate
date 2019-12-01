<template>
  <div v-editable="blok" class="column feature p-2">
    <div class="title text-center">{{ blok.name }}</div>
    <div class="title text-center">{{ blok.category }}</div>
    <div class="title text-center">{{ blok.banner }}</div>
    <div class="title text-center">{{ blok.memberStatus }}</div>
    <div class="title text-center">{{ blok.eventDetails }}</div>
    <div class="title text-center">{{ blok.when }}</div>
    <div class="title text-center">{{ blok.cost }}</div>
    <div class="title text-center">{{ blok.age }}</div>
    <div class="title text-center">{{ blok.specialNotes }}</div>
    <div class="title text-center">{{ blok.fullAddress }}</div>
    <div class="title text-center">{{ blok.onlineInfo }}</div>
    <div class="title text-center">{{ blok.phone }}</div>
    <div>{{blok.review}}</div>
  </div>
</template>

<script>
export default {
  props: ['blok'],
  computed: {
    review() {
      return this.blok.review ? this.$storyapi.richTextResolver.render(this.blok.review) : ''
    }
  }
}
</script>
