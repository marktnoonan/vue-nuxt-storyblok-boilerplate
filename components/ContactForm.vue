<template>
  <form v-editable="blok" class="container mx-auto max-w-lg" name="contact" method="POST" data-netlify="true">
    <label class="block">
      <span class="text-gray-700">Name</span>
      <input class="form-input mt-1 block w-full" name="name" placeholder="Jane Doe">
    </label>
    <label class="block">
      <span class="text-gray-700">Email</span>
      <input class="form-input mt-1 block w-full" type="email" name="email" placeholder="you@domain.com">
    </label>

    <div class="mt-4">
      <span class="text-gray-700">I want to:</span>
      <div class="mt-2">
        <label class="inline-flex items-center ml-6">
          <input type="radio" class="form-radio" name="accountType" value="suggest-event">
          <span class="ml-2">Suggest a new event or place</span>
        </label>
        <label class="inline-flex items-center ml-6">
          <input type="radio" class="form-radio" name="accountType" value="general-comment">
          <span class="ml-2">Make a general comment or give feedback on the site</span>
        </label>
      </div>
    </div>
    <label class="block">
      <span class="text-gray-700">Message</span>
      <textarea rows="7" class="form-input mt-1 block w-full" name="message" />
    </label>

    <div class="flex mt-6">
      <button type="submit">Submit</button>
    </div>
  </form>
</template>

<script>
export default {
  props: ['blok']
}
</script>
