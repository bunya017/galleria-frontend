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
                    ref="username"
                    dense
                    autofocus
                    type="text"
                    label="Username"
                    bottom-slots
                    lazy-rules
                    :error="usernameError.status"
                    v-model="user.username"
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
                    ref="email"
                    dense
                    type="text"
                    label="Email"
                    v-model="user.email"
                    bottom-slots
                    lazy-rules
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
                    ref="password"
                    dense
                    label="Password"
                    hint="Minimum of 8 characters"
                    counter
                    v-model="user.password"
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
                  </q-input>

                  <div class="col-6">
                    <q-btn no-caps flat class="full-width bg-primary" type="submit" text-color="white" color="primary" label="Sign up" />
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
  // name: 'PageName',
  data: function () {
    return {
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
      self.$refs.username.validate()
      self.$refs.email.validate()
      self.$refs.password.validate()
      if (
        self.$refs.username.hasError ||
        self.$refs.email.hasError ||
        self.$refs.password.hasError
      ) {
        self.formHasError = true
      } else {
        self.$axios.post(
          '/users/signup/',
          self.user
        )
          .then(function (response) {
            sessionStorage.setItem('authToken', response.data.token)
            self.$router.push({ name: 'my-catalogs' })
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
