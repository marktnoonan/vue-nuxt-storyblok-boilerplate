<template>
  <div class="search__wrap" id="search-top">
    <div
      class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md my-6"
      role="alert"
    >
      <div class="flex">
        <div class="py-1">
          <svg
            class="fill-current h-6 w-6 text-teal-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
            />
          </svg>
        </div>
        <div>
          <p class="font-bold">About these search results</p>
          <p>
            We are still working out the best way to organize this information, and what kinds of searches are most useful. Please use the
            <nuxt-link to="/feedback" class="underline">feedback form</nuxt-link> to contact us with your feedback and ideas.
          </p>
        </div>
      </div>
    </div>
    <h1 class="text-2xl mx-auto my-6 w-64 text-center font-bold">Search All Activities</h1>
    <div class="search-wrap">
      <label>
        <div class="w-64 mx-auto pb-2 text-center">Keyword:</div>
        <input
          type="text"
          v-model="searchTerm"
          class="block border rounded-lg border-gray-500 border-solid text-lg p-2 center mx-auto w-64"
        />
      </label>

      <!-- <div class="flex justify-center mt-6 flex-col sm:flex-row"> -->
      <div class="text-center">
        <label class="pt-4 block">
          <div class="pb-2">Filter by specific location:</div>
          <select
            class="border rounded border-gray-500 w-64 text-lg p-2"
            name="location"
            id="location"
            v-model="chosenLocation"
          >
            <option v-for="location in locations" :value="location" :key="location">{{location}}</option>
          </select>
        </label>
        <label class="p-4 block">
          <span>Filter by age of person:</span>
          <input
            class="border rounded border-gray-500 w-16 text-lg p-2"
            name="age"
            id="age"
            v-model="chosenAge"
            type="number"
            min="1"
          />
        </label>
        <div class="self-end w-40">
          <transition name="fade" mode="out-in">
            <button
              v-if="searchTerm.length || chosenAge.length || chosenLocation.length"
              class="md:self-end border border-blue-500 rounded my-4 px-6 block mx-auto"
              @click="clear"
            >Clear Search</button>
          </transition>
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div :key="searchTerm.length + chosenLocation.length + chosenAge.length">
        <p class="my-10 text-xl">
          Results found
          <span v-if="searchTerm.length">for "{{searchTerm}}"</span>
          <span v-if="chosenLocation.length">matching location "{{chosenLocation}}"</span>
          <span v-if="chosenLocation.length && chosenAge.length">and</span>
          <span v-if="chosenAge.length">matching age "{{chosenAge}}"</span>:
          <b>{{filteredResults.length}}</b>
        </p>
        <!-- <div class="results__wrap" v-if="searchTerm.length">
          <article
            class="results-card__wrap feature p-2 text text-base leading-tight my-6 border border-solid"
            v-for="(item, i) in filteredResults"
            :key="item.Name + i"
          >
            <ResultsCard :item="item" />
          </article>
        </div>-->
        <h2 class="text-2xl">In your area:</h2>
        <div class="categories__wrap">
          <details
            class="feature p-2 text text-lg text-base leading-tight my-6 border border-solid"
            v-for="region in regions"
            v-show="filteredResults.find(item => item.Region == region)"
            :key="region"
            :style="{
          outline: '1px solid ' + colors[region.split(' ')[0]] || 'royalbue',
          padding: '14px',
          display: 'block',
        }"
          >
            <summary>{{region || "No Region"}} ({{filteredResults.filter(item => item.Region == region).length}} result{{filteredResults.filter(item => item.Region == region).length > 1 ? 's' : ''}})</summary>
            <div
              class="results-card__wrap feature p-2 text text-base leading-tight my-6 border border-solid"
              v-for="(item, i) in filteredResults"
              v-show="item.Region == region"
              :key="item.Name + i"
            >
              <ResultsCard v-if="item.Region == region" :item="item" @searchFromClick='searchFromClick'/>
            </div>
          </details>
        </div>
        <h2 class="text-2xl mt-16 block">All around the country:</h2>
        <div class="categories__wrap">
          <details
            class="feature p-2 text text-lg text-base leading-tight my-6 border border-solid"
            v-for="region in ['', 'Nationwide']"
            v-show="filteredResults.find(item => item.Region == region)"
            :key="region"
            :style="{
          outline: '1px solid ' + colors[region.split(' ')[0]] || 'royalbue',
          padding: '14px',
          display: 'block',
        }"
          >
            <summary>{{region || "No Region"}} ({{filteredResults.filter(item => item.Region == region).length}} result{{filteredResults.filter(item => item.Region == region).length > 1 ? 's' : ''}})</summary>
            <div
              class="results-card__wrap feature p-2 text text-base leading-tight my-6 border border-solid"
              v-for="(item, i) in filteredResults"
              v-show="item.Region == region"
              :key="item.Name + i"
            >
              <ResultsCard v-if="item.Region == region" :item="item" />
            </div>
          </details>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import scrollToElement from "scroll-to-element";
import ResultsCard from "./ResultsCard";

export default {
  props: ["blok"],
  components: {
    ResultsCard
  },
  data() {
    return {
      searchTerm: "",
      chosenLocation: "",
      chosenAge: "",
      results: [],
      fuse: null,
      colors: {
        Group: "lightgreen",
        Support: "pink",
        Activity: "rebeccapurple",
        Autism: "royalblue",
        "Autism-friendly": "royalblue",
        Other: "#ccc",
        Accomodation: "teal",
        Event: "#cd00ff",
        Healthcare: "red"
      },
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
      categories: [],
      regions: ["Connacht", "Ulster", "Munster", "Leinster"],
      items: [
        {
          Name: "Radisson Sligo",
          Category: "Accomodation",
          Organisation: "Radisson",
          "Member only?": "n",
          Banner: "Sensory room",
          "Event details": "Bedroom with sensory lights and toys",
          "Cost €": "",
          When: "",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Connacht",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.radissonhotels.com/en-us/hotels/radisson-blu-sligo-spa?checkInDate=2019-11-01&checkOutDate=2019-11-02&adults%5B%5D=1&children%5B%5D=0&searchType=lowest&promotionCode=",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Clayton Sligo",
          Category: "Accomodation",
          Organisation: "Clayton Hotels",
          "Member only?": "n",
          Banner: "Sensory room",
          "Event details":
            "Sensory room in hotel with calming lights, fidget toys etc, accessible by code",
          "Cost €": "",
          When: "",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "Clayton Hotel, Clarion Road, Sligo, F91 N8EF",
          Region: "Connacht",
          "Address 4": "Clayton Hotel,",
          "Address 3": "Clarion Road,",
          "Address 2": "Sligo,",
          "Address 1": "",
          "": "",
          Postcode: "F91 N8EF",
          "Website/Facebook":
            "https://www.claytonhotelsligo.com/leisure/sensory-room/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Clonakilty Park Hotel",
          Category: "Accomodation",
          Organisation: "Clonakility Park Hotel",
          "Member only?": "n",
          Banner: "Autism-friendly hotel",
          "Event details": "Sensory box, social stories, staff training",
          "Cost €": "",
          When: "",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS":
            "Clonkilty Park Hotel, Park Road, Clonakilty, Co Cork, P85 RD23",
          Region: "Munster",
          "Address 4": "Clonkilty Park Hotel,",
          "Address 3": "Park Road,",
          "Address 2": "Clonakilty,",
          "Address 1": "Co Cork,",
          "": "",
          Postcode: "P85 RD23",
          "Website/Facebook":
            "https://www.clonakiltyparkhotel.ie/autism-friendly.html",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Ballynoe House",
          Category: "Accomodation",
          Organisation: "Ballynoe House",
          "Member only?": "N",
          Banner: "Sensory box, engagement on how to best accomodate families",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "Ballynoe House HotelDunowenArdfieldClonakilty",
          Region: "Munster",
          "Address 4": "Ballynoe House Hotel",
          "Address 3": "Dunowen",
          "Address 2": "Ardfield",
          "Address 1": "Clonakilty",
          "": "Co Cork",
          Postcode: "",
          "Website/Facebook":
            "https://ballynoehouse.ie/autism-friendly-accommodation-environment/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Prism Teen Youth",
          Category: "Activity",
          Organisation: "Prism",
          "Member only?": "CHK",
          Banner: "Weekly teen youth group",
          "Event details": "",
          "Cost €": "TBC",
          When: "Weekly",
          Age: "13+",
          "Age sorting": "13, 14, 15, 16, 17, 18, 19",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Freedom Surf School",
          Category: "Activity",
          Organisation: "Freedom Surf School",
          "Member only?": "N",
          Banner: "Surf Lessons",
          "Event details":
            "Private surf lessons with ASD friendly instructors, parents must stay and are welcome to join in the water",
          "Cost €": 100,
          When: "As booked",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "The Gap, Riverstown, Tramore, Waterford, X91 Y436",
          Region: "Munster",
          "Address 4": "The Gap,",
          "Address 3": "Riverstown,",
          "Address 2": "Tramore,",
          "Address 1": "Waterford,",
          "": "",
          Postcode: "X91 Y436",
          "Website/Facebook": "www.freedomsurfschool.com",
          "Tel:": 353863914908,
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "High Rise",
          Category: "Activity",
          Organisation: "High Rise",
          "Member only?": "N",
          Banner: "Adventure Centre",
          "Event details": "Climbing, sensory room, quiet room, soft play",
          "Cost €": "Varies by activity",
          When: "Monday to Saturday 10am to 9pm, Sunday 10am to 6pm",
          Age: "All, up to 8 for Softplay",
          "Age sorting": "2, 3, 4, 5, 6, 7, 8",
          "Special notes": "",
          "FULL ADDRESS":
            "11A Altona Road, Blaris Industrial Estate, Lisburn, Antrim, BT27 5QB",
          Region: "Ulster",
          "Address 4": "11A Altona Road,",
          "Address 3": "Blaris Industrial Estate,",
          "Address 2": "Lisburn,",
          "Address 1": "Antrim,",
          "": "",
          Postcode: "BT27 5QB",
          "Website/Facebook": "https://highriseni.org/",
          "Tel:": 442892636195,
          "Contact name": "Adam Louden",
          "Contact details": "",
          "Follow up": "email follow to LinkedIn outreach"
        },
        {
          Name: "Longford Swimming",
          Category: "Activity",
          Organisation: "MWB Longford",
          "Member only?": "CHK",
          Banner: "Swimming and inflatables",
          "Event details": "Swimming session with large inflatable in pool",
          "Cost €": "",
          When: "TBC",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Longford,",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "Longford,",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Longord Christmas Party",
          Category: "Activity",
          Organisation: "MWB Longford",
          "Member only?": "CHK",
          Banner: "Christmas Party",
          "Event details": "Annual Christmas party",
          "Cost €": "TBC",
          When: "14 December 2019",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "call Michael 087 9877 342",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "call Michael 087 9877 342",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Alongside Social",
          Category: "Activity",
          Organisation: "Baldoyle Family Resource Services Group",
          "Member only?": "N",
          Banner: "Social group for children and families",
          "Event details": "Sensory toys, parent support, siblings welcome",
          "Cost €": "€2 per family",
          When: "Thursdays 2.45pm to 4.30pm during term time",
          Age: "Approx 4-8",
          "Age sorting": "4, 5, 6, 7, 8",
          "Special notes": "",
          "FULL ADDRESS":
            "Baldoyle Family Resource Services, Grange Road, Dublin 13, Dublin, D13 TE80",
          Region: "Leinster",
          "Address 4": "Baldoyle Family Resource Services,",
          "Address 3": "Grange Road,",
          "Address 2": "Dublin 13,",
          "Address 1": "Dublin,",
          "": "",
          Postcode: "D13 TE80",
          "Website/Facebook":
            "https://www.facebook.com/baldoylefamilyresourcecentre/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Cul Camp",
          Category: "Activity",
          Organisation: "Wexford GAA",
          "Member only?": "N",
          Banner: "GAA skills",
          "Event details": "GAA skills, siblings welcome, parents must stay",
          "Cost €": "Free",
          When: "1130 to 1300 from Aug 6 to Aug 8 2019",
          Age: "5 to 14",
          "Age sorting": "5, 6, 7, 8, 9, 10, 11, 12, 13, 14",
          "Special notes": "",
          "FULL ADDRESS":
            "Innovate Wexford Park, Clonard Road, Wexford, Y35 RT91",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "Innovate Wexford Park,",
          "Address 2": "Clonard Road,",
          "Address 1": "Wexford,",
          "": "",
          Postcode: "Y35 RT91",
          "Website/Facebook":
            "https://www.eventbrite.ie/e/cul-camp-for-kids-on-the-autism-spectrum-tickets-64062356232#",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Bounce-a-Lot",
          Category: "Activity",
          Organisation: "Bounce-a-Lot",
          "Member only?": "N",
          Banner: "Bouncy castle park",
          "Event details":
            "Closed session for special needs, siblings welcome, parents must stay",
          "Cost €": 7,
          When:
            "11 to 12 on occasional Sundays, will be updated as new dates are announced",
          Age: "4 to 12",
          "Age sorting": "4, 5, 6, 7, 8, 9, 10, 11, 12",
          "Special notes": "",
          "FULL ADDRESS": "Dublin Road, Ballyoulster, Celbridge, Kildare,",
          Region: "Leinster",
          "Address 4": "Dublin Road,",
          "Address 3": "Ballyoulster,",
          "Address 2": "Celbridge,",
          "Address 1": "Kildare,",
          "": "",
          Postcode: "",
          "Website/Facebook": "https://www.facebook.com/Celbridgefootball/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Bounce-a-Lot/KAN",
          Category: "Activity",
          Organisation: "Kildare Autism Network",
          "Member only?": "N",
          Banner: "Bouncy castle park",
          "Event details":
            "Closed session for special needs organised by Kildare Autism Network, siblings welcome, parents must stay",
          "Cost €": "7 for non members, 5 for KAN members",
          When:
            "10 to 1130 on occassional Sundays, will be updated as new dates announced",
          Age: "4 to 12",
          "Age sorting": "4, 5, 6, 7, 8, 9, 10, 11, 13",
          "Special notes": "",
          "FULL ADDRESS": "Dublin Road, Ballyoulster, Celbridge, Kildare",
          Region: "Leinster",
          "Address 4": "Dublin Road,",
          "Address 3": "Ballyoulster,",
          "Address 2": "Celbridge,",
          "Address 1": "Kildare",
          "": "",
          Postcode: "",
          "Website/Facebook": "https://www.facebook.com/Celbridgefootball/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Liquid Therapy Summer",
          Category: "Activity",
          Organisation: "Liquid Therapy",
          "Member only?": "N",
          Banner: "Surf lessons for children with autism",
          "Event details":
            "Group surfing lessons, run over a week in Rossnowlagh or Bundoran. Spots are allocated on a first come first serve basis",
          "Cost €": "Free",
          When: "2020 dates to be announced, usually over July/August",
          Age: "5 to 16",
          "Age sorting": "5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16",
          "Special notes": "",
          "FULL ADDRESS": "Strand, Bundoran, Donegal, F94HK72",
          Region: "Ulster",
          "Address 4": "",
          "Address 3": "Strand,",
          "Address 2": "Bundoran,",
          "Address 1": "Donegal,",
          "": "",
          Postcode: "F94HK72",
          "Website/Facebook": "https://www.liquidtherapy.ie",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Jumpzone Liffey Valley",
          Category: "Activity",
          Organisation: "Jumpzone",
          "Member only?": "N",
          Banner: "Trampolining",
          "Event details":
            "Closed session for children with autism, parents must stay",
          "Cost €": 10,
          When: "Thursdays 6.30pm to 7.30pm",
          Age: "",
          "Age sorting": "5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS":
            "Liffey Valley Shopping Centre, Fonthill Road, Palmerstown Upr, Dublin 22,",
          Region: "Leinster",
          "Address 4": "Liffey Valley Shopping Centre,",
          "Address 3": "Fonthill Road,",
          "Address 2": "Palmerstown Upr,",
          "Address 1": "Dublin 22,",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "KonfidentKidz",
          Category: "Activity",
          Organisation: "KonfidentKidz",
          "Member only?": "Y",
          Banner: "Confidence building",
          "Event details": "Drama and role play to build confidence",
          "Cost €": "",
          When: "",
          Age: "4+",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Clogheenavodig, Gurteenomahon, Cork",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "Clogheenavodig,",
          "Address 2": "Gurteenomahon,",
          "Address 1": "Cork",
          "": "",
          Postcode: "",
          "Website/Facebook": "https://konfidentkidz.ie/seo/asd-classes/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Autcraft",
          Category: "Activity",
          Organisation: "Autcraft",
          "Member only?": "N",
          Banner: "Minecraft",
          "Event details":
            "Minecraft environment of families with autism, Familes are assessed first, must own web version of Minecraft",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Nationwide",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "https://www.autcraft.com/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "JumpBox",
          Category: "Activity",
          Organisation: "JumpBox",
          "Member only?": "N",
          Banner: "Trampolining",
          "Event details":
            "Inclusion jump sessions with low music and quieter environment. Parent/carer supervision required",
          "Cost €": "",
          When:
            "6pm to 7pm on Thursdays and 12 pm to 1pm on Sundays, hours can change during school holidays",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "JumpBox, 4 Waringsford Road, Banbridge, Down, BY32 4EH",
          Region: "Ulster",
          "Address 4": "JumpBox,",
          "Address 3": "4 Waringsford Road,",
          "Address 2": "Banbridge,",
          "Address 1": "Down,",
          "": "",
          Postcode: "BY32 4EH",
          "Website/Facebook": "http://www.jumpboxxni.co.uk/InclusionJump",
          "Tel:": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Newry swimming",
          Category: "Activity",
          Organisation: "Newry Leisure Centre",
          "Member only?": "N",
          Banner: "Swimming",
          "Event details":
            "Swimming sessions with reduced numbers in pool and fun floats",
          "Cost €": "",
          When: "",
          Age:
            "All, but adults must accompany on a 1 to 1 basis for under fours and 1 to two basis if at least one child is over four",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "Newry Leisure Centre, Cecil Street, Newry, Down, BT35 6AU",
          Region: "Ulster",
          "Address 4": "Newry Leisure Centre,",
          "Address 3": "Cecil Street,",
          "Address 2": "Newry,",
          "Address 1": "Down,",
          "": "",
          Postcode: "BT35 6AU",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name":
            "https://www.newrymournedown.org/media/uploads/autisim_friendly_session_dlc_information_september_2019_(002).pdf",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Newry trampolining",
          Category: "Activity",
          Organisation: "Newry Leisure Centre",
          "Member only?": "N",
          Banner: "Trampolining",
          "Event details": "Trampoline",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "Newry Leisure Centre, Cecil Street, Newry, Down, BT35 6AU",
          Region: "Ulster",
          "Address 4": "Newry Leisure Centre,",
          "Address 3": "Cecil Street,",
          "Address 2": "Newry,",
          "Address 1": "Down,",
          "": "",
          Postcode: "BT35 6AU",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Clonmel Sensory Playground",
          Category: "Activity",
          Organisation: "South Tipperary Autism Group",
          "Member only?": "N",
          Banner: "Sensory playground",
          "Event details": "",
          "Cost €": "Free",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Best o Matz",
          Category: "Activity",
          Organisation: "Best O Matz",
          "Member only?": "N",
          Banner: "Play centre with sensory room",
          "Event details": "",
          "Cost €": "",
          When:
            "Tuesday 12pm to 5.30pm, Wednesday 10am to 5.30pm, Thursday 12pm to 5.30pm, Friday 10am to 6pm, Saturday 10am to 6pm, Sunday 10am to 6pm",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "Best O Matz, Unit N Kells Business Park, Kells, Meath,",
          Region: "Leinster",
          "Address 4": "Best O Matz,",
          "Address 3": "Unit N Kells Business Park,",
          "Address 2": "Kells,",
          "Address 1": "Meath,",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.bestomatz.ie/sensory-room.asp",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Sensational Kids",
          Category: "Activity",
          Organisation: "Sensational Kids",
          "Member only?": "N",
          Banner: "Play therapy, reading therapy and sensory store",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "Paula Mac Aodghagain",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Watch House Cross Library",
          Category: "Activity",
          Organisation: "Watch House Cross Community Library",
          "Member only?": "N",
          Banner: "Sensory room",
          "Event details": "Sensory room in library",
          "Cost €": "Free",
          When:
            "10.30am to 4.30pm Wed, Fri, Sat, 10.30 to 6pm Tues, Thurs, bookable for half hour slots",
          Age: "All, including adults",
          "Age sorting": "",
          "Special notes":
            "Bookable for 30 min sessions by phonining 061 557726",
          "FULL ADDRESS":
            "Watch House Cross Community Library, Watch House Cross Shopping CentreKileely RoadLimerickV94 NH51",
          Region: "Munster",
          "Address 4": "Watch House Cross Community Library,",
          "Address 3": "Watch House Cross Shopping Centre",
          "Address 2": "Kileely Road",
          "Address 1": "Limerick",
          "": "",
          Postcode: "V94 NH51",
          "Website/Facebook":
            "http://www.limerickcity.ie/Library/WatchHouseCrossCommunityLibrary/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Surf2Heal Garretstown",
          Category: "Activity",
          Organisation: "Suft2Heal",
          "Member only?": "N",
          Banner: "Surfing camps and lessons on Garretstown beach, Kinsale",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.facebook.com/pg/Surf2Heal-Gtown-297334447472914/posts/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Inflatazone",
          Category: "Activity",
          Organisation: "Inflatazone",
          "Member only?": "Y",
          Banner: "Closed sensory sessions at giant inflatable playzone",
          "Event details": "Closed sessions for children with sensory needs",
          "Cost €": "",
          When:
            "6.30pm to 7.30pm October 17, other dates to be added as announced",
          Age: "4 to 12",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "Nangor Road Business ParkNangor Road, Dublin 12DublinD12 TNY6",
          Region: "Leinster",
          "Address 4": "Nangor Road Business Park",
          "Address 3": "Nangor Road,",
          "Address 2": "Dublin 12",
          "Address 1": "Dublin",
          "": "",
          Postcode: "D12 TNY6",
          "Website/Facebook": "https://inflatazone.ie/jump-zone-autism/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Open Spectrum Teen group",
          Category: "Activity",
          Organisation: "Open Spectrum",
          "Member only?": "Y",
          Banner: "Teen Group",
          "Event details":
            "Teen group meeting monthly in the South County Dublin area, activities and venues vary by month",
          "Cost €": "varies depending on activity",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "varies",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "varies",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "A Special Day Celbridge",
          Category: "Activity",
          Organisation: "A Special Day",
          "Member only?": "N",
          Banner: "Social group",
          "Event details":
            "Sensory play, art, baking, singing, stories and other activities",
          "Cost €": "TBC",
          When: "10am to 12pm on Saturdays",
          Age: "TBC",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Celbridge Community Centre, CelbridgeCo Kildare",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "Celbridge Community Centre,",
          "Address 2": "Celbridge",
          "Address 1": "Co Kildare",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "A Special Day Dunboyne",
          Category: "Activity",
          Organisation: "A Special Day",
          "Member only?": "N",
          Banner: "Social group",
          "Event details":
            "Sensory play, art, baking, singing, stories and other activities",
          "Cost €": "TBC",
          When: "4.30pm to 5.30pm on Thursdays",
          Age: "TBC",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "St Peter's GAA HallDunboyneCo Meath",
          Region: "Leinster",
          "Address 4": "St Peter's GAA Hall",
          "Address 3": "",
          "Address 2": "Dunboyne",
          "Address 1": "Co Meath",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "A Special Day Kilcock",
          Category: "Activity",
          Organisation: "A Special Day",
          "Member only?": "N",
          Banner: "Social group",
          "Event details":
            "Sensory play, art, baking, singing, stories and other activities",
          "Cost €": "TBC",
          When: "7pm to 8pm on Thursdays",
          Age: "TBC",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Kilocck GAA clubKilcockCo Kildare",
          Region: "Leinster",
          "Address 4": "Kilocck GAA club",
          "Address 3": "",
          "Address 2": "Kilcock",
          "Address 1": "Co Kildare",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "A Special Day Raheny",
          Category: "Activity",
          Organisation: "A Special Day",
          "Member only?": "N",
          Banner: "Social group",
          "Event details":
            "Sensory play, art, baking, singing, stories and other activities",
          "Cost €": "TBC",
          When: "10am to 11am on Saturdays",
          Age: "TBC",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "The Grange Woodbine ClubRahenyCo Dublin",
          Region: "Leinster",
          "Address 4": "The Grange Woodbine Club",
          "Address 3": "",
          "Address 2": "Raheny",
          "Address 1": "Co Dublin",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "A Special Day Dunboyne LifeSkills",
          Category: "Activity",
          Organisation: "A Special Day",
          "Member only?": "N",
          Banner: "Life skills",
          "Event details": "Road safety, personal care, shop skills and others",
          "Cost €": "TBC",
          When: "5.30pm to 6.30pm on Thursdays",
          Age: "TBC",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "St Peter's GAA HallDunboyneCo Meath",
          Region: "Leinster",
          "Address 4": "St Peter's GAA Hall",
          "Address 3": "",
          "Address 2": "Dunboyne",
          "Address 1": "Co Meath",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Kidzcraft",
          Category: "Activity",
          Organisation: "Kidzcraft",
          "Member only?": "N",
          Banner: "Social Group",
          "Event details": "Sensory play, art, social skills",
          "Cost €": "TBC",
          When: "Three sessions on Saturdays xx x",
          Age: "TBC",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Saplings National SchoolKillCo Kildare",
          Region: "Leinster",
          "Address 4": "Saplings National School",
          "Address 3": "",
          "Address 2": "Kill",
          "Address 1": "Co Kildare",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Helping Hands",
          Category: "Activity",
          Organisation: "Helping Hands",
          "Member only?": "N",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "Autism Resource CentreMillars LaneDundonaldCo DownBT 16 2DA",
          Region: "Ulster",
          "Address 4": "Autism Resource Centre",
          "Address 3": "Millars Lane",
          "Address 2": "Dundonald",
          "Address 1": "Co Down",
          "": "",
          Postcode: "BT 16 2DA",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Snowflakes Autism Support Horse-riding",
          Category: "Activity",
          Organisation: "Snowflakes Autism Support",
          "Member only?": "Y",
          Banner: "Horse-riding",
          "Event details":
            "Horse-riding lessons at theraputic riding centre for children autism, parents must stay",
          "Cost €": "TBC",
          When:
            "3.15pm to 4.15pm on Saturdays for five weeks in Oct/Nov, tuesdays 4.30pm to 5.30pm for five week term in October/November",
          Age: "4 plus",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Corballis Theraputic Riding CentreDonabateCo Dublin",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "Corballis Theraputic Riding Centre",
          "Address 2": "Donabate",
          "Address 1": "Co Dublin",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.facebook.com/pg/Snowflakesautismsupport/events/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Snowflakes Autism Support Swimming",
          Category: "Activity",
          Organisation: "Snowflakes Autism Support",
          "Member only?": "Y",
          Banner: "Swimming",
          "Event details": "Swimming lessons for children with autism",
          "Cost €": "TBC",
          When: "7pm to 8pm on Mondays from 9th September to 28th October",
          Age: "4 plus",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "St Michael's House Leisure Centre & Swimming PoolBelcamp LaneBelcampDublin 17",
          Region: "Leinster",
          "Address 4": "St Michael's House Leisure Centre & Swimming Pool",
          "Address 3": "Belcamp Lane",
          "Address 2": "Belcamp",
          "Address 1": "Dublin 17",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.facebook.com/pg/Snowflakesautismsupport/events/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Snowflakes Autism Support wall-climbing",
          Category: "Activity",
          Organisation: "Snowflakes Autism Support",
          "Member only?": "Y",
          Banner: "Wall climbing",
          "Event details":
            "Wall climbing in small groups for children with autism",
          "Cost €": "5 weeks for 70",
          When: "4pm to 5pm on Wednesdays for five weeks from October 16",
          Age: "6 plus",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "North ParkNorth RoadKildonanDublin 11Awesome Walls Dublin",
          Region: "Leinster",
          "Address 4": "North Park",
          "Address 3": "North Road",
          "Address 2": "Kildonan",
          "Address 1": "Dublin 11",
          "": "",
          Postcode: "Awesome Walls Dublin",
          "Website/Facebook":
            "https://www.facebook.com/pg/Snowflakesautismsupport/events/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Snowflakes Autism Support speech & drama",
          Category: "Activity",
          Organisation: "Snowflakes Autism Support",
          "Member only?": "Y",
          Banner: "Speech & Drama",
          "Event details": "Speech & drama lessons for children with autism",
          "Cost €": "5 weeks for 50",
          When: "4.30pm to 5.30pm on Fridays from Nov 8th for five weeks",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Holywell Community Centre",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "Holywell Community Centre",
          "Website/Facebook":
            "https://www.facebook.com/pg/Snowflakesautismsupport/events/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Snowflakes Autism Support sensory play",
          Category: "Activity",
          Organisation: "Snowflakes Autism Support",
          "Member only?": "Y",
          Banner: "Sensory play Saturdays",
          "Event details":
            "Whizzy dizzies, ball pit, balancing tools, sensory play mats, liquid tiles and more, siblings welcome",
          "Cost €": "Free",
          When: "10am to 11.30am Saturdays",
          Age: "under 10s",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "?",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "?",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Snowflakes Autism Support messy play",
          Category: "Activity",
          Organisation: "Snowflakes Autism Support",
          "Member only?": "Y",
          Banner: "Messy play",
          "Event details":
            "Finger painting, sand play, jelly bags, rainbow spaghetti and more",
          "Cost €": "8 per child per session, or 21 for term of tree",
          When:
            "10.30am to 11.30am Saturday Sept 7, Oct 12, Nov 16, more dates to be added as announced",
          Age: "?",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "County Library Tallaght",
          Category: "Activity",
          Organisation: "County Library Tallaght",
          "Member only?": "N",
          Banner: "ASD-friendly Lego workshop",
          "Event details": "",
          "Cost €": "Free",
          When: "3pm Sat Nov 2",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "County Library TallaghtLibrary SquareTallaghtDublin 24D24 A3EX",
          Region: "Leinster",
          "Address 4": "County Library Tallaght",
          "Address 3": "Library Square",
          "Address 2": "Tallaght",
          "Address 1": "Dublin 24",
          "": "",
          Postcode: "D24 A3EX",
          "Website/Facebook":
            "https://www.eventbrite.ie/o/county-library-tallaght-dublin-24-4238480120",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "County Library Tallaght",
          Category: "Activity",
          Organisation: "County Library Tallaght",
          "Member only?": "N",
          Banner: "Yoga workshop",
          "Event details":
            "Yoga workshop for children with additional needs and their parents",
          "Cost €": "Free",
          When: "2.30pm Nov 23",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "County Library TallaghtLibrary SquareTallaghtDublin 24D24 A3EX",
          Region: "Leinster",
          "Address 4": "County Library Tallaght",
          "Address 3": "Library Square",
          "Address 2": "Tallaght",
          "Address 1": "Dublin 24",
          "": "",
          Postcode: "D24 A3EX",
          "Website/Facebook":
            "https://www.eventbrite.ie/o/county-library-tallaght-dublin-24-4238480121",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema Cavan",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "11.30am one Sunday per month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Ulster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema Coolock",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "11.30am one Sunday per month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema Kilmarnock",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "11.30am one Sunday per month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema Limerick",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "11.30am one Sunday per month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema Naas",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "11.30am one Sunday per month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema Newark",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "11.30am one Sunday per month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema Stillorgan",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "11.30am one Sunday per month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema The Point",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "11.30am one Sunday per month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Odeon Cinema Blanchardstown",
          Category: "Activity",
          Organisation: "Odeon Cinema",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details":
            "Cinema screenings with low level lighting, lower sounds, no trailers or advertising and allowances for increased levels of movement and noise from audience",
          "Cost €": "",
          When: "Monday evenings",
          Age: "More mature audience",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.odeoncinemas.ie/accessibility/autism-friendly-cinema-screenings/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA Swimming",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Swimming",
          "Event details": "Swimming lessons for children with autism",
          "Cost €": "",
          When: "Six or seven week blocks, with the school calendar",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Splashworld",
          Region: "Munster",
          "Address 4": "Splashworld",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.wassa.ie/activities/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA Playcentre",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Play centre sessions",
          "Event details":
            "Closed sessions at indoor play centre, siblings welcome",
          "Cost €": "5 including food",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Runamuck",
          Region: "Munster",
          "Address 4": "Runamuck",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.wassa.ie/activities/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA  bounce",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Bouncy castle park",
          "Event details": "Closed sessions at bouncing session",
          "Cost €": "5 including food",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Megabounce",
          Region: "Munster",
          "Address 4": "Megabounce",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.wassa.ie/activities/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA Horse-riding",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Horse-riding lessons",
          "Event details": "",
          "Cost €": 10,
          When: "Saturdays 4pm to 4.30pm and 4.30pm to 5pm",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Kilotteran Equitation Centre",
          Region: "Munster",
          "Address 4": "Kilotteran Equitation Centre",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.wassa.ie/activities/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA Art classes",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Art classes",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.wassa.ie/activities/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA Surfing",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Surfing",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.wassa.ie/activities/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA Cookery",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Cookery",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.wassa.ie/activities/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA Panto",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Panto",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "http://www.wassa.ie/activities/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA Siblings club",
          Category: "Activity",
          Organisation: "WASSA",
          "Member only?": "Y",
          Banner: "Siblings group",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Omniplex Tralee",
          Category: "Activity",
          Organisation: "Omniplex",
          "Member only?": "N",
          Banner: "Cinema",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "SuperValu",
          Category: "Autism Friendly",
          Organisation: "SuperValu",
          "Member only?": "N",
          Banner: "Autism friendly shopping",
          "Event details": "n/a",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Nationwide",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Sensory Me",
          Category: "Autism Friendly",
          Organisation: "Roscommon",
          "Member only?": "N",
          Banner: "Sensory play",
          "Event details": "Sensory play including lego therapy",
          "Cost €": "TBC",
          When:
            "Thursdays 2-6pm; Fridays 2-6pm, Saturdays 10am-2pm, Sunday 11am-2pm, plus other times by arrangement",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Goff Street, Roscommon, F42W928",
          Region: "Connacht",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "Goff Street,",
          "Address 1": "Roscommon,",
          "": "",
          Postcode: "F42W928",
          "Website/Facebook": "https://www.facebook.com/sensorymeireland/",
          "Tel:": "",
          "Contact name": "suggestion",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Shannon Airport",
          Category: "Autism Friendly",
          Organisation: "Shannon Airport",
          "Member only?": "n/a",
          Banner: "Sensory room and assistance",
          "Event details": "Sensory Room and assistance through airport",
          "Cost €": "Free",
          When: "During airport operating hours",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Shannon, Clare, V14EE06",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "Shannon,",
          "Address 1": "Clare,",
          "": "",
          Postcode: "V14EE06",
          "Website/Facebook":
            "https://www.shannonairport.ie/passengers/at-the-airport/flying-out/passenger-assistance/autism-special-needs/",
          "Tel:": "",
          "Contact name": "Orla",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Dublin Airport",
          Category: "Autism Friendly",
          Organisation: "Dublin Airport",
          "Member only?": "n/a",
          Banner: "Sensory Room and assistance",
          "Event details": "Sensory Room and assistance through airport",
          "Cost €": "Free",
          When: "During airport operating hours",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Dublin Airport, Dublin, K67 V8P7",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "Dublin Airport,",
          "Address 1": "Dublin,",
          "": "",
          Postcode: "K67 V8P7",
          "Website/Facebook":
            "https://www.dublinairport.com/at-the-airport/help-and-support/travelling-with-autism",
          "Tel:": "",
          "Contact name": "Siobhan",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "w5",
          Category: "Autism Friendly",
          Organisation: "",
          "Member only?": "N",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Belfast",
          Region: "Ulster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "Belfast",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Tayto Park",
          Category: "Autism Friendly",
          Organisation: "Tayto Park",
          "Member only?": "N",
          Banner: "Autism-friendly theme park",
          "Event details":
            "Fast-pass queuing system, discounted tickets for carers, occassional autism-friendly days with music turned down and sensory room available",
          "Cost €": "",
          When: "Regular opening hours",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "Tayto Park, Kilbrew, Ashbourne, Co Meath, A84 EA02",
          Region: "Leinster",
          "Address 4": "Tayto Park,",
          "Address 3": "Kilbrew,",
          "Address 2": "Ashbourne,",
          "Address 1": "Co Meath,",
          "": "",
          Postcode: "A84 EA02",
          "Website/Facebook":
            "http://www.taytopark.ie/visitor-information/disability-policy",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Dublin Zoo",
          Category: "Autism Friendly",
          Organisation: "Dublin Zoo",
          "Member only?": "N",
          Banner: "Autism-friendly zoo",
          "Event details": "Carers discount",
          "Cost €": "",
          When: "",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.abettertomorrow-lidl.ie/autism-aware-store/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Lidl",
          Category: "Autism Friendly",
          Organisation: "Lidl",
          "Member only?": "N",
          Banner: "Autism-friendly shopping",
          "Event details":
            "Reduced lighting, no music or announcements, priority queuing",
          "Cost €": "",
          When: "6pm to 8pm Tuesdays",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "Lidl stores nationwide",
          Region: "Nationwide",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "Lidl stores nationwide",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.abettertomorrow-lidl.ie/autism-aware-store/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Clonakilty",
          Category: "Autism Friendly town",
          Organisation: "",
          "Member only?": "n",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Inflatazone",
          Category: "Autism-friendly",
          Organisation: "Inflatazone",
          "Member only?": "Y",
          Banner: "Giant inflatable playzone",
          "Event details":
            "Autism-friendly venue for open bouncing, carers allowed on for free, helpful staff",
          "Cost €": "",
          When: "",
          Age: "4 to 12",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "Nangor Road Business ParkNangor RoadDublin 12DublinD12 TNY6",
          Region: "Leinster",
          "Address 4": "Nangor Road Business Park",
          "Address 3": "Nangor Road",
          "Address 2": "Dublin 12",
          "Address 1": "Dublin",
          "": "",
          Postcode: "D12 TNY6",
          "Website/Facebook": "https://inflatazone.ie/jump-zone-autism/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Fettercairn Youth Horse Project",
          Category: "Autism-friendly",
          Organisation: "Fettercairn Youth Horse Riding",
          "Member only?": "N",
          Banner: "Horse-riding",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Sensory Fun with Friends Panto",
          Category: "Event",
          Organisation: "Sensory Fun with Friends",
          "Member only?": "Y",
          Banner: "Sensory-friendly Snow White",
          "Event details":
            "Quiet room for group plus sensory stories to prepare",
          "Cost €": "TBC",
          When: "6.30pm Dec 17",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "The CivicBelgard Square EastTallaghtDublin 24D24 NWN7",
          Region: "Leinster",
          "Address 4": "The Civic",
          "Address 3": "Belgard Square East",
          "Address 2": "Tallaght",
          "Address 1": "Dublin 24",
          "": "",
          Postcode: "D24 NWN7",
          "Website/Facebook":
            "http://fyhp.ie/riding-lessons/equine-assisted-learning/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Sensory Fun with Friends Frozen II",
          Category: "Event",
          Organisation: "Sensory Fun with Friends",
          "Member only?": "Y",
          Banner: "Sensory-friendly showing of Frozen II",
          "Event details": "",
          "Cost €": "",
          When: "Nov 23",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "IMC Tallaght",
          Region: "Leinster",
          "Address 4": "IMC Tallaght",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "County Library Tallaght",
          Category: "Event",
          Organisation: "County Library Tallaght",
          "Member only?": "N",
          Banner: "Sensory-friendly story time",
          "Event details":
            "Story telling incorporating assistive technology and toys",
          "Cost €": "",
          When: "10.30am Nov 2",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "County Library TallaghtLibrary SquareTallaghtDublin 24D24 A3EX",
          Region: "Leinster",
          "Address 4": "County Library Tallaght",
          "Address 3": "Library Square",
          "Address 2": "Tallaght",
          "Address 1": "Dublin 24",
          "": "",
          Postcode: "D24 A3EX",
          "Website/Facebook":
            "https://www.eventbrite.ie/o/county-library-tallaght-dublin-24-4238480119",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "County Library Tallaght",
          Category: "Event",
          Organisation: "County Library Tallaght",
          "Member only?": "N",
          Banner: "Self acceptance",
          "Event details":
            "Self acceptance for children and teenagers with hidden disabilities",
          "Cost €": "Free",
          When: "7pm Nov 19",
          Age: "Children and teenagers",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS":
            "County Library TallaghtLibrary SquareTallaghtDublin 24D24 A3EX",
          Region: "Leinster",
          "Address 4": "County Library Tallaght",
          "Address 3": "Library Square",
          "Address 2": "Tallaght",
          "Address 1": "Dublin 24",
          "": "",
          Postcode: "D24 A3EX",
          "Website/Facebook":
            "https://www.eventbrite.ie/o/county-library-tallaght-dublin-24-4238480122",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Prism",
          Category: "Group",
          Organisation: "Prism",
          "Member only?": "n/a",
          Banner: "Local autism group",
          "Event details":
            "Support group for families in Dun Laoghaire Rathdown",
          "Cost €": "",
          When: "",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "Dun Laoghaire, Dublin",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "Dun Laoghaire,",
          "Address 1": "Dublin",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "MWB Longford",
          Category: "Group",
          Organisation: "MWB Longford",
          "Member only?": "n/a",
          Banner: "Local autism group",
          "Event details": "",
          "Cost €": "TBC",
          When: "",
          Age: "tbc",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Longford",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "Longford",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "Michael, chairperson",
          "Contact details": "087 9877 342",
          "Follow up": ""
        },
        {
          Name: "Sensory Fun with Friends",
          Category: "Group",
          Organisation: "Sensory Fun with Friends",
          "Member only?": "Y",
          Banner: "Support group",
          "Event details":
            "Support group for parents of children with additional needs",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "WASSA",
          Category: "Group",
          Organisation: "WASSA",
          "Member only?": "Y 10 euro joining fee",
          Banner: "",
          "Event details": "",
          "Cost €": "10 to join",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Cork University Hospital",
          Category: "Healthcare",
          Organisation: "CUH",
          "Member only?": "N",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://www.echolive.ie/corknews/Autism-friendly-health-services-should-be-adopted-nationwide-8cee1b93-f565-45dc-ba04-00d63a514612-ds",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "MiContact",
          Category: "Other Resources",
          Organisation: "MiContact",
          "Member only?": "N",
          Banner: "App that helps people to learn to maintain eye contact",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Nationwide",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "TippyTalk",
          Category: "Other Resources",
          Organisation: "TippyTalk",
          "Member only?": "N",
          Banner: "Communication app",
          "Event details": "App that turns pictures into text messages",
          "Cost €": "99.99 a year",
          When: "",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Nationwide",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Avail",
          Category: "Other Resources",
          Organisation: "Avail",
          "Member only?": "n",
          Banner: "App to support children in every day living",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "Via Ger Heffernan, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Prism Helpline",
          Category: "Support",
          Organisation: "Prism",
          "Member only?": "CHK",
          Banner: "Helpline",
          "Event details": "Call +353 85 8292839",
          "Cost €": "Free",
          When: "1000 - 1300 Monday to Friday",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Dun Laoghaire, Dublin",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "Dun Laoghaire,",
          "Address 1": "Dublin",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Prism Meetings",
          Category: "Support",
          Organisation: "Prism",
          "Member only?": "Y",
          Banner: "Parent Support Meetings",
          "Event details": "Children can also attend meetings",
          "Cost €": "Free",
          When: "Monthly",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Dun Laoghaire, Dublin",
          Region: "Leinster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "Dun Laoghaire,",
          "Address 1": "Dublin",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Alongside Social Clinics",
          Category: "Support",
          Organisation: "Baldoyle Family Resource Services Group",
          "Member only?": "N",
          Banner:
            "Monthly support meetings for parents of children with additional needs",
          "Event details": "Parent support",
          "Cost €": "Free",
          When: "Monthly",
          Age: "All",
          "Age sorting":
            "2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, Adult",
          "Special notes": "",
          "FULL ADDRESS":
            "Baldoyle Family Resource Services, Grange Road, Dublin 13, Dublin, D13 TE80",
          Region: "Leinster",
          "Address 4": "Baldoyle Family Resource Services,",
          "Address 3": "Grange Road,",
          "Address 2": "Dublin 13,",
          "Address 1": "Dublin,",
          "": "",
          Postcode: "D13 TE80",
          "Website/Facebook":
            "https://www.facebook.com/baldoylefamilyresourcecentre/",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Friends of Autism/ADHD",
          Category: "Support",
          Organisation: "Friends of Autism/ADHD",
          "Member only?": "",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "reached out on facebook",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Tallaght Parents Autism Support Group",
          Category: "Support",
          Organisation: "Tallaght Parents Autism Support Group",
          "Member only?": "",
          Banner: "Support group",
          "Event details":
            "Monthly support meetings for parents and caregivers",
          "Cost €": "Free",
          When: "7pm to 9pm on first Thursday of every month",
          Age: "All",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Killinarden Community Centre",
          Region: "Leinster",
          "Address 4": "Killinarden Community Centre",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Sticky Fingers",
          Category: "",
          Organisation: "",
          "Member only?": "N",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "Newry",
          Region: "Ulster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "Newry",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "Rec by Aisling Fitzmaurice, LinkedIn",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Titanic Belfast",
          Category: "",
          Organisation: "",
          "Member only?": "",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Ulster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook":
            "https://titanicbelfast.com/Site/Accessibility.aspx",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "The Rainbow Club Cork",
          Category: "",
          Organisation: "",
          "Member only?": "",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        },
        {
          Name: "Kerry Autism Action",
          Category: "Group",
          Organisation: "",
          "Member only?": "",
          Banner: "",
          "Event details": "",
          "Cost €": "",
          When: "",
          Age: "",
          "Age sorting": "",
          "Special notes": "",
          "FULL ADDRESS": "",
          Region: "Munster",
          "Address 4": "",
          "Address 3": "",
          "Address 2": "",
          "Address 1": "",
          "": "",
          Postcode: "",
          "Website/Facebook": "",
          "Tel:": "",
          "Contact name": "",
          "Contact details": "",
          "Follow up": ""
        }
      ]
    };
  },
  created() {
    let locations = this.items.map(item => [item["Address 1"]]);
    if (locations.length) {
      // using concat() instead of flat() here to avoid some nuxt error
      this.locations = new Set([].concat(...locations).sort());
    }
    let ageRanges = this.items.map(item => [item["Age sorting"]]);
    if (ageRanges.length) {
      this.ageRanges = new Set([].concat(...ageRanges).sort());
    }
    let categories = this.items.map(item => [item["Category"]]);
    if (categories.length) {
      this.categories = new Set([].concat(...categories).sort());
    }

    // let regions = this.items.map(item => [item["Region"]]);
    // if (regions.length) {
    //   this.regions = new Set([].concat(...regions).sort());
    // }
  },

  methods: {
    search() {
      this.$search(this.searchTerm, this.items, this.searchOptions).then(
        results => {
          this.results = results;
        }
      );
    },
    searchFromClick(newSearchTerm) {
      this.searchTerm = newSearchTerm;
      scrollToElement("#search-top");
    },
    clear() {
      this.searchTerm = "";
      this.chosenLocation = "";
      this.chosenAge = "";
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
      if (!this.chosenLocation.length && !this.chosenAge.length) {
        return output;
      }

      if (this.chosenLocation.length) {
        output = output.filter(result => {
          return result["Address 1"] == this.chosenLocation;
        });
      }

      if (this.chosenAge.length) {
        console.log(this.chosenAge);
        output = output
          .filter(result => {
            if (parseInt(this.chosenAge) > 18) {
              return result["Age sorting"].split(", ").includes("Adult");
            } else {
              return result["Age sorting"].split(", ").includes(this.chosenAge);
            }
          })
          .sort(function(a, b) {
            if (b["Age"] == "All") {
              return -1;
            } else {
              return 1;
            }
          });
      }
      return output;
    }
  }
};
</script>

<style>
/* .cat__Group {
  border-left: 3px solid lightgreen;
}

.cat__Support {
  border-left: 3px solid pink;
}

.cat__Activity {
  border-left: 3px solid rebeccapurple;
}

.cat__Autism,
.cat__Autism-friendly {
  border-left: 3px solid royalblue;
}

.cat__Other {
  border-left: 3px solid #ccc;
}

.cat__Accomodation {
  border-left: 3px solid teal;
}

.cat__Event {
  border-left: 3px solid #cd00ff;
}

.cat__Healthcare {
  border-left: 3px solid red;
} */

.search__wrap {
  width: 600px;
  max-width: 90vw;
  margin: 0 auto;
  margin-bottom: 600px;
}

.results-card {
  /* display: grid;
  grid-template-columns: repeat(auto-fit, minmax(166px, 1fr));
  grid-gap: 20px; */
  padding: 20px;
}

summary {
  cursor: pointer;
  padding: 10px;
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

.label {
  font-size: 0.9em;
  font-weight: 600;
  padding-top: 10px;
}

article a:hover {
  color: royalblue;
}

/* Animations*/

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>