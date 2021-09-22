<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />
        <h2 class="brand-text text-primary ml-1">
          GoFish
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class=" d-lg-flex align-items-center justify-content-center px-5 customSizeImage">
          <b-img
            fluid
            :src="sideImg"
            alt="Logo"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >

        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >

          <b-card-title
            class="mb-1 font-weight-bold"
            title-tag="h2"
          >
            Welcome to GoFish! 👋
          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account and start the adventure
          </b-card-text>

          <!-- form -->
          <validation-observer
            ref="loginForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-login-form mt-2"
              @submit.prevent="login"
            >
              <!-- phone -->
              <b-form-group
                label="Phone"
                label-for="register-phone"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Phone"
                  vid="phone"
                  rules="required"
                >
                  <b-form-input
                    id="register-phone"
                    ref="inputPhone"
                    v-model="phone"
                    v-mask="'380#########'"
                    name="register-phone"
                    :state="errors.length > 0 ? false:null"
                    placeholder="380XXXXXXXXX"
                    @keypress="isNumber($event)"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  Remember Me
                </b-form-checkbox>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="invalid"
              >
                Sign in
              </b-button>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>New on our platform? </span>
            <b-link :to="{name:'auth-register'}">
              <span>&nbsp;Create an account</span>
            </b-link>
          </b-card-text>
          <div
            v-if="catchErrorFromLoginForm"
            class="error"
          >
            <p>{{ messageError }}</p>
          </div>
        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
    <b-modal
      id="modal-login"
      ref="openModalCode"
      cancel-variant="outline-secondary"
      ok-title="Login"
      cancel-title="Close"
      centered
      no-close-on-backdrop
      no-close-on-esc
      title="Insert code"
      @ok.prevent="checkIfCodeCorrect"
    >
      <!-- form -->
      <validation-observer
        ref="registerCode"
      >
        <b-form>
          <b-form-group
            label="Code"
            label-for="register-code"
          >
            <validation-provider
              #default="{ errors }"
              name="code"
              vid="code"
              rules="required"
            >
              <b-form-input
                id="register-lastname"
                v-model="code"
                v-mask="'####'"
                name="register-code"
                :state="errors.length > 0 ? false : null"
                placeholder="Enter code"
                @keypress="isNumber($event)"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-form>
      </validation-observer>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  VBTooltip,
  BModal, BFormCheckbox,
} from 'bootstrap-vue'
import { required } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import inputRules from '@/mixins/inputRules'
import notificationMixin from '@/mixins/notificationMixin'
import calendarStoreModule from '@/views/apps/calendar/calendarStoreModule'
import { ref, computed, onUnmounted } from '@vue/composition-api'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import router from '@/router'
import { entityRequests } from '@/service/entityRequest'
import { setToken } from '@/service/auth'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    VuexyLogo,
    BModal,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility, inputRules, notificationMixin],
  setup(props, context) {
    const CALENDAR_APP_STORE_MODULE_NAME = 'auth'

    // Register module
    if (!store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.registerModule(CALENDAR_APP_STORE_MODULE_NAME, calendarStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.unregisterModule(CALENDAR_APP_STORE_MODULE_NAME)
    })

    const status = ref('')
    const sideImg = ref(require('@/assets/images/pages/undraw_fish_bowl_uu88.svg'))
    const phone = ref(null)
    const openModalInsertCode = ref(false)
    const catchErrorFromLoginForm = ref(false)
    const code = ref(null)
    const messageError = ref('')
    const passwordToggleIcon = computed(() => (this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'))
    const loginForm = ref(null)
    const openModalCode = ref(null)
    const registerCode = ref(null)
    const toast = useToast()
    const clearPhoneField = () => {
      phone.value = ''
    }
    const login = () => {
      loginForm.value.validate().then(success => {
        if (success) {
          entityRequests.auth.login({
            phone: phone.value,
          })
            .then(() => {
              catchErrorFromLoginForm.value = false
              openModalCode.value.show()
            })
            .catch(error => {
              messageError.value = error.response.data.errors.phone.join()
              catchErrorFromLoginForm.value = true
              loginForm.value.setErrors(error.response.data.error)
            })
        }
      })
    }
    const checkIfCodeCorrect = () => {
      context.refs.registerCode.validate().then(success => {
        if (success) {
          const formData = {
            phone: phone.value,
            code: code.value,
          }
          entityRequests.auth.code(formData)
            .then(res => {
              setToken(res.access_token)
              openModalCode.value.hide()
              router.push('/')
              clearPhoneField()
              toast({
                component: ToastificationContent,
                props: {
                  title: 'Welcome to GoFish',
                  icon: 'CheckIcon',
                  variant: 'success',
                },
              })
            })
            .catch(error => {
              toast({
                component: ToastificationContent,
                props: {
                  title: 'Code is invalid',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
                },
              })
              registerCode.value.setErrors(error.response.data.error)
            })
        }
      })
    }

    return {
      status,
      sideImg,
      phone,
      openModalInsertCode,
      catchErrorFromLoginForm,
      code,
      messageError,
      required,
      // computed
      passwordToggleIcon,
      // refs
      loginForm,
      openModalCode,
      registerCode,
      // methods
      login,
      checkIfCodeCorrect,
      clearPhoneField,
    }
  },
}
</script>
<style lang="scss">
@import '~@core/scss/vue/pages/page-auth.scss';
.customSizeImage{
  margin: 0 auto;
  width: 80%;
}
.error > p{
  text-align: center;
  color: red;
}
</style>
