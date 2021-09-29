<template>
  <b-card-code
    v-if="lakeData.lake.lake_images.length"
    title="Multiple Slides Per View"
  >
    <swiper
      class="swiper-multiple"
      :options="swiperOptions"
      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
    >
      <swiper-slide
        v-for="img in lakeData.lake.lake_images"
        :key="img.id"
      >
        <b-img
          :src="`${photoStartUrl}/${img.path}`"
          fluid
        />
      </swiper-slide>

      <div
        slot="pagination"
        class="swiper-pagination"
      />
    </swiper>
  </b-card-code>
</template>

<script>
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { BImg } from 'bootstrap-vue'
import 'swiper/css/swiper.css'

export default {
  components: {
    Swiper,
    SwiperSlide,
    BCardCode,
    BImg,
  },
  props: {
    lakeData: {
      type: Object,
      required: true,
    },
    photoStartUrl: {
      type: String,
      required: true,
    },
  },
  setup() {
    const swiperOptions = {
      slidesPerView: 3,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    }

    return {
      swiperOptions,
    }
  },
}
</script>
