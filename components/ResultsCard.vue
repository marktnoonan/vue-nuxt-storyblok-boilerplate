<template>
  <ul class="results-card leading-relaxed" :class="'cat__' + item.Category">
    <li>
      <div class="text-xl font-semibold pb-1 text-center">{{item.Name}}</div>
    </li>
    <li v-if="item.Category || item['Banner']">
       <button
          @click="searchFromClick"
          class="clickable-val"
        >{{item.Category}}</button>
     
      <span v-if="item.Category && item['Banner']">-</span>
      {{item["Banner"]}}
      <span
        v-if="item['Member only?'].toLowerCase() == 'y'"
        class="bg-red-500 text-white text-xs font-bold py-1 px-2"
      >Member Only</span>
    </li>
    <li v-if="item['Event details']">
      <div class="label">Details</div>
      {{item["Event details"]}}
    </li>
    <li v-if="item['When?']">
      <div class="label">When?</div>
      {{item["When?"]}}
    </li>
    <li v-if="item['W]]Cost €']">
      <div class="label">Cost</div>
      {{item["Cost €"]}}
    </li>
    <li v-if="item['Age']">
      <div class="label">Age</div>
      {{item["Age"]}}
    </li>
    <li v-if="item['Special notes']">
      <div class="label">Special Notes</div>
      {{item["Special notes"]}}
    </li>
    <li v-if="item['FULL ADDRESS']">
      <div class="label">Location</div>
      <a
        class="font-thin"
        :href="'https://www.google.com/maps/place/' + item['FULL ADDRESS'] + ' Ireland'"
      >{{item["FULL ADDRESS"]}}</a>
    </li>
    <li v-if="item['Website/Facebook']">
      <div class="label">Online</div>
      <a
        :href="item['Website/Facebook']"
        class="text-sm font-thin break-all"
      >{{item["Website/Facebook"]}}</a>
    </li>
    <li v-if="item['Tel:']">
      <div class="label">Tel</div>
      <a class="font-thin" :href="'tel:+'+item['Tel:']">{{item["Tel:"]}}</a>
    </li>
    <!-- <li>Contact: {{item["Address 1"]}}</li> -->
  </ul>
</template>

<script>
export default {
  props:["item"],
  methods: {
    searchFromClick(event) {
      this.$emit('searchFromClick', event.target.textContent)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>