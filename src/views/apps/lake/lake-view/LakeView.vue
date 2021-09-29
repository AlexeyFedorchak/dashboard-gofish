<template>
  <div>
    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="lakeData === undefined"
    >
      <h4 class="alert-heading">
        Error fetching lake data
      </h4>
      <div class="alert-body">
        No lake found with this lake slug. Check
        <b-link
          class="alert-link"
          :to="{ name: 'lakes'}"
        >
          Lakes list
        </b-link>
        for other lakes.
      </div>
    </b-alert>

    <!-- Lake info -->
    <lake-details
      v-if="lakeData"
      :lake-data="lakeData"
      :photoStartUrl="VUE_APP_SERVE_URL"
    />

    <photo-slider
      v-if="lakeData"
      :lake-data="lakeData"
      :photoStartUrl="VUE_APP_SERVE_URL"
    />

    <map-box
      v-if="lakeData"
      :lake-data="lakeData"
    />
  </div>
</template>

<script>
import store from '@/store'
import router from '@/router'
import { ref, onUnmounted } from '@vue/composition-api'
import {
  BAlert,
  BLink,
} from 'bootstrap-vue'
import MapBox from './MapBox.vue'
import PhotoSlider from './PhotoSlider.vue'
import lakesStoreModule from '../lakesStoreModule'
import LakeDetails from './LakeDetails.vue'

export default {
  components: {
    LakeDetails,
    BAlert,
    BLink,
    MapBox,
    PhotoSlider,
  },
  setup() {
    const lakeData = ref(null)

    const USER_APP_STORE_MODULE_NAME = 'lake'
    const { VUE_APP_SERVE_URL } = process.env

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, lakesStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    store.dispatch('lake/fetchLake', { slug: router.currentRoute.params.slug })
      .then(response => { lakeData.value = response })
      .catch(error => {
        if (error.response.status === 404) {
          lakeData.value = undefined
        }
      })

    return {
      lakeData,
      VUE_APP_SERVE_URL,
    }
  },
}
</script>

<style>

</style>
