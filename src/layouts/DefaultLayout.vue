<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <!-- @click="leftDrawer = !leftDrawer" -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title>
          Galleria <q-badge color="negative" label="v0.1.0-alpha.1" />
        </q-toolbar-title>

        <q-space />

        <q-btn-group flat stretch class="gt-xs">
          <q-btn
            flat
            label="Login"
            type="a"
            to="/login"
          />
          <q-btn
            flat
            label="Signup"
            type="a"
            to="/signup"
          />
        </q-btn-group>

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
      leftDrawer: true
    }
  }
}
</script>
