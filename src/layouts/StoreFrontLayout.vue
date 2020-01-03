<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header
      :reveal="this.$route.name !== 'store-search'"
      :reveal-offset="75"
      v-if="error404State === false"
      elevated class="bg-white text-primary q-px-md-lg"
    >
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

        <q-space v-if="this.$route.name != 'store-search'" />

        <!-- Search input for md screen & above on search route -->
        <form @submit.prevent.stop="setQueryParam">
          <q-input
            v-model="searchPayload"
            outlined
            placeholder="Search Store..."
            v-if="$q.screen.gt.sm && this.$route.name == 'store-search'"
            style="width: 60vw;"
            class="q-ml-lg"
            type="search"
            dense
          >
            <template v-slot:after>
              <q-btn type="submit" color="primary" icon="search" />
            </template>
          </q-input>
        </form>

        <!-- Search input for sm screen & below -->
        <form @submit.prevent.stop="setQueryParam">
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
            <template v-slot:append v-if="!searchPayload">
              <q-icon
                name="search"
              />
            </template>
            <template v-slot:after v-if="searchPayload">
              <q-btn dense color="primary" type="submit" icon="search" />
            </template>
          </q-input>
        </form>

        <q-btn
          flat
          dense
          icon="search"
          class="lt-md"
          v-if="!toggleSearch && this.$route.name != 'store-search'"
          @click="toggleSearch = true"
        />
        <!-- Search input for md screen & above -->
        <form @submit.prevent.stop="setQueryParam">
          <q-input
            v-model="searchPayload"
            placeholder="Search Store..."
            :style="{ width: searchInputSize + 'px' }"
            dense
            outlined
            @focus="searchInputSize = 400"
            @blur="searchInputSize = 200"
            type="search"
            v-if="$q.screen.gt.sm && this.$route.name != 'store-search'"
          >
            <template v-slot:append v-if="!searchPayload">
              <q-icon
                name="search"
              />
            </template>
            <template v-slot:after v-if="searchPayload">
              <q-btn type="submit" dense flat color="primary" icon="search" />
            </template>
          </q-input>
        </form>

        <!-- route tabs -->
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
      </q-toolbar>
      <q-toolbar
        inset
        v-if="$q.screen.gt.md || this.$route.name === 'store-search'"
        class="q-px-sm"
      >
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
        <!-- Search input for sm screen & below on search route -->
         <form @submit.prevent.stop="setQueryParam">
          <q-input
            v-model="searchPayload"
            outlined
            placeholder="Search Store..."
            v-if="$q.screen.lt.sm && this.$route.name === 'store-search'"
            style="width: 99vw;"
            type="search"
            dense
          >
            <template v-slot:after>
              <q-btn color="primary" type="submit" icon="search" />
            </template>
          </q-input>
        </form>
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
      content-class="bg-white"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area
        style="max-height: calc(100vh - 200px); margin-top: 200px; border-right: 1px solid #ddd"
        class="fit q-pa-sm"
      >
        <!-- Navigation menu -->
        <q-list>
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
      <div id="footer" class="q-pt-lg"  v-if="error404State === false">
        <div id="brand-section" class="bg-grey-3 row q-py-xl q-px-md q-pa-sm-xl">
          <div class="col-12 col-sm-6">
            <q-avatar size="36px" class="q-mb-sm">
              <img v-if="storeCatalog.logo.thumbnail" :src="storeCatalog.logo.thumbnail">
            </q-avatar>
            <div class="text-h6">{{ storeCatalog.name }}</div>
            <div class="q-py-md q-gutter-sm text-grey-9">
              <q-icon size="sm" name="ion-logo-facebook" />
              <q-icon size="sm" name="ion-logo-instagram" />
              <q-icon size="sm" name="ion-logo-twitter" />
              <q-icon size="sm" name="ion-logo-whatsapp" />
            </div>
          </div>
          <div id="contact-us-section" class="col-12 col-sm-6 q-pt-lg q-pt-sm-none">
            <p><strong>Contact Us</strong></p>
            <p>{{ storeCatalog.contactAddress }}</p>
            <p>
              <a :href="'tel:' + storeCatalog.contactPhone">
                {{ storeCatalog.contactPhone }}
              </a>
            </p>
            <p>
              <a :href="'mailto:' + storeCatalog.contactEmail">
                {{ storeCatalog.contactEmail }}
              </a>
            </p>
          </div>
        </div>
      </div>
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
  meta () {
    return {
      title: 'Home',
      titleTemplate: title => `${title} - ${this.storeCatalog.name}`
    }
  },
  data () {
    return {
      tab: '',
      leftDrawer: false,
      toggleSearch: false,
      searchPayload: '',
      searchInputSize: 200
    }
  },
  methods: {
    setQueryParam () {
      if (this.searchPayload !== '') {
        this.toggleSearch = false
        this.$router.push({
          name: 'store-search',
          query: {
            name: this.searchPayload
          }
        })
      }
    }
  },
  computed: {
    storeCatalog () {
      return this.$store.state.navbar.catalog
    },
    error404State () {
      return this.$store.state.navbar.is404
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
