<template>
  <section class="app-ecommerce-details">

    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="lakeData === undefined"
    >
      <h4 class="alert-heading">
        Error fetching lake data
      </h4>
      <div class="alert-body">
        No item found with this item slug. Check
        <b-link
          class="alert-link"
          :to="{ name: 'lakes'}"
        >
          This
        </b-link>
        for other lakes.
      </div>
    </b-alert>

    <!-- Content -->
    <b-card
      v-if="currentLake"
      no-body
    >
      <b-card-body>
        <b-row class="my-2">

          <!-- Left: Product Image Container -->
          <b-col
            cols="12"
            md="5"
            class="d-flex align-items-center justify-content-center mb-2 mb-md-0"
          >
            <div class="d-flex align-items-center justify-content-center">
              <b-img
                :src="`${photoStartUrl}/${currentLake.main_image_path}`"
                :alt="`Image of ${currentLake.name}`"
                class="product-img"
                fluid
              />
            </div>
          </b-col>

          <!-- Right: Product Details -->
          <b-col
            cols="12"
            md="7"
          >
            <div class="d-flex flex-wrap">
              <b-button
                :to="{ name: 'lake-update', params: { slug: currentLake.slug } }"
                variant="primary"
              >
                Edit
              </b-button>
              <b-button
                variant="outline-danger"
                class="ml-1"
                @click="deleteLake()"
              >
                Delete
              </b-button>
            </div>

            <hr>

            <!-- Product Name -->
            <h4>{{ currentLake.name }}</h4>

            <!-- Product Brand -->
            <b-card-text class="item-company mb-0">
              <span>Fishing type</span>
              <b-link class="company-name">
                {{ currentLake.fishing_type.name }}
              </b-link>
            </b-card-text>

            <b-card-text class="item-company mb-0">
              <span>Lake address:</span>
              <b class="company-name">
                {{ currentLake.address }}
              </b>
            </b-card-text>

            <!-- Price And Ratings -->
            <div class="ecommerce-details-price d-flex flex-wrap mt-1">
              <h4 class="item-price mr-1">
                Раніше тут була ціна
              </h4>
              <ul class="unstyled-list list-inline pl-1 border-left">
                <li
                  v-for="star in 5"
                  :key="star"
                  class="ratings-list-item mr-25"
                >
                  <feather-icon
                    icon="StarIcon"
                    size="18"
                    :class="[{'fill-current': star <= 4}, star <= 4 ? 'text-warning' : 'text-muted']"
                  />
                </li>
              </ul>
            </div>

            <!-- Avability -->
            <!-- <b-card-text>Available - <span class="text-success">In stock</span></b-card-text> -->

            <!-- Product Description -->
            <b-card-text v-html="currentLake.description"></b-card-text>

            <!-- Product Meta [Free shpping, EMI, etc.] -->
            <ul class="product-features list-unstyled">
              <li>
                <span>X coordinate</span>
                <feather-icon
                  style="margin: 0 10px"
                  icon="ArrowRightIcon"
                />
                <span>{{ currentLake.x_coordinate_geo }}</span>
              </li>
              <li>
                <span>Y coordinate</span>
                <feather-icon
                  style="margin: 0 10px"
                  icon="ArrowRightIcon"
                />
                <span>{{ currentLake.y_coordinate_geo }}</span>
              </li>
            </ul>

            <hr>

            <!-- Colors -->
            <div class="product-color-options">
              <h6>Fishes</h6>
              <ul class="list-unstyled mb-0">
                <li
                  v-for="fish in currentLake.fishes"
                  :key="fish.id"
                  class="d-inline-block"
                >
                  <div
                    class="color-option"
                    style="margin: 0 25px 0 0"
                  >
                    <span
                      class="filloption"
                      style="text-transform: capitalize"
                    >
                      {{ fish.name }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </section>
</template>

<script>
import store from '@/store'
import router from '@/router'
import {
  BCard,
  BCardBody,
  BRow,
  BCol,
  BImg,
  BCardText,
  BLink,
  BAlert,
  BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  directives: {
    Ripple,
  },
  components: {
    BCard,
    BCardBody,
    BRow,
    BCol,
    BImg,
    BCardText,
    BLink,
    BAlert,
    BButton,
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
  setup({ lakeData }) {
    const { lake: currentLake } = lakeData

    const deleteLake = () => store.dispatch('lake/deleteLake', lakeData.lake.id)
      .then(() => router.push('/lakes'))

    return {
      currentLake,
      deleteLake,
    }
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-ecommerce-details.scss";
</style>
