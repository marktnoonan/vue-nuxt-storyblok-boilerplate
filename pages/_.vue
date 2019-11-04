<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap p-6">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <nuxt-link to="/"><span class="font-semibold no-active text-xl tracking-tight p-4 hover:bg-blue-700 border">Autism Activities</span></nuxt-link>
      </div>
      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <!-- <nuxt-link to="/about" class="block mt-4 lg:inline-block lg:mt-0 text-green-100 hover:text-white mr-4 text-lg">
            About
          </nuxt-link>
          <nuxt-link to="/events" class="block mt-4 lg:inline-block lg:mt-0 text-green-100 hover:text-white mr-4 text-lg">
            Events
          </nuxt-link> -->
          <nuxt-link to="/about" class="block mt-4 lg:inline-block lg:mt-0 text-green-100 hover:text-white mr-4 text-lg hover:bg-blue-700 p-2">
            About
          </nuxt-link>
          <nuxt-link to="/search" class="block mt-4 lg:inline-block lg:mt-0 text-green-100 hover:text-white mr-4 text-lg hover:bg-blue-700 p-2">
            Find Activities
          </nuxt-link>
          <nuxt-link to="/feedback" class="block mt-4 lg:inline-block lg:mt-0 text-green-100 hover:text-white mr-4 text-lg hover:bg-blue-700 p-2">
            Feedback
          </nuxt-link>
        </div>
      </div>
    </nav>
    <img 
    v-if="this.$route.path == '/'"
    src="//a.storyblok.com/f/65034/400x400/e81a334ce3/autism-activities.png" alt="Autism Activities Ireland" 
    class="autism-activities-logo"/> 
    <component v-if="story.content.component" :key="story.content._uid" :blok="story.content" :is="story.content.component | dashify"></component>
    <form name="contact" netlify hidden>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <input type="radio" class="form-radio" name="accountType" value="suggest-event">
      <input type="radio" class="form-radio" name="accountType" value="general-comment">
      <textarea name="message"></textarea>
    </form>
  </div>
</template>

<style scoped>
nav {
  background-color: #337ABB
}
body {
  background-image: linear-gradient(to bottom, #ff000026,#ffa50021,#ffff0036,#0080002b,#0000ff24,#4b008230,#c0cdfa3d, white);
}

.autism-activities-logo {
    margin: 0 auto;
    width: 250px;
}
/* .page-enter-active, .page-leave-active {
  transition: opacity .4s
}
.page-enter, .page-leave-active {
  opacity: 0
} */
</style>
<script>
const loadData = function({api, cacheVersion, errorCallback, version, path}) {
  return api.get(`cdn/stories/${path}`, {
    version: version,
    cv: cacheVersion
  }).then((res) => {
    return res.data
  }).catch((res) => {
    if (!res.response) {
      console.error(res)
      errorCallback({ statusCode: 404, message: 'Failed to receive content form api' })
    } else {
      console.error(res.response.data)
      errorCallback({ statusCode: res.response.status, message: res.response.data })
    }
  })
}

export default {
  data () {
    return { 
      story: { content: {} }
      }
  },
  head () {
    return {
      title: "AutismActivities.ie"
    }
  },
  mounted () {
    this.$storybridge.on(['input', 'published', 'change'], (event) => {
      if (event.action == 'input') {
        if (event.story.id === this.story.id) {
          this.story.content = event.story.content
        }
      } else if (!event.slugChanged) {
        window.location.reload()
      }
    })
  },
  asyncData (context) {
    // Check if we are in the editing mode
    let editMode = false

    if (context.query._storyblok || context.isDev || (typeof window !== 'undefined' && window.localStorage.getItem('_storyblok_draft_mode'))) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('_storyblok_draft_mode', '1')
        if (window.location == window.parent.location) {
          window.localStorage.removeItem('_storyblok_draft_mode')
        }
      }

      editMode = true
    }

    let version = editMode ? 'draft' : 'published'
    let path = context.route.path == '/' ? 'home' : context.route.path

    // Load the JSON from the API
    return loadData({
      version: version,
      api: context.app.$storyapi,
      cacheVersion: context.store.state.cacheVersion,
      errorCallback: context.error,
      path: path
    })
  }
}
</script>
