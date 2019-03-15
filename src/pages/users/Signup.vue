<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="q-mt-lg" >
          <q-card-section>
            <div class="text-h6 text-center">Sign up</div>
            <div class="tesx-subtitle-2 text-center">
              To create and manage your product catalogues.
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <form v-on:submit.prevent>
                <div class="q-gutter-y-lg">
                  <q-input outlined dense v-model="user.username" type="text" label="Username">
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>

                  <q-input outlined dense v-model="user.email" type="email" label="Email">
                    <template v-slot:prepend>
                      <q-icon name="mail" />
                    </template>
                  </q-input>

                  <q-input outlined dense v-model="user.password" :type="isPwd ? 'password' : 'text'" label="Password">
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
                    <q-btn flat class="full-width bg-primary" type="submit" text-color="white" color="primary" label="Sign up" />
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
      user: {}
    }
  }
}
</script>

<style>
</style>
