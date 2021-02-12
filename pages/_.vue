<template>
  <header>
    <div class="nav-wrap text-center md:text-left">
      <nav class="flex items-center justify-center md:justify-between flex-wrap p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <nuxt-link to="/">
            <span
              class="font-semibold no-active text-xl tracking-tight p-4 hover:bg-blue-700 border"
            >Autism Activities</span>
          </nuxt-link>
        </div>
        <div class="w-full block flex-grow md:flex md:items-center md:w-auto">
          <div class="text-sm md:flex-grow mt-8 md:mt-0">
            <nuxt-link
              to="/about"
              class="block mt-4 md:inline-block md:mt-0 text-green-100 hover:text-white mr-4 text-lg hover:bg-blue-700 p-2"
            >About</nuxt-link>
            <nuxt-link
              to="/search"
              class="block mt-4 md:inline-block md:mt-0 text-green-100 hover:text-white mr-4 text-lg hover:bg-blue-700 p-2"
            >Find Activities</nuxt-link>
            <nuxt-link
              to="/feedback"
              class="block mt-4 md:inline-block md:mt-0 text-green-100 hover:text-white mr-4 text-lg hover:bg-blue-700 p-2"
            >Feedback</nuxt-link>
            <nuxt-link
              to="/resources"
              class="block mt-4 md:inline-block md:mt-0 text-green-100 hover:text-white mr-4 text-lg hover:bg-blue-700 p-2"
            >Blogs</nuxt-link>
          </div>
        </div>
      </nav>
    </div>
    <img
      v-if="this.$route.path == '/'"
      src="//a.storyblok.com/f/65034/400x400/e81a334ce3/autism-activities.png"
      alt="Autism Activities Ireland"
      class="autism-activities-logo"
    />
    <component
      v-if="story.content.component"
      :key="story.content._uid"
      :blok="story.content"
      :is="story.content.component | dashify"
    ></component>

    <div class="cards">
      <div class="card">
        <div class="card__title">Swimming</div>
        <div class="card__image-wrap"></div>
        <div
          class="card__text-content"
        >Leisure centres from Waterford to Newry offer special autism-friendly swimming sessions, and some even offer swimming lessons.</div>
      </div>
      <div class="card">
        <div class="card__title">Cinema</div>
        <div class="card__image-wrap"></div>
        <div
          class="card__text-content"
        >Major cinema chains like the Odeon offer special autism-friendly swimming sessions, with dimmed lights and lower sounds, right across the country. Some also offer discounted prices for carers all year around.</div>
      </div>
      <div class="card">
        <div class="card__title">Social Groups</div>
        <div class="card__image-wrap"></div>
        <div
          class="card__text-content"
        >Social groups offer everything from Lego building to arts and crafts and bowling, and several allow parents to drop their child rather than staying to supervise.</div>
      </div>
      <div class="card">
        <div class="card__title">Libraries</div>
        <div class="card__image-wrap"></div>
        <div
          class="card__text-content"
        >Looking for a sensory room in your home town or on a staycation? The local library could well be the place. Some also have sensory toys and autism-friendly story sessions.</div>
      </div>
    </div>

    <form name="contact" netlify hidden>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <input type="radio" class="form-radio" name="accountType" value="suggest-event" />
      <input type="radio" class="form-radio" name="accountType" value="general-comment" />
      <textarea name="message"></textarea>
    </form>
  </header>
</template>

<style scoped>
.nav-wrap {
  background-color: #2414c4;
}
nav {
  max-width: 1024px;
  margin: 0 auto;
}

@media only screen and (max-width: 1024) {
  .nav-wrap {
    text-align: center;
  }
}

body {
  background-image: linear-gradient(
    to bottom,
    #ff000026,
    #ffa50021,
    #ffff0036,
    #0080002b,
    #0000ff24,
    #4b008230,
    #c0cdfa3d,
    white
  );
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

.cards {
  max-width: 1024px;
  margin: auto;
  padding: 3em;
  display: flex;
  justify-content: space-between;
}

.card {
  flex: 1;
  text-align: center;
  /* background-color: aliceblue; */
  max-width: 24%;
  min-height: 240px;
  box-shadow: 0px 0px 18px -8px rgba(0, 0, 0, 0.3);
}

.card__image-wrap {
  height: 120px;
  outline: 1px solid #eee;
  background: #eee;
}

.card__title {
  font-size: 18px;
  text-align: left;
  padding: 12px;
  font-weight: bold;
}

.card__text-content {
  text-align: left;
  padding: 12px 12px 30px;
}
</style>
<script>
const loadData = function({ api, cacheVersion, errorCallback, version, path }) {
  return api
    .get(`cdn/stories/${path}`, {
      version: version,
      cv: cacheVersion
    })
    .then(res => {
      return res.data;
    })
    .catch(res => {
      if (!res.response) {
        console.error(res);
        errorCallback({
          statusCode: 404,
          message: "Failed to receive content form api"
        });
      } else {
        console.error(res.response.data);
        errorCallback({
          statusCode: res.response.status,
          message: res.response.data
        });
      }
    });
};

export default {
  data() {
    return {
      story: { content: {} }
    };
  },
  head() {
    return {
      title: "AutismActivities.ie"
    };
  },
  mounted() {
    this.$storybridge.on(["input", "published", "change"], event => {
      if (event.action == "input") {
        if (event.story.id === this.story.id) {
          this.story.content = event.story.content;
        }
      } else if (!event.slugChanged) {
        window.location.reload();
      }
    });
  },
  asyncData(context) {
    // Check if we are in the editing mode
    let editMode = false;

    if (
      context.query._storyblok ||
      context.isDev ||
      (typeof window !== "undefined" &&
        window.localStorage.getItem("_storyblok_draft_mode"))
    ) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("_storyblok_draft_mode", "1");
        if (window.location == window.parent.location) {
          window.localStorage.removeItem("_storyblok_draft_mode");
        }
      }

      editMode = true;
    }

    let version = editMode ? "draft" : "published";
    let path = context.route.path == "/" ? "home" : context.route.path;

    // Load the JSON from the API
    return loadData({
      version: version,
      api: context.app.$storyapi,
      cacheVersion: context.store.state.cacheVersion,
      errorCallback: context.error,
      path: path
    });
  }
};
</script>
