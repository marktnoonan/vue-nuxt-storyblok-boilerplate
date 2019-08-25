<template>
  <div v-editable="blok" class="column feature">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>
    <div class="title">{{ blok.name }}</div>
    <div id="map-wrap" style="height: 400px">
      <client-only>
        <l-map :zoom=13 :center="[53.3498, -6.2603]">
          <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          <l-marker :lat-lng="[53.3498, -6.2603]"></l-marker>
        </l-map>
      </client-only>
      </div>
    <p class="text text-base leading-tight my-6">{{ blok.text }}</p>
    
  </div>
</template>

<style lang="css" scoped>
</style>

<script>

export default {
  props: ['blok'],
  mounted() {

  }
}
</script>
