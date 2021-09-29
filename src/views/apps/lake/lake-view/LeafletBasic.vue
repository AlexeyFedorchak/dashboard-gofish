<template>
  <b-card-code title="Where is it ?">
    <l-map
      :zoom="mapSet.zoom"
      :center="mapSet.center"
    >
      <l-tile-layer :url="mapSet.url" />

      <l-marker
        v-for="marker in lake.lake_locations"
        :key="marker.id"
        visible
        :lat-lng="{ lat: marker.lat, lng: marker.lng }"
      >
        <!-- <l-popup :content="marker.tooltip" />
        <l-tooltip :content="marker.tooltip" /> -->
      </l-marker>
    </l-map>
  </b-card-code>
</template>

<script>
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
    BCardCode,
  },
  props: {
    lakeData: {
      type: Object,
      required: true,
    },
  },
  setup({ lakeData }) {
    const { lake } = lakeData

    const center = [lake.x_coordinate_geo, lake.y_coordinate_geo]

    const mapSet = {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 13,
      center,
      circle: {
        center,
        radius: 170,
        color: '#EA5455',
      },
    }

    return {
      mapSet,
      lake,
    }
  },
}
</script>

<style lang="scss">
.vue2leaflet-map{
  &.leaflet-container{
    height: 350px;
  }
}

.card .card-header .code-toggler {
  display: none;
}
</style>
