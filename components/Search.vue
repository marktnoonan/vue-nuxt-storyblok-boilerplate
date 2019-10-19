<template>
  <div class="search__wrap" id="search-top">
    <h1 class="text-2xl mx-auto my-6 w-64 text-center font-bold">Search all activities:</h1>
    <div class="search-wrap">
      <label>
        <div class="w-64 mx-auto pb-2">Keyword:</div>
        <input
          type="text"
          v-model="searchTerm"
          class="block border rounded-lg border-gray-500 border-solid text-lg p-2 center mx-auto w-64"
        />
      </label>

      <div class="flex justify-center mt-6 flex-col sm:flex-row">
        <label class="p-4 text-center sm:text-left">
          <div class="pb-2">Filter by location:</div>
          <select
            class="border rounded border-gray-500 w-64 sm:w-auto"
            name="location"
            id="location"
            v-model="chosenLocation"
          >
            <option v-for="location in locations" :value="location" :key="location">{{location}}</option>
          </select>
        </label>
        <label class="p-4 text-center sm:text-left">
          <div class="pb-2">Filter by age range:</div>
          <select class="border rounded border-gray-500 w-64 sm:w-auto" name="age" id="age" v-model="chosenRange">
            <option v-for="range in ageRanges" :value="range" :key="range">{{range}}</option>
          </select>
        </label>
        <div class="self-end w-40">
          <transition name="fade" mode="out-in">
            <button
              v-if="searchTerm.length || chosenRange.length || chosenLocation.length"
              class="md:self-end border border-blue-500 rounded my-4 px-6 block mx-auto"
              @click="clear"
            >Clear Search</button>
          </transition>
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div :key="searchTerm.length">
        <p class="my-10 text-xl">
          Results found
          <span v-if="searchTerm.length">for "{{searchTerm}}"</span>
          <span v-if="chosenLocation.length">matching location "{{chosenLocation}}"</span>
          <span v-if="chosenLocation.length && chosenRange.length">and</span>
          <span v-if="chosenRange.length">matching age range "{{chosenRange}}"</span>:
          <b>{{filteredResults.length}}</b>
        </p>
        <article
          class="results-card__wrap feature p-2 text text-base leading-tight my-6 border border-solid"
          v-for="(item, i) in filteredResults"
          :key="item.Name + i"
        >
          <ul class="results-card">
            <li v-for="(val, key) in item" :key="key" v-show="val">
              <div class="text-xs">{{key}}</div>
              <div class="text-lg result-val">
                <a v-if="key == 'Website/Facebook'" :href="val" class="text-sm font-thin">{{val}}</a>
                <button
                  v-else-if="searchOptions.keys.includes(key)"
                  @click="searchFromClick"
                  class="clickable-val"
                >{{val}}</button>
                <span v-else>{{val}}</span>
              </div>
            </li>
          </ul>
        </article>
      </div>
      <!-- <div v-if="!searchTerm.length" :key="searchTerm.length">
        <article
          class="results-card__wrap feature p-2 text text-base leading-tight my-6 border border-solid"
          v-for="(item, i) in items"
          :key="item.Name + i"
        >
          <ul class="results-card">
            <li v-for="(val, key) in item" :key="key" v-show="val">
              <div class="text-xs text-bold">{{key}}</div>
              <div class="text-lg result-val">
                <a v-if="key == 'Website/Facebook'" :href="val" class="text-sm font-thin">{{val}}</a>
                <button
                  v-else-if="searchOptions.keys.includes(key)"
                  @click="searchTerm = val"
                  class="clickable-val"
                >{{val}}</button>
                <span v-else>{{val}}</span>
              </div>
            </li>
          </ul>
        </article>
      </div>-->
    </transition>
  </div>
</template>

<script>
import scrollToElement from 'scroll-to-element'

export default {
  props: ["blok"],
  data() {
    return {
      searchTerm: "",
      chosenLocation: "",
      chosenRange: "",
      results: [],
      fuse: null,
      allKeys: [
        "Name",
        "Category",
        "Organisation",
        "Address 1",
        "Address 2",
        "Address 3",
        "Banner/Event details"
      ],
      searchOptions: {
        keys: [
          "Name",
          "Category",
          "Organisation",
          "Address 1",
          "Address 2",
          "Address 3",
          "Banner/Event details"
        ],
        threshold: 0.4
      },
      locations: [],
      ageRanges: [],
      items: [
        {
          Name: "Misc Prism",
          Category: "Event",
          Organisation: "Prism",
          "Member only?": "CHK",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Dublin",
          "Address 2": "Dun Laoghaire",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Jen Kane-Mason, chairperson",
          "Contact details": "prismdlr@gmail.com",
          "Follow up": "Email from Jen, will add to Facebook groups etc"
        },
        {
          Name: "Prism",
          Category: "Group",
          Organisation: "Prism",
          "Member only?": "n/a",
          "Banner/Event details": "Local autism group",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Dublin",
          "Address 2": "Dun Laoghaire",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Prism Helpline",
          Category: "Support",
          Organisation: "Prism",
          "Member only?": "CHK",
          "Banner/Event details": "Helpline",
          "Activity Type 1": "00353 85 8292839",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "1000-1300 Mon-Fri",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "All",
          "Special notes": "",
          "Address 1": "Dublin",
          "Address 2": "Dun Laoghaire",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Prism Meetings",
          Category: "Support",
          Organisation: "Prism",
          "Member only?": "Y",
          "Banner/Event details": "Parent Support Meetings",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "Monthly TBC",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "All",
          "Special notes": "",
          "Address 1": "Dublin",
          "Address 2": "Dun Laoghaire",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Surf2Heal",
          Category: "Activity",
          Organisation: "Surf2Heal",
          "Member only?": "N",
          "Banner/Event details": "Surf Lessons",
          "Activity Type 1": "Sport",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "All",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "suggestion",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Freedom Surf School",
          Category: "Activity",
          Organisation: "Freedom Surf School",
          "Member only?": "N",
          "Banner/Event details": "Surf Lessons",
          "Activity Type 1": "Sport",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": 95,
          "First Date": "n/a",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "n/a",
          Age: "All",
          "Special notes": "Parents must stay",
          "Address 1": "Tramore",
          "Address 2": "Waterford",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "suggestion",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "High Rise",
          Category: "Activity",
          Organisation: "High Rise",
          "Member only?": "N",
          "Banner/Event details": "Adventure Centre",
          "Activity Type 1": "Sport",
          "Activity Type 2": "Climbing, sensory room, quiet room, soft play",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "All, up to 8 for Softplay",
          "Special notes": "",
          "Address 1": "Antrim",
          "Address 2": "Lisburn",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Adam Louden",
          "Contact details": "",
          "Follow up": "email follow to LinkedIn outreach"
        },
        {
          Name: "SuperValu",
          Category: "Shopping",
          Organisation: "SuperValu",
          "Member only?": "N",
          "Banner/Event details": "Autism friendly shopping",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Longford Swimming",
          Category: "Activity",
          Organisation: "MWB Longford",
          "Member only?": "CHK",
          "Banner/Event details": "Swimming and inflatables",
          "Activity Type 1": "Sport",
          "Activity Type 2": "Swimming session with large inflatable in pool",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "17.08.2019",
          Time: "tbc",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "tbc",
          "Special notes": "",
          "Address 1": "Longford",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "MWB Longford",
          Category: "Group",
          Organisation: "MWB Longford",
          "Member only?": "n/a",
          "Banner/Event details": "Local autism group",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "tbc",
          "Special notes": "",
          "Address 1": "Longford",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Michael, chairperson",
          "Contact details": "087 9877 342",
          "Follow up": ""
        },
        {
          Name: "Sensory Me",
          Category: "Autism Friendly",
          Organisation: "Roscommon",
          "Member only?": "N",
          "Banner/Event details": "Sensory play",
          "Activity Type 1": "Sensory",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "https://www.facebook.com/sensorymeireland/",
          "Contact name": "suggestion",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Shannon Airport",
          Category: "Autism Friendly",
          Organisation: "Shannon Airport",
          "Member only?": "n/a",
          "Banner/Event details": "Sensory room and assistance",
          "Activity Type 1": "Sensory Room",
          "Activity Type 2": "Assistance through airport",
          "Activity Type 3": "",
          "Cost €": "Free",
          "First Date": "n/a",
          Time: "All",
          "Recurs?": "Y",
          "Recurring frequency": "Daily",
          "Last date": "n/a",
          Age: "",
          "Special notes": "",
          "Address 1": "Limerick",
          "Address 2": "Shannon",
          "Address 3": "",
          "Website/Facebook":
            "https://www.shannonairport.ie/passengers/at-the-airport/flying-out/passenger-assistance/autism-special-needs/",
          "Contact name": "Orla",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Dublin Airport",
          Category: "Autism Friendly",
          Organisation: "Dublin Airport",
          "Member only?": "n/a",
          "Banner/Event details": "Assistance",
          "Activity Type 1": "Assistance through airport",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "Free",
          "First Date": "n/a",
          Time: "All",
          "Recurs?": "Y",
          "Recurring frequency": "Daily",
          "Last date": "n/a",
          Age: "",
          "Special notes": "",
          "Address 1": "Dublin",
          "Address 2": "Dublin Airport",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Siobhan",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Alongside Social",
          Category: "Activity",
          Organisation: "Baldoyle Family Resource Services Group",
          "Member only?": "N",
          "Banner/Event details": "Social group for children and families",
          "Activity Type 1": "Sensory toys",
          "Activity Type 2": "Parent support",
          "Activity Type 3": "Siblings welcome",
          "Cost €": 2,
          "First Date": "02.07.2019",
          Time: "1000-1130",
          "Recurs?": "Y",
          "Recurring frequency": "Weekly",
          "Last date": "27.08.2019",
          Age: "4-8",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Alongside Social",
          Category: "Activity",
          Organisation: "Baldoyle Family Resource Services Group",
          "Member only?": "N",
          "Banner/Event details": "Social group for children and families",
          "Activity Type 1": "Sensory toys",
          "Activity Type 2": "Parent support",
          "Activity Type 3": "Siblings welcome",
          "Cost €": 2,
          "First Date": "tbc",
          Time: "after school",
          "Recurs?": "Y",
          "Recurring frequency": "Weekly",
          "Last date": "tbc",
          Age: "4-8",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Cul Camp",
          Category: "Activity",
          Organisation: "Wexford GAA",
          "Member only?": "N",
          "Banner/Event details": "GAA skills",
          "Activity Type 1": "GAA skills",
          "Activity Type 2": "Siblings welcome",
          "Activity Type 3": "",
          "Cost €": "Free",
          "First Date": "06/08/2019",
          Time: "1130-1300",
          "Recurs?": "Y",
          "Recurring frequency": "Daily",
          "Last date": "08/08/2019",
          Age: "5-14",
          "Special notes": "Parents must stay",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook":
            "https://www.eventbrite.ie/e/cul-camp-for-kids-on-the-autism-spectrum-tickets-64062356232#",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Bounce-a-Lot",
          Category: "Activity",
          Organisation: "Bounce-a-Lot",
          "Member only?": "N",
          "Banner/Event details": "Bouncy castle park",
          "Activity Type 1": "Open bounce",
          "Activity Type 2": "Siblings welcome",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "Y",
          "Recurring frequency": "varies",
          "Last date": "n/a",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Liquid Therapy",
          Category: "Activity",
          Organisation: "Liquid Therapy",
          "Member only?": "N",
          "Banner/Event details": "Surf lessons for children with autism",
          "Activity Type 1": "Surfing lessons",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "Parents must stay",
          "Address 1": "Donegal",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Jumpzone",
          Category: "Activity",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "KonfidentKidz",
          Category: "Activity",
          Organisation: "KonfidentKidz",
          "Member only?": "Y",
          "Banner/Event details": "Confidence building",
          "Activity Type 1": "Drama and role play to build confidence",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "n/a",
          Time: "various",
          "Recurs?": "Y",
          "Recurring frequency": "",
          "Last date": "",
          Age: "4+",
          "Special notes": "",
          "Address 1": "Cork",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "https://konfidentkidz.ie/seo/asd-classes/",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Autcraft",
          Category: "Activity",
          Organisation: "Autcraft",
          "Member only?": "N",
          "Banner/Event details": "Minecraft",
          "Activity Type 1": "Minecraft environment of families with autism",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes":
            "Familes are assessed first, must own web version of Minecraft",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "https://www.autcraft.com/",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Terenure Tigers",
          Category: "Activity",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Sensory Fun with Friends",
          Category: "Activity",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA",
          Category: "",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "MiContact",
          Category: "Other Resources",
          Organisation: "MiContact",
          "Member only?": "n/a",
          "Banner/Event details":
            "App that helps people to learn to maintain eye contact",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "TippyTalk",
          Category: "Other Resources",
          Organisation: "TippyTalk",
          "Member only?": "n/a",
          "Banner/Event details": "Communication app",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "JumpBox",
          Category: "Activity",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "Twice a week",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Banbridge",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Coco",
          Category: "",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "Monthly",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Newcastle",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "PeterPan",
          Category: "",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "Monthly",
          "Last date": "",
          Age: "",
          "Special notes": "Prebook",
          "Address 1": "Portadown",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "w5",
          Category: "Autism Friendly",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Belfast",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Sticky Fingers",
          Category: "",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "Monthly",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Newry",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Newry Leisure Centre",
          Category: "Activity",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "Swimming",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "Thursdays",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "Monthly",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Newry",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Newry Leisure Centre",
          Category: "Activity",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "Trampoline",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "Mondays",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "Monthly",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Newry",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Avail",
          Category: "Other Resources",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "App to support children in every day living",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "Via Ger Heffernan, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Clonakilty",
          Category: "",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Clonmel Playground",
          Category: "Activity",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "Sensory playground",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Best of Matz",
          Category: "Activity",
          Organisation: "Best of Matz",
          "Member only?": "",
          "Banner/Event details": "Play centre with sensory room",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "Meath",
          "Address 2": "Kells",
          "Address 3": "",
          "Website/Facebook": "http://www.bestomatz.ie/sensory-room.asp",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Radisson Sligo",
          Category: "Accomodation",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "Bedroom with sensory area",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Clayton Sligo",
          Category: "Accomodation",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "Sensory room in hotel",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Clonakilty Park Hotel",
          Category: "Accomodation",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "Autism-friendly hotel",
          "Activity Type 1": "Sensory box, social stories, staff training",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook":
            "https://www.clonakiltyparkhotel.ie/autism-friendly.html",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Tayto Park",
          Category: "",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Dublin Zoo",
          Category: "",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Lidl",
          Category: "",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Cork University Hospital",
          Category: "Healthcare",
          Organisation: "CUH",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook":
            "https://www.echolive.ie/corknews/Autism-friendly-health-services-should-be-adopted-nationwide-8cee1b93-f565-45dc-ba04-00d63a514612-ds",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Ballynoe House",
          Category: "Accomodation",
          Organisation: "Ballynoe House",
          "Member only?": "",
          "Banner/Event details":
            "Sensory box, engagement on how to best accomodate families",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook":
            "https://ballynoehouse.ie/autism-friendly-accommodation-environment/",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Mayo Autism Camp",
          Category: "Activity",
          Organisation: "",
          "Member only?": "",
          "Banner/Event details": "",
          "Activity Type 1": "",
          "Activity Type 2": "",
          "Activity Type 3": "",
          "Cost €": "",
          "First Date": "",
          Time: "",
          "Recurs?": "",
          "Recurring frequency": "",
          "Last date": "",
          Age: "",
          "Special notes": "",
          "Address 1": "",
          "Address 2": "",
          "Address 3": "",
          "Website/Facebook": "https://www.facebook.com/mayoautismcamp/",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        }
      ]
    };
  },
  created() {
    let locations = this.items.map(item => [
      item["Address 1"],
      item["Address 2"],
      item["Address 3"]
    ]);
    if (locations.length) {
      // using concat() instead of flat() here to avoid some nuxt error
      this.locations = new Set([].concat(...locations).sort());
    }
    let ageRanges = this.items.map(item => [item["Age"]]);
    if (ageRanges.length) {
      this.ageRanges = new Set([].concat(...ageRanges).sort());
    }
  },

  methods: {
    search() {
      this.$search(this.searchTerm, this.items, this.searchOptions).then(
        results => {
          this.results = results;
        }
      );
    },
    searchFromClick(event) {
      this.searchTerm = event.target.textContent;
      scrollToElement("#search-top");
    },
    clear() {
      this.searchTerm = "";
      this.chosenLocation = "";
      this.chosenRange = "";
    }
  },
  watch: {
    searchTerm: function() {
      this.search();
    }
  },
  computed: {
    filteredResults: function() {
      let output;

      if (!this.searchTerm.length) {
        output = this.items;
      } else {
        output = this.results;
      }
      if (!this.chosenLocation.length && !this.chosenRange.length) {
        return output;
      }

      if (this.chosenLocation.length) {
        output = output.filter(result => {
          return (
            result["Address 1"] == this.chosenLocation ||
            result["Address 2"] == this.chosenLocation ||
            result["Address 3"] == this.chosenLocation
          );
        });
      }

      if (this.chosenRange.length) {
        if (this.chosenRange != "All") {
          output = output.filter(result => {
            return result["Age"] == this.chosenRange;
          });
        }
      }

      return output;
    }
  }
};
</script>

<style>
.search__wrap {
  width: 600px;
  max-width: 90vw;
  margin: 0 auto;
}

.results-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(166px, 1fr));
  grid-gap: 20px;
  padding: 20px;
}

.results-card__wrap {
  box-shadow: 0px 0px 6px -3px rgba(0, 0, 0, 0.4);
}

.result-val {
  word-break: break-word;
}

.feature a.font-thin {
  font-weight: 200;
}

.clickable-val {
  cursor: pointer;
  color: green;
  text-align: left;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>