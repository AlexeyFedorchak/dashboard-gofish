<template>
  <div style="width: 100%">
    <b-col md="6">
      <b-form-group label="Search" label-for="blog-edit-title" class="mb-2">
        <b-form-input
          id="blog-edit-title"
          v-model="mapSettingPost.location"
        />
      </b-form-group>

      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        class="mr-2"
        @click="searchLocation()"
      >
        Search
      </b-button>

      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        class="mr-2"
        @click="locateMe()"
      >
        Get my location
      </b-button>
    </b-col>

    <!-- end search position -->

    <!-- start Map -->

    <b-col
      cols="12"
      class="mt-50"
    >
      <b-card-code title="Add markers">
        <l-map
          :zoom="mapSet.zoom"
          :center="[mapSet.center.lat, mapSet.center.lng]"
          style="height: 500px width: 100%"
          @click="mapClick"
          @zoomend="changeMap"
          @moveend="changeMap"
          ref="map"
        >
          <l-tile-layer :url="mapSet.url" />

          <l-marker
            v-for="marker in mapSettingPost.markers"
            :key="marker.id"
            :visible="marker.visible"
            draggable
            :lat-lng="marker"
            @dragend="changeMarkerPosition"
          >
            <l-popup :content="marker.tooltip" />
            <l-tooltip :content="marker.tooltip" />
          </l-marker>

          <l-circle
            :lat-lng="myLocation"
            :radius="10"
            :color="mapSet.color"
          />
        </l-map>
      </b-card-code>
    </b-col>
  </div>
</template>

<script>
import axios from 'axios'
// import store from '@/store'
import {
  // computed,
  ref,
  reactive,
} from '@vue/composition-api'
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LCircle,
} from 'vue2-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import {
  BCol,
  BFormGroup,
  BFormInput,
  BButton,
  // BRow,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

/* eslint-disable global-require */
// eslint-disable-next-line no-underscore-dangle
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LCircle,

    BCardCode,

    // BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    lakeData: {
      type: Object,
      required: true,
    },
  },
  setup({ lakeData }, { emit }) {
    const { VUE_APP_API_LOCATION, VUE_APP_LOCATION_KEY } = process.env
    const map = ref(null)

    const currentMapSet = reactive({
      center: {
        lat: lakeData.x_coordinate_geo,
        lng: lakeData.y_coordinate_geo,
      },
      markers: [...lakeData.lake_locations],
      zoom: 10,
    })

    const mapSettingPost = reactive({
      markers: [...currentMapSet.markers],
      center: {
        lat: lakeData.x_coordinate_geo,
        lng: lakeData.y_coordinate_geo,
      },
      location: '',
    })

    const mapSet = reactive({
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      center: { ...currentMapSet.center },
      zoom: currentMapSet.zoom,
    })

    async function searchLocation() {
      const { data } = await axios.get(`${VUE_APP_API_LOCATION}?access_key=${VUE_APP_LOCATION_KEY}&query=${mapSettingPost.location}`)
      const { latitude, longitude } = await data.data.find(location => location)
      mapSet.center.lng = longitude
      mapSet.center.lat = latitude
      setTimeout(() => { mapSet.zoom = 14 }, 1000)
    }

    const myLocation = {
      lat: null,
      lng: null,
    }

    let location = null
    let gettingLocation = false
    let errorStr = null

    async function getLocation() {
      return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'))
        }

        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos)
        }, err => {
          reject(err)
        })
      })
    }

    async function locateMe() {
      gettingLocation = true
      try {
        gettingLocation = false
        location = await getLocation()

        const { longitude, latitude } = location.coords
        mapSet.zoom = 18
        setTimeout(() => {
          mapSet.center.lng = longitude
          mapSet.center.lat = latitude
          myLocation.lng = longitude
          myLocation.lat = latitude
        }, 500)
      } catch (e) {
        gettingLocation = false
        errorStr = e.message
      }
    }

    const changeMap = e => {
      // eslint-disable-next-line no-underscore-dangle
      mapSettingPost.zoom = e.target._zoom
      // eslint-disable-next-line no-underscore-dangle
      mapSet.zoom = e.target._zoom
      const { lat, lng } = e.target.getCenter()
      mapSettingPost.center = e.target.getCenter()
      mapSet.center.lat = lat
      mapSet.center.lng = lng
      emit('mapSetting', mapSettingPost)
    }

    const mapClick = e => {
      mapSettingPost.markers.push({
        ...e.latlng,
      })
      mapSettingPost.zoom = mapSet.zoom
      emit('mapSetting', mapSettingPost)
    }

    const changeMarkerPosition = () => {
      // eslint-disable-next-line no-underscore-dangle
      const markers = Object.values(map.value.mapObject._layers)
      delete mapSettingPost.markers
      mapSettingPost.markers = []
      markers.forEach(marker => {
      // eslint-disable-next-line no-underscore-dangle
        if (marker._latlng && marker.options.pane === 'markerPane') {
          const newMarker = {
            // eslint-disable-next-line no-underscore-dangle
            ...marker._latlng,
          }
          mapSettingPost.markers.push(newMarker)
        }
      })
      mapSettingPost.zoom = mapSet.zoom
      emit('mapSetting', mapSettingPost)
    }

    return {
      mapClick,
      mapSet,
      mapSettingPost,
      changeMap,
      searchLocation,
      locateMe,
      gettingLocation,
      errorStr,
      map,
      myLocation,

      changeMarkerPosition,
    }
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/quill.scss";
@import "@core/scss/vue/pages/page-blog.scss";

.vue2leaflet-map{
  &.leaflet-container{
    height: 350px;
  }
}

.card .card-header .code-toggler {
  display: none;
}
</style>
