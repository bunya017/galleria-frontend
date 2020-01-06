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
            @click="addFeatured = true"
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

      <!-- Featured products list -->
      <div v-if="featuredProducts.length > 0"></div>
      <div v-else class="row jutify-center text-center" style="padding-top: 10vh;">
        <div class="col-12 q-px-md">
          <img height="150" width="150" alt="Quasar logo" src="../../assets/undraw-no-data.svg">
          <div class="text-body1 q-py-sm">No featured product yet.</div>
        </div>
      </div>

      <!-- Add new products to collection dialog -->
      <q-dialog
        v-model="addFeatured"
        position="top"
        no-backdrop-dismiss
        @hide="newFeaturedProduct.product = null"
      >
        <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
          <q-card-section>
            <div class="text-h5">Add product</div>
            <div class="text-subtitle2 text-grey-7 q-py-xs">
              Add a featured product
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <div class="q-px-sm-md">
              <form
                class="q-gutter-sm"
              >
                <q-select
                  dense
                  lazy-rules
                  :use-input="$q.screen.gt.sm"
                  :options="options"
                  label="Product"
                  hint="Select product"
                  :error="productError.status"
                  :error-message="productError.message"
                  v-model="newFeaturedProduct.product"
                  @filter="filterFunction"
                  @input="productError.status = false"
                >
                  <template v-slot:option="scope">
                    <q-item
                      v-bind="scope.itemProps"
                      v-on="scope.itemEvents"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          rounded
                          size="36px"
                        >
                          <img :src="scope.opt.thumbnail">
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label v-html="scope.opt.label" />
                        <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                  <q-btn
                    flat
                    label="Cancel"
                    color="grey-7"
                    v-close-popup
                  />
                  <q-btn
                    type="submit"
                    label="Add new"
                    color="primary"
                    :loading="addProductButtonLoading"
                    :disabled="addProductButtonLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Floating button -->
      <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
        <q-btn fab icon="add" color="primary" @click="addFeatured = true">
          <q-tooltip>Add a new featured product</q-tooltip>
        </q-btn>
      </q-page-sticky>
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
      catalog: {},
      products: [],
      options: [],
      addFeatured: false,
      addProductButtonLoading: false,
      newFeaturedProduct: {
        collection: null,
        product: null
      },
      productError: {
        status: false,
        message: ''
      }
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
    },
    getCatalogProducts: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.products = [] // Clear products & options list before pushing
            self.options = [] // new productList from server
            for (let i = 0; i < response.data.length; i++) {
              self.products.push({
                label: response.data[i].name,
                value: response.data[i].id,
                description: response.data[i].description,
                thumbnail: response.data[i].photos[0].photo.thumbnail
              })
            }
          }
        })
    },
    filterFunction: function (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.products.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }
  },
  computed: {
    catalogSlug () {
      return this.$route.params.catalogSlug
    }
  },
  created () {
    this.getCatalog()
    this.getCatalogProducts()
    this.getFeaturedProducts()
  }
}
</script>
