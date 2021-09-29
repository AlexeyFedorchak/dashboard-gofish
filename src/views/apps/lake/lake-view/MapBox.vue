<template>
  <b-row>
    <b-col cols="12">
      <leaflet-basic
        v-if="lakeData"
        :lake-data="lakeData"
      />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import LeafletBasic from './LeafletBasic.vue'

export default {
  components: {
    BRow,
    BCol,

    LeafletBasic,
  },
  props: {
    lakeData: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/map-leaflet.scss';
</style>
