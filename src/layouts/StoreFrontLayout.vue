<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated class="bg-white text-primary q-px-md-lg">
      <q-toolbar>
        <q-btn
          stretch
          flat
          :label="storeCatalog.name"
          :to="{
            name: 'store-home',
            params: {
              catalogSlug: storeCatalog.slug
            }
          }"
        />

        <q-space />

        <q-tabs v-model="tab" shrink>
          <q-route-tab
            exact
            name="products"
            label="Products"
            :to="{
              name: 'store-product-list',
              params: {
                catalogSlug: storeCatalog.slug
              }
            }"
          />
          <q-route-tab
            exact
            name="categories"
            label="Categories"
            :to="{
              name: 'store-category-list',
              params: {
                catalogSlug: storeCatalog.slug
              }
            }"
          />
          <q-route-tab
            exact
            name="collections"
            label="Collections"
            :to="{
              name: 'store-collection-list',
              params: {
                catalogSlug: storeCatalog.slug
              }
            }"
          />
        </q-tabs>
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
  data () {
    return {
      tab: ''
    }
  },
  computed: {
    storeCatalog () {
      return this.$store.state.navbar.catalog
    }
  }
}
</script>
