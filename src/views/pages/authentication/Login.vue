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
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <div>
          <img class="anchor" src="@/assets/images/logo/fish-hook.svg" alt="">
        </div>

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
                    v-model="phone"
                    ref="inputPhone"
                    name="register-phone"
                    :state="errors.length > 0 ? false:null"
                    placeholder="380XXXXXXXXX"
                    @keypress="isNumber($event)"
                    v-mask="'380#########'"
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
          <div class="error" v-if="catchErrorFromLoginForm">
            <p>{{messageError}}</p>
          </div>
        </b-col>
      </b-col>
    <!-- /Login-->
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
      @hidden="openModalInsertCode = false"
    >
      <!-- form -->
      <validation-observer
        ref="registerCode"
        #default="{invalid}"
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
                name="register-code"
                :state="errors.length > 0 ? false : null"
                placeholder="Enter code"
                v-mask="'####'"
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
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BAlert,
  VBTooltip,
  BModal,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import axios from 'axios'
import inputRules from "@/mixins/inputRules";

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
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    VuexyLogo,
    BModal,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility,inputRules],
  data() {
    return {
      status: '',
      sideImg: require('@/assets/images/pages/undraw_fish_bowl_uu88.svg'),
      phone:null,
      openModalInsertCode:false,
      catchErrorFromLoginForm:true,
      code:null,
      messageError: '',
      // validation rules
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
            axios.post('http://gofish.test/api/login', {
              phone:this.phone
            })
            .then(res => {
                  this.openModalInsertCode = true
                  this.catchErrorFromLoginForm = false
                // this.clearPhoneField()
                // localStorage.setItem('userData', JSON.stringify(userData))
                // this.$ability.update(userData.ability)

                })
              .catch(error => {
                this.messageError = error.response.data.errors.phone.join()
                this.catchErrorFromLoginForm = true
                this.$refs.loginForm.setErrors(error.response.data.error)
              })
        }
      })
    },
    checkIfCodeCorrect() {
      this.$refs.registerCode.validate().then(success => {
        if (success) {
          axios.post('http://gofish.test/api/sign-up/code', {
            code: this.code,
            phone: this.phone
          })
            .then(res => {
              this.clearPhoneField()
              if(res.statusText === "OK"){
                this.$router.push('/')
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
    clearPhoneField(){
      this.phone = ''
    }

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
.anchor{
  width: 180px;
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translate(-50%);
  animation: show 1s cubic-bezier(.17,.67,.37,1.18) 1;
}
@keyframes show {
  from{
    opacity: 0;
    transform:translate(-50%,100px);
  }
  to{
    opacity: 1;
    transform:translate(-50%,0px);
  }
}
</style>
