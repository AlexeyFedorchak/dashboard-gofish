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
        <div class="d-lg-flex align-items-center justify-content-center px-5 customSizeImage">
          <b-img
            fluid
            :src="imgUrl"
            alt="Register V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Register-->
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
          <b-card-title class="mb-1">
            Adventure starts here 🚀
          </b-card-title>
          <b-card-text class="mb-2">
            Make your app management easy and fun!
          </b-card-text>

          <!-- form -->
          <validation-observer
            ref="registerForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-register-form mt-2"
              @submit.prevent="register"
            >
              <!-- firstname -->
              <b-form-group
                label="First Name"
                label-for="register-first_name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="First Name"
                  vid="first_name"
                  rules="required|min:2"
                >
                  <b-form-input
                    id="register-first_name"
                    v-model="formData.first_name"
                    name="register-first_name"
                    :state="errors.length > 0 ? false : null"
                    placeholder="John"
                    @keypress="isLetter($event)"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <!-- last-name -->
              <b-form-group
                label="Last Name"
                label-for="register-lastname"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Last Name"
                  vid="lastname"
                  rules="required|min:2"
                >
                  <b-form-input
                    id="register-lastname"
                    v-model="formData.last_name"
                    name="register-email"
                    :state="errors.length > 0 ? false:null"
                    placeholder="doe"
                    @keypress="isLetter($event)"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <!-- phone -->
              <b-form-group
                label="Phone"
                label-for="register-phone"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Phone"
                  vid="phone"
                  rules="required|min:12"
                >
                  <b-form-input
                    id="register-phone"
                    v-model="formData.phone"
                    v-mask="'380#########'"
                    name="register-phone"
                    :state="errors.length > 0 ? false:null"
                    placeholder="380XXXXXXXXX"
                    @keypress="isNumber($event)"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <!-- nick-name -->
              <b-form-group
                label="Nickname"
                label-for="register-nickname"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Nickname"
                  vid="nickname"
                  rules="required|min:2"
                >
                  <b-form-input
                    id="register-nickname"
                    v-model="formData.nick_name"
                    name="register-nickname"
                    :state="errors.length > 0 ? false:null"
                    placeholder="nickname"
                    @keypress="isLetter($event)"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <!--Privacy-->
              <b-form-group>
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="status"
                  name="checkbox-1"
                >
                  I agree to
                  <b-link>privacy policy & terms</b-link>
                </b-form-checkbox>
              </b-form-group>

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
              >
                Sign up
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <span>Already have an account?</span>
            <b-link :to="{name:'auth-login'}">
              <span>&nbsp;Sign in instead</span>
            </b-link>
          </p>

          <div
            v-if="errorsRegistrations"
            class="error"
          >
            <p>{{ errorsRegistrations }}</p>
          </div>
        </b-col>

      </b-col>
      <!-- /Register-->
    </b-row>
    <b-modal
      id="modal-login"
      cancel-variant="outline-secondary"
      ok-title="Login"
      cancel-title="Close"
      centered
      title="Insert code"
      :visible="openModalInsertCode"
      @ok="checkIfCodeCorrect"
    >
      <!-- form -->
      <validation-observer
        ref="registerCode"
      >
<!--        #default="{invalid}"-->
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
  BRow, BCol, BLink, BButton, BForm, BFormCheckbox, BFormGroup, BFormInput, BInputGroup, BInputGroupAppend, BImg, BCardTitle, BCardText, BModal,
} from 'bootstrap-vue'
import { required, min } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import axios from '@axios'
import inputRules from '@/mixins/inputRules'

export default {
  components: {
    VuexyLogo,
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BCardText,
    BCardTitle,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    // eslint-disable-next-line vue/no-unused-components
    BInputGroup,
    // eslint-disable-next-line vue/no-unused-components
    BInputGroupAppend,
    BModal,
    // validations
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility, inputRules],

  data() {
    return {
      formData: {
        first_name: '',
        phone: null,
        last_name: '',
        nick_name: '',
      },
      errorsRegistrations: null,
      openModalInsertCode: false,
      code: null,
      status: '',
      sideImg: require('@/assets/images/pages/undraw_fishing_hoxa.svg'),
      // validation
      required,
      min,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/register-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    register() {
      this.$refs.registerForm.validate().then(success => {
        if (success) {
          axios.post('http://gofish.test/api/sign-up/fisher', this.formData)
            .then(() => {
              this.openModalInsertCode = true

              // localStorage.setItem('userData', JSON.stringify(res.data.userData))
              // this.$ability.update(res.data.userData.ability)
            })
            .catch(error => {
              this.errorsRegistrations = error.response?.data?.errors?.phone.join()
              this.$refs.registerForm.setErrors(error.response.data.error)
            })
        }
      })
    },
    checkIfCodeCorrect() {
      this.$refs.registerCode.validate().then(success => {
        if (success) {
          axios.post('http://gofish.test/api/sign-up/code', {
            phone: this.formData.phone,
            code: this.code,
          })
            .then(res => {
              this.clearRegisterForm()
              if (res.statusText === 'OK') {
                this.$router.push('/login')
              }
              // localStorage.setItem('userData', JSON.stringify(res.data.userData))
              // this.$ability.update(res.data.userData.ability)
            })
            .catch(error => {
              this.$refs.registerCode.setErrors(error.response.data.error)
            })
        }
      })
    },
    clearRegisterForm() {
      this.formData.first_name = ''
      this.formData.last_name = ''
      this.formData.phone = null
      this.formData.nick_name = ''
    },
  },
}

</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
.customSizeImage{
  margin: 0 auto;
  width: 80%;
}
.error > p{
  text-align: center;
  color: red;
}
</style>
