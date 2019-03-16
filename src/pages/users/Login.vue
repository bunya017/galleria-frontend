<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="q-mt-lg" >
          <q-card-section>
            <div class="text-h4 text-center">Welcome back!</div>
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
                    v-model="user.username"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>

                  <q-input
                    dense
                    label="Password"
                    v-model="user.password"
                    :type="isPwd ? 'password' : 'text'"
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
                    <q-btn no-caps flat class="full-width bg-primary" type="submit" text-color="white" color="primary" label="Login" />
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
        password: ''
      },
      alertPayload: {
        color: 'negative',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        message: '',
        closeBtn: 'Close',
        classes: 'q-mt-xl'
      }
    }
  },
  methods: {
    login: function () {
      let self = this
      self.$axios.post(
        '/users/token-auth/',
        self.user
      )
        .then(function (response) {
          sessionStorage.setItem('authToken', response.data.token)
          self.$router.push({ name: 'my-catalogs' })
        })
        .catch(function (error) {
          if (error.response.data.non_field_errors) {
            self.alertPayload.message = error.response.data.non_field_errors[0]
            self.showAlert(self.alertPayload)
          }
        })
    },
    showAlert: function (payload) {
      const { color, textColor, message, icon, position, closeBtn, classes } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        closeBtn,
        classes
      })
    }
  }
}
</script>

<style>
</style>
