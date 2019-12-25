<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        />
        <q-toolbar-title>
          Galleria <q-badge color="grey-7" label="beta" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer
      v-model="leftDrawer"
      side="left"
      bordered
      show-if-above
      no-swipe-open
      no-swipe-close
      :width="250"
      content-class="bg-grey-2"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Navigation menu -->
        <q-list padding seperator>
          <q-item clickable v-ripple :to="{name:'my-catalogs'}">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label header class="text-black">Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="reply" />
            </q-item-section>
            <q-item-section>
              <q-item-label header class="text-black">Logout</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Hide drawer button -->
      <div v-if="leftDrawer" class="absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="primary"
          icon="chevron_left"
          class="lt-md"
          @click="leftDrawer = false"
        />
      </div>
    </q-drawer>

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
  },
  methods: {
    logout () {
      let self = this
      sessionStorage.removeItem('authToken')
      self.$store.dispatch(
        'dashStore/setLoggedInStatusAction',
        {
          isLoggedIn: false,
          authToken: ''
        }
      )
      self.$router.push({ name: 'login' })
    }
  }
}
</script>
