<template>
  <div>

    <!-- Media -->
    <b-media class="mb-2">
      <template #aside>
        <b-avatar
          ref="previewEl"
          :src="newData.photo_path"
          :text="avatarText(fullName(userData))"
          :variant="`light-${resolveUserRoleVariant(newData.roles.find(e => e).name)}`"
          size="90px"
          rounded
        />
      </template>
      <h4 class="mb-1">
        {{ fullName(userData) }}
      </h4>
      <div class="d-flex flex-wrap">
        <b-button
          variant="primary"
          @click="$refs.refInputEl.click()"
        >
          <input
            ref="refInputEl"
            type="file"
            class="d-none"
            @input="inputImageRenderer"
            @change="sendPhoto"
          >
          <span class="d-none d-sm-inline">Update</span>
          <feather-icon
            icon="EditIcon"
            class="d-inline d-sm-none"
          />
        </b-button>
        <b-button
          variant="outline-secondary"
          class="ml-1"
          @click="deleteUser()"
        >
          <span class="d-none d-sm-inline">Remove</span>
          <feather-icon
            icon="TrashIcon"
            class="d-inline d-sm-none"
          />
        </b-button>
      </div>
    </b-media>

    <!-- User Info: Input Fields -->
    <b-form>
      <b-row>

        <!-- Field: Username -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="First Name"
            label-for="first_name"
          >
            <b-form-input
              id="first_name"
              v-model="newData.first_name"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Last Name -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Last Name"
            label-for="last_name"
          >
            <b-form-input
              id="last_name"
              v-model="newData.last_name"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Nick Name -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Nick Name"
            label-for="nick_name"
          >
            <b-form-input
              id="nick_name"
              v-model="newData.nick_name"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Phone -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Phone"
            label-for="phone"
          >
            <b-form-input
              id="phone"
              v-model="newData.phone"
              type="tel"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Status -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Status"
            label-for="user-status"
          >
            <v-select
              v-model="newData.is_activated"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              :reduce="val => val.id"
              :clearable="false"
              input-id="user_status"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Role -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="User Role"
            label-for="user_role"
          >
            <v-select
              v-model="newData.role"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="roleOptions"
              :reduce="val => val.value"
              :clearable="false"
              input-id="user_role"
            />
          </b-form-group>
        </b-col>

      </b-row>
    </b-form>

    <b-button
      variant="primary"
      class="mb-1 mb-sm-0 mr-0 mr-sm-1"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
      @click="updateUser()"
    >
      Save Changes
    </b-button>
    <b-button
      variant="outline-secondary"
      type="reset"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
      @click="resetChange()"
    >
      Reset
    </b-button>
  </div>
</template>

<script>
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
} from 'bootstrap-vue'
import router from '@/router'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref } from '@vue/composition-api'
import store from '@/store'
import useUsersList from '../users-list/useUsersList'

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    vSelect,
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  setup({ userData }) {
    const { resolveUserRoleVariant } = useUsersList()

    const roleOptions = [
      { label: 'Admin', value: 'admin', id: 1 },
      { label: 'Owner', value: 'owner', id: 2 },
      { label: 'Fisher', value: 'Fisher', id: 3 },
    ]

    const statusOptions = [
      { label: 'Active', value: 'active', id: 1 },
      { label: 'Inactive', value: 'inactive', id: 0 },
    ]

    const permissionsData = [
      {
        module: 'Admin',
        read: true,
        write: false,
        create: false,
        delete: false,
      },
      {
        module: 'Owner',
        read: false,
        write: true,
        create: false,
        delete: false,
      },
      {
        module: 'Fisher',
        read: true,
        write: false,
        create: true,
        delete: false,
      },
    ]

    const refInputEl = ref(null)
    const previewEl = ref(null)

    const newData = {
      ...userData,
      oldRole: userData.roles.find(e => e).name,
    }

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, base64 => {
      newData.photo_path = base64
    })

    const sendPhoto = event => {
      const [image] = event.target.files
      newData.image = image
    }

    const fullName = user => `${user.first_name} ${user.last_name}`

    const deleteUser = () => {
      store.dispatch('user/deleteUser', router.currentRoute.params.id)
        .then(() => {
          router.push('/users')
        })
    }

    const updateUser = () => {
      delete newData.photo_path
      store.dispatch('user/updateUser', newData)
        .then(() => {
          router.push(`/apps/users/view/${newData.id}`)
        })
    }

    const resetChange = () => {
      newData.first_name = userData.first_name
      newData.last_name = userData.last_name
      newData.nick_name = userData.nick_name
      newData.phone = userData.phone
      newData.is_activated = userData.is_activated
      newData.photo_path = userData.photo_path

      delete newData.role
      delete newData.image
      delete newData.oldRole
    }

    return {
      resolveUserRoleVariant,
      avatarText,
      roleOptions,
      statusOptions,
      permissionsData,
      deleteUser,
      fullName,
      newData,
      resetChange,
      updateUser,
      sendPhoto,
      refInputEl,
      previewEl,
      inputImageRenderer,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
