<template>
  <b-card
    class="blog-edit-wrapper"
  >
    <!-- form -->
    <b-form
      class="mt-2"
      @submit.prevent="onSubmit"
    >
      <b-row>
        <b-col md="6">
          <b-form-group
            label="Lake name"
            label-for="blog-edit-title"
            class="mb-2"
          >
            <b-form-input
              id="blog-edit-title"
              v-model="lakeData.name"
            />
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group
            label="Lake address"
            label-for="blog-edit-title"
            class="mb-2"
          >
            <b-form-input
              id="blog-edit-title"
              v-model="lakeData.address"
            />
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group
            label="Fishing type"
            label-for="name"
            class="mb-2"
          >
            <v-select
              id="fishngTypes"
              v-model="lakeData.fishing_type_id"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="fishingTypes"
              :reduce="val => val.id"
              label="name"
            />
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group
            label="Fishes"
            label-for="blog-edit-category"
            class="mb-2"
          >
            <v-select
              id="blog-edit-category"
              v-model="lakeData.fishes_id"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              multiple
              :options="fishes"
              :reduce="val => val.id"
              label="name"
            />
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-form-group
            label="Description"
            label-for="blog-content"
            class="mb-2"
          >
            <quill-editor
              id="blog-content"
              v-model="lakeData.description"
              label="name"
            />
          </b-form-group>
        </b-col>

        <b-col
          cols="12"
          class="mb-2"
        >
          <div class="border rounded p-2">
            <h4 class="mb-1">
              Add main Image
            </h4>
            <b-media
              no-body
              vertical-align="center"
              class="flex-column flex-md-row"
            >
              <b-media-aside
                v-if="lakeData.main_image"
              >
                <b-img
                  ref="refPreviewEl"
                  src=""
                  height="110"
                  width="170"
                  class="rounded mr-2 mb-1 mb-md-0"
                />
              </b-media-aside>
              <b-media-body>
                <small class="text-muted">Required image resolution 800x400, image size 10mb.</small>

                <div class="d-inline-block">
                  <b-form-file
                    ref="refInputEl"
                    v-model="lakeData.main_image"
                    accept=".jpg, .png, .gif"
                    placeholder="Choose file"
                    @input="inputImageRenderer"
                  />
                </div>
              </b-media-body>
            </b-media>
          </div>
        </b-col>

        <edit-map v-if="lakeData.lake_locations"
          :lakeData="lakeData"
          @mapSetting="getMapSet"
        />

        <b-col
          cols="12"
          class="mt-50"
        >
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            type="submit"
          >
            Update
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            to="/lakes"
          >
            Cancel
          </b-button>
        </b-col>
      </b-row>
    </b-form>
    <!--/ form -->
  </b-card>
</template>

<script>
import {
  BCard,
  BMedia,
  //   BAvatar,
  //   BCardText,
  BMediaAside,
  BMediaBody,
  BForm,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BImg,
  BFormFile,
  // BLink,
  BButton,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { quillEditor } from 'vue-quill-editor'
import Ripple from 'vue-ripple-directive'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import {
  ref,
  onUnmounted,
  computed,
  onBeforeMount,
} from '@vue/composition-api'
import router from '@/router'
import store from '@/store'
import lakesStoreModule from '../lakesStoreModule'
import EditMap from './EditMap.vue'

export default {
  components: {
    BCard,
    BMedia,
    // BAvatar,
    // BCardText,
    BMediaAside,
    BMediaBody,
    BForm,
    // BLink,
    BImg,
    BRow,
    BCol,
    BButton,
    BFormGroup,
    BFormInput,
    BFormFile,
    vSelect,
    quillEditor,

    EditMap,
  },
  directives: {
    Ripple,
  },
  setup() {
    const getLakeInfo = computed(() => store.getters.updateLakeInfo)
    const fishingTypes = computed(() => store.state.lake.lakeInfo.fishingTypes)
    const fishes = computed(() => store.state.lake.lakeInfo.fishes)
    const lakeData = computed(() => store.state.lake.currentLake)

    onBeforeMount(() => {
      store.dispatch('lake/addLakeGet')
      store.dispatch('lake/fetchLake', { slug: router.currentRoute.params.slug })
    })

    const fullName = user => `${user.first_name} ${user.last_name}`
    const refInputEl = ref(null)
    const refPreviewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, base64 => { refPreviewEl.value.src = base64 })

    const USER_APP_STORE_MODULE_NAME = 'lake'
    const { VUE_APP_SERVE_URL } = process.env

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, lakesStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    // const mapSet = {
    //   center: {
    //     lat: 51.503400084633554,
    //     lng: 23.844272273477177,
    //   },
    //   markers: [
    //     {
    //       lat: 51.48210267790976,
    //       lng: 23.80187360025167,
    //     },
    //     {
    //       lat: 51.48210267790976,
    //       lng: 23.80187360025167,
    //     },
    //     {
    //       lat: 51.48926466194558,
    //       lng: 23.790202174967707,
    //     },
    //     {
    //       lat: 51.49845600779386,
    //       lng: 23.79449314014565,
    //     },
    //     {
    //       lat: 51.51085070147332,
    //       lng: 23.80736603567938,
    //     },
    //   ],
    //   zoom: 12,
    // }

    const getMapSet = data => { lakeData.value.mapSet = data }

    const onSubmit = () => {
      lakeData.value.main_image_path = 'image'
      lakeData.value.seo_title = 'seo title'
      lakeData.value.seo_description = 'seo description'
      lakeData.value.seo_preview = 'seo preview'

      if (!lakeData.value.mapSet) {
        lakeData.value.mapSet = {
          center: {
            lat: lakeData.value.x_coordinate_geo,
            lng: lakeData.value.y_coordinate_geo,
          },
          zoom: 10,
          markers: [...lakeData.value.lake_locations],
        }
      }

      const data = lakeData.value

      console.log(data)

      store.dispatch('lake/editLake', data)
        .then(() => router.push(`/apps/lakes/view/${lakeData.value.slug}`))
    }

    return {
      refInputEl,
      refPreviewEl,
      inputImageRenderer,

      onSubmit,
      lakeData,
      fullName,
      VUE_APP_SERVE_URL,
      getLakeInfo,
      fishingTypes,
      fishes,
      // mapSet,
      getMapSet,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/quill.scss';
@import '@core/scss/vue/pages/page-blog.scss';
</style>
