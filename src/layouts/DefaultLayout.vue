<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <!-- @click="leftDrawer = !leftDrawer" -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title>
          Galleria
        </q-toolbar-title>
        <q-space />
        <q-btn-group flat class="sm">
          <q-btn
            flat
            label="menu"
          />
          <q-btn
            flat
            label="menu"
          />
          <q-btn
            flat
            label="menu"
          />
        </q-btn-group>

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
  // name: 'LayoutName',

  data () {
    return {
      leftDrawer: true
    }
  }
}
</script>
