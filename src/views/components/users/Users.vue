<template>
  <b-row>
    <b-col cols="12">
      <good-table-basic/>
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import GoodTableBasic from './GoodTableBasic.vue'

export default {
  components: {
    BRow,
    BCol,

    GoodTableBasic,
  },
}
</script>

<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
