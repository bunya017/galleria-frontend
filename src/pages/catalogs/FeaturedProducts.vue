<template>
  <q-page padding>
    <div v-if="notFound === false">
      <!-- Title -->
      <div class="row items-center q-pt-sm q-pb-none">
        <div class="text-h4 col-12 col-sm-6">
          Featured Products
        </div>
        <div class="col-12 col-sm-6 gt-xs">
          <q-btn
            class="bg-primary float-right"
            flat
            color="white"
            icon="add"
            label="add product"
          />
        </div>
      </div>
      <!-- Breadcrumbs -->
      <div class="q-pa-sm q-gutter-sm">
        <q-breadcrumbs separator="/" class="text-uppercase breadcrumbs-text" gutter="xs">
          <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
          <q-breadcrumbs-el
            v-if="catalog.slug"
            :label="catalog.name"
            :to="{
              name:'catalog-detail',
              params: {
                slug: this.catalogSlug
              }
            }"
          />
          <q-breadcrumbs-el>
            Featured Products
          </q-breadcrumbs-el>
        </q-breadcrumbs>
      </div>
    </div>
    <div
      style="padding-top: 25vh;"
      v-if="notFound === true"
      class="row jutify-center text-center"
    >
      <div class="col-12 q-px-md">
        <div class="text-h2 q-pb-lg">404</div>
        <p class="text-body1">We can't seem to find the page you're looking for.</p>
        <div class="q-gutter-sm q-py-sm">
          <q-btn
            color="primary"
            label="Go back"
            @click="$router.back()"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'FeaturedProducts',
  meta () {
    return {
      title: 'Featured Products'
    }
  },
  data () {
    return {
      collection: {},
      featuredProducts: [],
      notFound: null,
      catalog: {}
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getFeaturedProducts: function () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.catalogSlug + '/collections/featured-products/?is_featured=true'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collection = response.data
            self.featuredProducts = response.data.collection_products
            self.notFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.notFound = true
            self.$q.loading.hide()
          }
        })
    },
    getCatalog: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.catalogSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.catalog = response.data
          }
        })
    }
  },
  computed: {
    catalogSlug () {
      return this.$route.params.catalogSlug
    }
  },
  created () {
    this.getFeaturedProducts()
  }
}
</script>
