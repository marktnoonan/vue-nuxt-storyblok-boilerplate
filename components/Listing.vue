<template>
  <div v-editable="blok" class="column p-2">
    <ul class="results-card leading-relaxed" :class="'cat__' + blok.category">
    <li>
      <div class="text-xl font-semibold pb-1 text-center">{{blok.name}}</div>
    </li>
    <li v-if="blok.category || blok.banner">
       <span>{{blok.category}}</span>
     
      <span v-if="blok.category && blok.banner">-</span>
      {{blok.banner}}
      <span
        v-if="blok.memberStatus.toLowerCase() == 'y'"
        class="bg-red-500 text-white text-xs font-bold py-1 px-2"
      >Member Only</span>
    </li>
    <li v-if="blok.eventDetails">
      <div class="label">Details</div>
      {{blok.eventDetails}}
    </li>
    <li v-if="blok.when">
      <div class="label">When?</div>
      {{blok.when}}
    </li>
    <li v-if="blok.cost">
      <div class="label">Cost</div>
      {{blok.cost}}
    </li>
    <li v-if="blok.age">
      <div class="label">Age</div>
      {{blok.age}}
    </li>
    <li v-if="blok.specialNotes">
      <div class="label">Special Notes</div>
      {{blok.specialNotes}}
    </li>
    <li v-if="blok.fullAddress">
      <div class="label">Location</div>
      <a
        class="font-thin"
        :href="'https://www.google.com/maps/place/' + blok.fullAddress + ' Ireland'"
        target="_blank"
      >{{blok.fullAddress}}</a>
    </li>
    <li v-if="blok.onlineInfo">
      <div class="label">Online</div>
      <a
        :href="blok.onlineInfo"
        class="text-sm font-thin break-all"
      >{{blok.onlineInfo}}</a>
    </li>
    <li v-if="blok.phone">
      <div class="label">Tel</div>
      <a class="font-thin" :href="'tel:+'+blok.phone">{{blok.phone}}</a>
    </li>
  </ul>
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
