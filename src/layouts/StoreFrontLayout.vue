<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title>
          {{ storeCatalog.name }}
        </q-toolbar-title>
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
  preFetch ({ store, currentRoute }) {
    return store.dispatch('navbar/updateCatalogAction', currentRoute.params.catalogSlug)
  },
  name: 'StoreFrontLayout',
  computed: {
    storeCatalog () {
      return this.$store.state.navbar.catalog
    }
  }
}
</script>
