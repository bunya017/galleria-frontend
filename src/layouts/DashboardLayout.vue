<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header reveal :reveal-offset="75" elevated class="bg-white text-primary">
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
      <q-scroll-area class="fit">
        <!-- Navigation menu -->
        <q-list seperator class="q-pt-lg">
          <q-item clickable :to="{name:'my-catalogs'}">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="reply" />
            </q-item-section>
            Logout
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
  name: 'DashboardLayout',
  meta () {
    return {
      title: 'Dashboard',
      titleTemplate: title => `${title} - Galleria`
    }
  },
  data () {
    return {
      leftDrawer: false,
      date: new Date()
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
