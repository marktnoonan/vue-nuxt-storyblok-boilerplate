import Vue from 'vue'
import Page from '~/components/Page.vue'
import Teaser from '~/components/Teaser.vue'
import Grid from '~/components/Grid.vue'
import Feature from '~/components/Feature.vue'
import ContactForm from '~/components/ContactForm'
import Search from '~/components/Search'
import Listing from '~/components/Listing'
import aaMap from '~/components/Map'
import VueFuse from "vue-fuse";

Vue.use(VueFuse)

Vue.component('blok-page', Page)
Vue.component('blok-teaser', Teaser)
Vue.component('blok-grid', Grid)
Vue.component('blok-feature', Feature)
Vue.component('blok-contact-form', ContactForm)
Vue.component('blok-map', aaMap)
Vue.component('blok-search', Search)
Vue.component('blok-listing', Listing)

