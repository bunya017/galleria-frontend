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
      <div id="footer" class="q-pt-lg">
        <div id="brand-section" class="bg-grey-3 row q-py-xl q-px-md q-pa-sm-xl">
          <div class="col-12 text-center">
            Copyright © {{ date.getFullYear() }}, <span class="text-primary">Galleria</span>. All Rights Reserved.
          </div>
        </div>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'DefaultLayout',
  meta () {
    return {
      title: 'Welcome',
      titleTemplate: title => `${title} - Galleria`
    }
  },
  data () {
    return {
      leftDrawer: true,
      tab: '',
      date: new Date()
    }
  }
}
</script>
