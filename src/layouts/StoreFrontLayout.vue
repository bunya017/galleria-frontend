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
          v-if="!toggleSearch || this.$route.name == 'store-search'"
          @click="leftDrawer = !leftDrawer"
        />

        <router-link
          v-if="!toggleSearch || this.$route.name == 'store-search'"
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

        <q-tabs v-model="tab" v-if="this.$route.name != 'store-search'" shrink class="gt-sm q-ml-md">
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

        <q-space v-if="this.$route.name != 'store-search'" />

        <!-- Search input for sm screen & below -->
        <q-input
          v-model="searchPayload"
          autofocus
          placeholder="Search Store..."
          style="width: 99vw;"
          dense
          v-if="toggleSearch && this.$route.name != 'store-search'"
        >
          <template v-slot:before>
            <q-icon
              name="keyboard_backspace"
              color="primary"
              class="q-mr-md cursor-pointer"
              @click.stop="toggleSearch = false"
            />
          </template>
          <template v-slot:append>
            <q-icon
              name="search"
              class="cursor-pointer"
              @click.stop
            />
          </template>
        </q-input>

        <q-btn
          flat
          dense
          icon="search"
          class="lt-md"
          v-if="!toggleSearch && this.$route.name != 'store-search'"
          @click="toggleSearch = true"
        />
        <!-- Search input for md screen & above -->
        <q-input
          v-model="searchPayload"
          outlined
          placeholder="Search Store..."
          style="width: 250px;"
          dense
          v-if="$q.screen.gt.sm && this.$route.name != 'store-search'"
        >
          <template v-slot:append>
            <q-icon
              name="search"
            />
          </template>
        </q-input>
      </q-toolbar>
      <q-toolbar inset>
        <q-tabs v-model="tab" shrink class="gt-sm q-ml-md">
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
      :show-if-above="false"
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
      searchPayload: ''
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
