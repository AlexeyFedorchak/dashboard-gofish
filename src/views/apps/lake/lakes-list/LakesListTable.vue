<template>
  <b-card-code title="Lakes list">
    <!-- search input -->
    <div class="custom-search d-flex justify-content-between align-items-center">
      <b-button
        variant="primary"
        class="mr-1"
        to="/lake/create"
      >
        Create lake
      </b-button>

      <b-form-group>
        <div class="d-flex align-items-center">
          <label class="mr-1">Search</label>
          <b-form-input
            v-model="searchTerm"
            placeholder="Search"
            type="text"
            class="d-inline-block"
          />
        </div>
      </b-form-group>
    </div>

    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="lakes.lakes"
      :rtl="direction"
      :search-options="{
        enabled: true,
        externalQuery: searchTerm }"
      :select-options="{
        enabled: true,
        selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
        selectionInfoClass: 'custom-class',
        selectionText: 'rows selected',
        clearSelectionText: 'clear',
        disableSelectInfo: true, // disable the select info panel on top
        selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
      }"
      :pagination-options="{
        enabled: true,
        perPage:pageLength
      }"
    >
      <template
        slot="table-row"
        slot-scope="props"
      >

        <!-- Column: Name -->
        <b-link
          v-if="props.column.field === 'fullName'"
          class="text-nowrap"
          :to="{ name: 'apps-lakes-view', params: { slug: props.row.slug }}"
        >
          <b-avatar
            :src="props.row.main_image_path"
            class="mx-1"
          />
          <span class="text-nowrap">{{ props.row.name }}</span>
        </b-link>

        <!-- Column: Address -->
        <span v-else-if="props.column.field === 'address'">
          {{ props.row.address }}
        </span>

        <!-- Column: Owner ID -->
        <b-link
          v-else-if="props.column.field === 'owner'"
          :to="{ name: 'apps-users-view', params: { id: props.row.owner.id } }"
          class="font-weight-bold d-block text-nowrap"
        >
          {{ getFullName(props.row.owner) }}
        </b-link>

        <!-- Column: Fishes -->
        <span v-else-if="props.column.field === 'fishes'">
          <span
            v-for="fish in props.row.fishes"
            :key="fish.id"
          >
            {{ fish.name }}
          </span>
        </span>

        <!-- Column: Fishing type -->

        <span v-else-if="props.column.field === 'fishingType'">
          {{ props.row.fishing_type.name }}
        </span>

        <!-- Column: X coordinate geo -->

        <span v-else-if="props.column.field === 'geoX'">
          {{ props.row.x_coordinate_geo }}
        </span>

        <!-- Column: Y coordinate geo -->

        <span v-else-if="props.column.field === 'geoY'">
          {{ props.row.y_coordinate_geo }}
        </span>

        <!-- Column: Action -->
        <span v-else-if="props.column.field === 'action'">
          <span>
            <b-dropdown
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template v-slot:button-content>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="16"
                  class="text-body align-middle mr-25"
                />
              </template>
              <b-dropdown-item
                :to="{ name: 'lake-update', params: { slug: props.row.slug } }"
              >
                <feather-icon
                  icon="Edit2Icon"
                  class="mr-50"
                />
                <span>Edit</span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="deleteLake(props.row.id)"
              >
                <feather-icon
                  icon="TrashIcon"
                  class="mr-50"
                />
                <span>Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </span>
        </span>

        <!-- Column: Common -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>

      <!-- pagination -->
      <template
        slot="pagination-bottom"
        slot-scope="props"
      >
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap ">
              Showing 1 to
            </span>
            <b-form-select
              v-model="pageLength"
              :options="['3','5','10']"
              class="mx-1"
              @input="(value)=>props.perPageChanged({currentPerPage:value})"
            />
            <span class="text-nowrap"> of {{ props.total }} entries </span>
          </div>
          <div>
            <b-pagination
              :value="1"
              :total-rows="props.total"
              :per-page="pageLength"
              first-number
              last-number
              align="right"
              prev-class="prev-item"
              next-class="next-item"
              class="mt-1 mb-0"
              @input="(value)=>props.pageChanged({currentPage:value})"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>
          </div>
        </div>
      </template>
    </vue-good-table>
  </b-card-code>
</template>

<script>
import BCardCode from '@core/components/b-card-code/BCardCode.vue'

import {
  BAvatar,
  BLink,
  BPagination,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BDropdown,
  BDropdownItem,
  BButton,
} from 'bootstrap-vue'
import { VueGoodTable } from 'vue-good-table'
import store from '@/store/index'
import {
  computed,
  onBeforeMount,
} from '@vue/composition-api'

export default {
  components: {
    BCardCode,
    VueGoodTable,
    BAvatar,
    BLink,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    BButton,
  },
  setup() {
    const pageLength = 3
    let dir = false
    const columns = [
      {
        label: 'Name',
        field: 'fullName',
      },
      {
        label: 'Address',
        field: 'address',
      },
      {
        label: 'Owner',
        field: 'owner',
      },
      {
        label: 'Fishes',
        field: 'fishes',
      },
      {
        label: 'Fishing type',
        field: 'fishingType',
      },
      {
        label: 'X coordinate geo',
        field: 'geoX',
      },
      {
        label: 'Y coordinate geo',
        field: 'geoY',
      },
      {
        label: 'Action',
        field: 'action',
      },
    ]

    const rows = []
    const searchTerm = ''

    const direction = computed(() => {
      if (store.state.appConfig.isRTL) {
        dir = true
        return dir
      }
      dir = false
      return dir
    })

    const getLakes = computed(() => store.getters.updateLakes)

    onBeforeMount(() => {
      store.dispatch('lakes/fetchLakes')
    })

    const { lakes } = store.state

    const getFullName = user => `${user?.first_name} ${user?.last_name}`

    const deleteLake = id => store.dispatch('lakes/deleteLake', id)
      .then(() => store.dispatch('lakes/fetchLakes'))

    return {
      lakes,
      getFullName,
      deleteLake,
      direction,
      getLakes,
      pageLength,
      dir,
      columns,
      rows,
      searchTerm,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/quill.scss';
@import '@core/scss/vue/pages/page-blog.scss';
</style>
