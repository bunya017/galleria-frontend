<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header
      :reveal-offset="75"
      v-model="loadingState"
      v-if="error404State === false"
      :reveal="this.$route.name !== 'store-search'"
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
              catalogSlug: this.$route.params.catalogSlug
            }
          }"
        >
          <q-toolbar-title class="text-primary">{{ catalogNameFromSlug }}</q-toolbar-title>
        </router-link>

        <q-space v-if="this.$route.name != 'store-search'" />

        <!-- Search input for md screen & above on search route -->
        <form @submit.prevent>
          <q-input
            v-model="searchPayload"
            outlined
            placeholder="Search Store..."
            v-if="$q.screen.gt.sm && this.$route.name == 'store-search'"
            style="width: 60vw;"
            class="q-mx-auto"
            type="search"
            dense
          >
            <template v-slot:after>
              <q-btn color="primary" type="submit" icon="search" @click.stop="setQueryParam" />
            </template>
          </q-input>
        </form>

        <!-- Search input for sm screen & below -->
        <form @submit.prevent>
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
              <q-btn dense color="primary" type="submit" icon="search" @click.stop="setQueryParam" />
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
        <form @submit.prevent>
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
              <q-btn dense color="primary" type="submit" icon="search" @click.stop="setQueryParam" />
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
                catalogSlug: this.$route.params.catalogSlug
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
                catalogSlug: this.$route.params.catalogSlug
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
                catalogSlug: this.$route.params.catalogSlug
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
        <q-tabs v-model="tab" v-if="loadingState === true" shrink class="gt-sm q-ml-md">
          <q-route-tab
            exact
            name="products"
            label="Products"
            :to="{
              name: 'store-product-list',
              params: {
                catalogSlug: this.$route.params.catalogSlug
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
                catalogSlug: this.$route.params.catalogSlug
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
                catalogSlug: this.$route.params.catalogSlug
              }
            }"
          />
        </q-tabs>
        <!-- Search input for sm screen & below on search route -->
        <form @submit.prevent>
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
              <q-btn color="primary" type="submit" icon="search" @click.stop="setQueryParam" />
            </template>
          </q-input>
        </form>
      </q-toolbar>
    </q-header>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer
      bordered
      side="left"
      :width="275"
      no-swipe-open
      no-swipe-close
      v-model="leftDrawer"
      :show-if-above="false"
      content-class="bg-white"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit">
        <!-- Navigation menu -->
        <q-list separator>
          <div class="text-h6 q-py-md q-px-sm">{{ catalogNameFromSlug }}</div>
          <q-separator />
          <q-item
            exact
            active-class="bg-deep-orange-1 "
            :to="{
              name: 'store-home',
              params: {
                catalogSlug: this.$route.params.catalogSlug
              }
            }"
            class="text-body1 text-weight-medium"
          >
            Home
          </q-item>
          <q-item
            exact
            active-class="bg-deep-orange-1 "
            :to="{
              name: 'store-category-list',
              params: {
                catalogSlug: this.$route.params.catalogSlug
              }
            }"
            class="text-body1 text-weight-medium"
          >
            Categories
          </q-item>
          <q-separator />
          <q-item
            exact
            active-class="bg-deep-orange-1 "
            :to="{
              name: 'store-collection-list',
              params: {
                catalogSlug: this.$route.params.catalogSlug
              }
            }"
            class="text-body1 text-weight-medium"
          >
            Collections
          </q-item>
          <q-separator />
          <q-item
            exact
            active-class="bg-deep-orange-1 "
            :to="{
              name: 'store-product-list',
              params: {
                catalogSlug: this.$route.params.catalogSlug
              }
            }"
            class="text-body1 text-weight-medium"
          >
            Products
          </q-item>
          <q-separator />
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
            <div class="text-h6">{{ catalogNameFromSlug }}</div>
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
  beforeRouteEnter (to, from, next) {
    next(vm => vm.$store.dispatch(
      'navbar/updateCatalogAction', to.params.catalogSlug
    ))
  },
  name: 'StoreFrontLayout',
  meta () {
    return {
      title: 'Home',
      titleTemplate: title => `${title} - ${this.catalogNameFromSlug}`
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
    },
    catalogNameFromSlug () {
      let slug = this.$route.params.catalogSlug
      return slug.split('-').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ')
    },
    loadingState () {
      return !this.$store.state.navbar.isLoading
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
