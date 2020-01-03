<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="q-mt-lg" >
          <q-card-section>
            <div class="text-h4 text-center">Sign up</div>
            <div class="tesx-subtitle-2 text-center">
              To create and manage your product catalogues.
            </div>
          </q-card-section>

          <q-card-section class="q-pb-lg">
            <div class="q-pa-md">
              <form v-on:submit.prevent.stop="registerUser">
                <div class="q-gutter-y-lg">
                  <q-input
                    :dense="$q.screen.gt.sm"
                    lazy-rules
                    type="text"
                    bottom-slots
                    ref="username"
                    label="Username"
                    v-model="user.username"
                    :error="usernameError.status"
                    :rules="[ val => !!val || 'This field is required.' ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                    <template v-slot:error>
                      {{ usernameError.message }}
                    </template>
                  </q-input>

                  <q-input
                    :dense="$q.screen.gt.sm"
                    lazy-rules
                    ref="email"
                    type="text"
                    label="Email"
                    bottom-slots
                    v-model="user.email"
                    :error="emailError.status"
                    :rules="[
                      val => !!val || 'This field is required.',
                      validateEmail
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="mail" />
                    </template>
                    <template v-slot:error>
                      {{ emailError.message }}
                    </template>
                  </q-input>

                  <q-input
                    :dense="$q.screen.gt.sm"
                    counter
                    lazy-rules
                    bottom-slots
                    ref="password"
                    label="Password"
                    v-model="user.password"
                    :error="passwordError.status"
                    hint="Minimum of 8 characters"
                    :type="isPwd ? 'password' : 'text'"
                    :rules="[
                      val => val.length >= 8 || 'Password must be atleast of 8 characters',
                      val => !!val || 'This field is required.'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="vpn_key" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                    <template v-slot:error>
                        {{ passwordError.message }}
                      </template>
                    </q-input>

                  <div class="col-6">
                    <q-btn
                      flat
                      no-caps
                      type="submit"
                      label="Sign up"
                      color="primary"
                      text-color="white"
                      class="full-width bg-primary"
                      :loading="signupButtonLoading"
                    />
                  </div>
                </div>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Signup',
  meta () {
    return {
      title: 'Signup'
    }
  },
  data: function () {
    return {
      signupButtonLoading: false,
      isPwd: true,
      user: {
        username: '',
        email: '',
        password: ''
      },
      passwordError: {
        status: false,
        message: ''
      },
      usernameError: {
        status: false,
        message: ''
      },
      emailError: {
        status: false,
        message: ''
      }
    }
  },
  methods: {
    registerUser: function () {
      let self = this
      self.signupButtonLoading = true
      self.$refs.username.validate()
      self.$refs.email.validate()
      self.$refs.password.validate()
      if (
        self.$refs.username.hasError ||
        self.$refs.email.hasError ||
        self.$refs.password.hasError
      ) {
        self.formHasError = true
        self.signupButtonLoading = false
      } else {
        self.$axios.post(
          '/users/signup/',
          self.user
        )
          .then(function (response) {
            if (response.status === 201) {
              sessionStorage.setItem('authToken', response.data.token)
              self.$store.dispatch(
                'dashStore/setLoggedInStatusAction',
                {
                  isLoggedIn: true,
                  authToken: response.data.token
                }
              )
              self.signupButtonLoading = false
              self.$router.push({ name: 'my-catalogs' })
            }
          })
          .catch(function (error) {
            if (error.response.data.username) {
              self.usernameError.message = error.response.data.username[0]
              self.usernameError.status = true
            }
            if (error.response.data.email) {
              self.emailError.message = error.response.data.email[0]
              self.emailError.status = true
            }
            if (error.response.data.password) {
              self.passwordError.message = error.response.data.password[0]
              self.passwordError.status = true
            }
            self.signupButtonLoading = false
          })
      }
    },
    validateEmail: function (val) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return (re.test(val) || 'Please enter a valid email.')
    }
  }
}
</script>

<style>
</style>
