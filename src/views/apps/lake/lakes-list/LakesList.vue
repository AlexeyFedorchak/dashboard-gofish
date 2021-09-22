<template>
  <b-row>
    <b-col cols="12">
      <lakes-list-table />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import store from '@/store'
import { onUnmounted } from '@vue/composition-api'
import LakesListTable from './LakesListTable.vue'
import lakesStoreModule from '../lakesStoreModule'

export default {
  components: {
    BRow,
    BCol,

    LakesListTable,
  },
  setup() {
    const USER_APP_STORE_MODULE_NAME = 'lakes'

    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, lakesStoreModule)

    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })
  },
}
</script>

<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
