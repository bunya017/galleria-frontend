<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated class="bg-white text-primary q-px-md-lg">
      <q-toolbar>
        <q-btn
          flat
          dense
          icon="menu"
          class="lt-md"
          v-if="!toggleSearch"
          @click="leftDrawer = !leftDrawer"
        />

        <router-link
          v-if="!toggleSearch"
          :class="{'q-pl-sm': $q.screen.lt.md}"
          :to="{
            name: 'store-home',
            params: {
              catalogSlug: storeCatalog.slug
            }
          }"
        >
          <q-toolbar-title class="text-primary">{{ storeCatalog.name }}</q-toolbar-title>
        </router-link>

        <q-space />

        <q-select
          hide-dropdown-icon
          v-model="searchPayload"
          autofocus
          use-input
          input-debounce="0"
          :options="options"
          :placeholder="['Search Products' ? '': !searchPayload]"
          style="width: 99vw;"
          dense
          behavior="menu"
          @filter="filterFunction"
          v-if="toggleSearch"
        >
          <template v-slot:before>
            <q-icon
              name="keyboard_backspace"
              color="primary"
              class="q-mr-md cursor-pointer"
              @click.stop="toggleSearch = false"
            />
          </template>
        </q-select>

        <q-btn
          flat
          dense
          icon="search"
          class="lt-md"
          v-if="!toggleSearch"
          @click="toggleSearch = true"
        />

        <q-tabs v-model="tab" shrink class="gt-sm">
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

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer
      v-model="leftDrawer"
      side="left"
      bordered
      no-swipe-open
      no-swipe-close
      :width="275"
      content-class="bg-grey-2"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area
        style="max-height: calc(100vh - 200px); margin-top: 200px; border-right: 1px solid #ddd"
        class="fit q-pa-sm"
      >
        <!-- Navigation menu -->
        <q-list padding>
          <!--
          <q-item class="q-py-md">
            <q-avatar size="200px">
              <img :src="storeCatalog.logo.small" />
            </q-avatar>
          </q-item>
        -->
          <q-item
            clickable
            v-ripple
            :to="{
              name: 'store-product-list',
              params: {
                catalogSlug: storeCatalog.slug
              }
            }"
          >
            <q-item-label class="text-black">Products</q-item-label>
          </q-item>
          <q-item
            clickable
            v-ripple
            :to="{
              name: 'store-category-list',
              params: {
                catalogSlug: storeCatalog.slug
              }
            }"
          >
            <q-item-label class="text-black">Categories</q-item-label>
          </q-item>
          <q-item
            clickable
            v-ripple
            :to="{
              name: 'store-collection-list',
              params: {
                catalogSlug: storeCatalog.slug
              }
            }"
          >
            <q-item-label class="text-black">Collections</q-item-label>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Hide drawer button -->
      <div v-if="leftDrawer" class="absolute" style="top: 15px; right: -40px">
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

      <q-img class="absolute-top" :src="storeCatalog.backgroundImage.small" style="height: 200px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="72px" class="q-mb-sm">
            <img v-if="storeCatalog.logo.thumbnail" :src="storeCatalog.logo.thumbnail">
            <img v-else :src="storeCatalog.backgroundImage.small">
          </q-avatar>
          <div class="text-weight-bold text-h6">{{ storeCatalog.name }}</div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  preFetch ({ store, currentRoute }) {
    return store.dispatch(
      'navbar/updateCatalogAction', currentRoute.params.catalogSlug
    )
  },
  name: 'StoreFrontLayout',
  data () {
    return {
      tab: '',
      leftDrawer: false,
      toggleSearch: false,
      searchPayload: '',
      products: null,
      options: []
    }
  },
  methods: {
    filterFunction (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.products.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }
  },
  computed: {
    storeCatalog () {
      return this.$store.state.navbar.catalog
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
