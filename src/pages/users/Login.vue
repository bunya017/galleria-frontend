<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="q-mt-lg" >
          <q-card-section>
            <div class="text-h4 text-center">Welcome!</div>
            <div class="tesx-subtitle-2 text-center">
              Log into your galleria acconut.
            </div>
          </q-card-section>

          <q-card-section class="q-py-xl">
            <div class="q-pa-md">
              <form v-on:submit.prevent="login">
                <div class="q-gutter-y-lg">
                  <q-input
                    dense
                    autofocus
                    type="text"
                    label="Username"
                    bottom-slots
                    :error="usernameError.status"
                    v-model="user.username"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                    <template v-slot:error>
                      {{ usernameError.message }}
                    </template>
                  </q-input>

                  <q-input
                    dense
                    :type="isPwd ? 'password' : 'text'"
                    label="Password"
                    bottom-slots
                    :error="passwordError.status"
                    v-model="user.password"
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
                      label="Login"
                      color="primary"
                      :loading="loginButtonLoading"
                      text-color="white"
                      class="full-width bg-primary"
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
  // name: 'PageName',
  data: function () {
    return {
      loginButtonLoading: false,
      isPwd: true,
      user: {
        username: '',
        password: ''
      },
      alertPayload: {
        color: 'red-1',
        textColor: 'negative',
        icon: 'error',
        position: 'top',
        message: '',
        classes: 'q-mt-xl'
      },
      usernameError: {
        status: false,
        message: ''
      },
      passwordError: {
        status: false,
        message: ''
      }
    }
  },
  methods: {
    login: function () {
      let self = this
      self.loginButtonLoading = true
      self.$axios.post(
        '/users/token-auth/',
        self.user
      )
        .then(function (response) {
          if (response.status === 200) {
            sessionStorage.setItem('authToken', response.data.token)
            self.$store.dispatch(
              'dashStore/setLoggedInStatusAction',
              {
                isLoggedIn: true,
                authToken: response.data.token
              }
            )
            self.loginButtonLoading = false
            self.$router.push({ name: 'my-catalogs' })
          }
        })
        .catch(function (error) {
          if (error.response.data.username) {
            self.usernameError.message = error.response.data.username[0]
            self.usernameError.status = true
          }
          if (error.response.data.password) {
            self.passwordError.message = error.response.data.password[0]
            self.passwordError.status = true
          }
          if (error.response.data.non_field_errors) {
            self.alertPayload.message = error.response.data.non_field_errors[0]
            self.showAlert(self.alertPayload)
          }
          self.loginButtonLoading = false
        })
    },
    showAlert: function (payload) {
      const { color, textColor, message, icon, position, classes } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        classes
      })
    }
  }
}
</script>

<style>
</style>
