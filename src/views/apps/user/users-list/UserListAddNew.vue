<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add New User
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >

          <!-- First Name -->
          <validation-provider
            #default="validationContext"
            name="Name"
            rules="required"
          >
            <b-form-group
              label="Name"
              label-for="name"
            >
              <b-form-input
                id="first-name"
                v-model="userData.first_name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="John Doe"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Last Name -->
          <!-- <validation-provider
            #default="validationContext"
            name="Last name"
            rules="required|alpha-num"
          >
            <b-form-group
              label="Last Name"
              label-for="last-name"
            >
              <b-form-input
                id="last-name"
                v-model="userData.last_name"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider> -->

          <!-- Phone -->
          <validation-provider
            #default="validationContext"
            name="Phone"
            rules="required"
          >
            <b-form-group
              label="Phone"
              label-for="phone"
            >
              <b-form-input
                id="userPhone"
                v-model="userData.phone"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- User Password -->
          <validation-provider
            #default="validationContext"
            name="User password"
            rules="required"
          >
            <b-form-group
              label="Password"
              label-for="user-password"
              :state="getValidationState(validationContext)"
            >
              <b-form-input
                type="password"
                id="nick-name"
                v-model="userData.password"
                :state="getValidationState(validationContext)"
              />
              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Nick Name -->
          <!-- <validation-provider
            #default="validationContext"
            name="Nick Name"
            rules="required"
          >
            <b-form-group
              label="Nick Name"
              label-for="nick-name"
            >
              <b-form-input
                id="nick-name"
                v-model="userData.name"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider> -->

          <!-- Role -->
          <!-- <validation-provider
            #default="validationContext"
            name="Role"
            rules="required"
          >
            <b-form-group
              label="Role"
              label-for="role"
            >
              <b-form-input
                id="role"
                v-model="userData.roles[0].name"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider> -->

          <!-- Role -->
          <validation-provider
            #default="validationContext"
            name="Role"
            rules="required"
          >
            <b-form-group
              label="Role"
              label-for="role"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="userData.roleId"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="roles"
                :reduce="val => val.id"
                :clearable="false"
                input-id="country"
              />
              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- User Role -->
          <!-- <validation-provider
            #default="validationContext"
            name="User Role"
            rules="required"
          >
            <b-form-group
              label="User Role"
              label-for="user-role"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="userData.roleId"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="roleOptions"
                :reduce="val => val.value"
                :clearable="false"
                input-id="user-role"
              />
              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider> -->

          <!-- Plan -->
          <!-- <validation-provider
            #default="validationContext"
            name="Plan"
            rules="required"
          >
            <b-form-group
              label="Plan"
              label-for="plan"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="userData.currentPlan"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="planOptions"
                :reduce="val => val.value"
                :clearable="false"
                input-id="plan"
              />
              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider> -->

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Add
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancel
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import { required, alphaNum } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import countries from '@/@fake-db/data/other/countries'
import store from '@/store'

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewUserSidebarActive',
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    roleOptions: {
      type: Array,
      required: true,
    },
    planOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      countries,
    }
  },
  setup({ roleOptions }, { emit }) {
    const blankUserData = {
      first_name: '',
      phone: '',
      roleId: '',
      is_activated: 0,
      password: '',
    }

    const roles = roleOptions.reverse().map((role, i) => ({
      ...role,
      id: i + 1,
    }))

    const userData = ref(JSON.parse(JSON.stringify(blankUserData)))

    const selectRole = role => {
      userData.roleId = roleOptions.indexOf(role) + 1
    }

    const resetUserData = () => {
      userData.value = JSON.parse(JSON.stringify(blankUserData))
    }

    const onSubmit = () => {
      store.dispatch('user/addUser', userData.value)
        .then(() => {
          emit('refetch-data')
          emit('update:is-add-new-user-sidebar-active', false)
        })
    }

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetUserData)

    return {
      userData,
      onSubmit,
      selectRole,
      roles,

      refFormObserver,
      getValidationState,
      resetForm,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
