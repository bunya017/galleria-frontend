<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <!-- @click="leftDrawer = !leftDrawer" -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title>
          Galleria <q-badge color="grey-7" label="beta" />
        </q-toolbar-title>

        <q-space />

        <q-tabs v-model="tab" shrink class="gt-sm">
          <q-route-tab
            exact
            name="login"
            label="Login"
            to="/login"
          />
          <q-route-tab
            exact
            name="signup"
            label="Signup"
            to="/signup"
          />
        </q-tabs>

        <q-btn flat icon="menu" class="xs">
          <q-menu auto-close>
            <q-list style="min-width: 70vw;">
              <q-item clickable to='/login'>
                <q-item-section>
                  Login
                </q-item-section>
              </q-item>
              <q-item clickable to='/signup'>
                <q-item-section>
                  Signup
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      leftDrawer: true,
      tab: ''
    }
  }
}
</script>
