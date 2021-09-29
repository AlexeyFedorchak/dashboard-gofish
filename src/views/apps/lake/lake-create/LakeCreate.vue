<template>
  <b-card class="blog-edit-wrapper">
    <!-- media -->
    <b-media no-body vertical-align="center">
      <b-media-aside class="mr-75">
        <b-avatar size="38" src="" />
      </b-media-aside>
      <b-media-body>
        <h6 class="mb-25">
          {{ fullName(author) }}
        </h6>
        <b-card-text>{{ author.roles.find((role) => role).name }}</b-card-text>
      </b-media-body>
    </b-media>
    <!--/ media -->

    <!-- form -->
    <b-form class="mt-2" @submit.prevent="onSubmit">
      <b-row>
        <b-col md="6">
          <b-form-group
            label="Lake name"
            label-for="blog-edit-title"
            class="mb-2"
          >
            <b-form-input id="blog-edit-title" v-model="lakeData.name" />
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group
            label="Lake address"
            label-for="blog-edit-title"
            class="mb-2"
          >
            <b-form-input id="blog-edit-title" v-model="lakeData.address" />
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group label="Fishing type" label-for="name" class="mb-2">
            <v-select
              id="fishngTypes"
              v-model="lakeData.fishing_type_id"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="fishingTypes"
              :reduce="(val) => val.id"
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
              :reduce="(val) => val.id"
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

        <b-col cols="12" class="mb-2">
          <div class="border rounded p-2">
            <h4 class="mb-1">Add main Image</h4>
            <b-media
              no-body
              vertical-align="center"
              class="flex-column flex-md-row"
            >
              <b-media-aside v-if="lakeData.main_image">
                <b-img
                  ref="refPreviewEl"
                  src=""
                  height="110"
                  width="170"
                  class="rounded mr-2 mb-1 mb-md-0"
                />
              </b-media-aside>
              <b-media-body>
                <small class="text-muted"
                  >Required image resolution 800x400, image size 10mb.</small
                >

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

        <create-map
          @mapSetting="getMapSet"
        />

        <b-col cols="12" class="mt-50">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            type="submit"
          >
            Create
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
import router from '@/router'
import store from '@/store'
import {
  reactive,
  ref,
  onUnmounted,
  computed,
  onBeforeMount,
} from '@vue/composition-api'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import vSelect from 'vue-select'
import { quillEditor } from 'vue-quill-editor'
import Ripple from 'vue-ripple-directive'

import {
  BCard,
  BMedia,
  BAvatar,
  BCardText,
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
import lakesStoreModule from '../lakesStoreModule'
import CreateMap from './CreateMap.vue'

export default {
  components: {
    BCard,
    BMedia,
    BAvatar,
    BCardText,
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

    // Map components:

    CreateMap,
  },
  directives: {
    Ripple,
  },
  setup() {
    const getLakeInfo = computed(() => store.getters.updateLakeInfo)
    const fishingTypes = computed(() => store.state.lake.lakeInfo.fishingTypes)
    const fishes = computed(() => store.state.lake.lakeInfo.fishes)
    const author = computed(() => store.state.profile.profile)

    onBeforeMount(() => {
      store.dispatch('lake/addLakeGet')
    })

    const fullName = user => `${user.first_name} ${user.last_name}`
    const refInputEl = ref(null)
    const refPreviewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(
      refInputEl,
      base64 => {
        refPreviewEl.value.src = base64
      },
    )

    const USER_APP_STORE_MODULE_NAME = 'lake'

    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) {
      store.registerModule(USER_APP_STORE_MODULE_NAME, lakesStoreModule)
    }

    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) {
        store.unregisterModule(USER_APP_STORE_MODULE_NAME)
      }
    })

    const slug = Math.floor(Math.random() * 100000000 + 1)

    const blankLakeData = {
      slug,
      other_images: [],
      x_coordinate_geo: 49.65751554800701,
      y_coordinate_geo: 31.339330295457433,
    }

    const lakeData = reactive(ref(JSON.parse(JSON.stringify(blankLakeData))))

    const getMapSet = data => {
      lakeData.value.mapSet = data
      lakeData.value.x_coordinate_geo = data.center.lat
      lakeData.value.y_coordinate_geo = data.center.lng
    }

    const onSubmit = () => {
      console.log(lakeData.value)
      store
        .dispatch('lake/addLake', lakeData.value)
        .then(() => router.push(`/apps/lakes/view/${slug}`))
    }

    return {
      refInputEl,
      refPreviewEl,
      inputImageRenderer,

      onSubmit,
      lakeData,
      fullName,
      getLakeInfo,
      fishingTypes,
      fishes,
      author,
      getMapSet,
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
