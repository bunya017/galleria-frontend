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
      <div class="row q-pt-lg q-col-gutter-md" v-if="featuredProducts.length > 0">
        <div class="col-12" v-for="product in featuredProducts" :key="product.id">
          <q-card>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-if="product.product.photos.length > 0" rounded size="56px">
                    <img :src="product.product.photos[0].photo.thumbnail">
                  </q-avatar>
                  <q-avatar v-else color="primary" text-color="white">
                    {{ product.product.name.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <router-link
                    v-if="catalog.slug"
                    :to="{
                      name: 'product-detail',
                      params: {
                        catalogSlug: catalogSlug,
                        referenceId: product.product.reference_id,
                        productSlug: product.product.slug
                      }
                    }"
                  >
                    <q-item-label>{{ product.product.name }}</q-item-label>
                    <q-item-label caption>
                      {{ product.product.description }}
                    </q-item-label>
                    <q-item-label caption class="q-pt-sm text-weight-bold">
                      ₦{{ product.product.price }}
                    </q-item-label>
                  </router-link>
                </q-item-section><q-item-section side>
                  <q-btn size="12px" flat dense round icon="more_vert">
                    <q-menu auto-close>
                      <q-list style="width: 200px;">
                        <q-item
                          clickable
                          @click="makeRemoveFeaturedPayload(product.product)"
                        >
                          <q-item-section avatar>
                            <q-avatar rounded icon="delete" />
                          </q-item-section>
                          <q-item-section>
                            Remove
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
      <div v-else class="row jutify-center text-center q-pb-md" style="padding-top: 10vh;">
        <div class="col-12 q-px-md">
          <img height="150" width="150" alt="Quasar logo" src="../../assets/undraw-no-data.svg">
          <div class="text-body1 q-py-sm">
            You have not added any featured product yet. Click on the
            <q-btn v-if="$q.screen.lt.sm" round size="xs" color="primary" icon="add" />
            <q-btn v-else size="sm" dense class="q-py-xs" color="primary" icon="add" label="ADD PRODUCT" />
            button to add one.
          </div>
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
                v-on:submit.prevent.stop="addFeaturedProduct"
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

      <!-- Remove product from collection dialog -->
      <q-dialog v-model="removeFeatured" persistent @hide="clearRemoveFeaturedPayload">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-md q-py-md text-center">
              Are you sure you want to remove <span class="text-weight-bold">{{ removeFeaturedPayload.name }}</span> from featured products?
            </span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              color="grey-7"
              v-close-popup
            />
            <q-btn
              label="Remove"
              color="primary"
              @click="removeFeaturedProduct"
              :loading="removeFeaturedButtonLoading"
              :disabled="removeFeaturedButtonLoading"
            />
          </q-card-actions>
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
      removeFeatured: false,
      removeFeaturedButtonLoading: false,
      addProductButtonLoading: false,
      newFeaturedProduct: {
        collection: null,
        product: null
      },
      productError: {
        status: false,
        message: ''
      },
      removeFeaturedPayload: {
        name: '',
        productSlug: ''
      },
      alertPayload: {
        color: 'green-1',
        textColor: 'positive',
        icon: 'check_circle',
        position: 'top',
        message: '',
        classes: 'q-mt-xl'
      },
      errorAlertPayload: {
        color: 'red-1',
        textColor: 'negative',
        icon: 'error',
        position: 'top',
        message: '',
        classes: 'q-mt-xl'
      }
    }
  },
  methods: {
    getAuthToken () {
      return sessionStorage.getItem('authToken')
    },
    getFeaturedProducts () {
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
            self.newFeaturedProduct.collection = response.data.id
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
    getCatalog () {
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
    getCatalogProducts () {
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
    filterFunction (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.products.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    showAlert (payload) {
      const {
        color, textColor, message, icon,
        position, classes
      } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        classes
      })
    },
    addFeaturedProduct () {
      let self = this
      self.addProductButtonLoading = true
      let payload = {}
      payload.collection = self.newFeaturedProduct.collection
      payload.product = self.newFeaturedProduct.product.value
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.post(
        'catalogs/' + self.catalogSlug + '/collections/featured-products/products/',
        payload
      )
        .then(function (response) {
          if (response.status === 201) {
            self.getCatalog()
            self.getFeaturedProducts()
            self.getCatalogProducts()
            self.alertPayload.message = 'Product added successfully!'
            self.showAlert(self.alertPayload)
            self.addProductButtonLoading = false
            self.addFeatured = false
          }
        })
        .catch(function (error) {
          if (error.response.data.non_field_errors[0].indexOf('The fields product, collection') > -1) {
            self.productError.message = 'You already have this product in this collection!'
            self.productError.status = true
            self.errorAlertPayload.message = 'You already have this product in this collection!'
            self.addProductButtonLoading = false
            self.showAlert(self.errorAlertPayload)
          }
          if (error.response.status === 404) {
            self.notFound = true
          }
        })
    },
    makeRemoveFeaturedPayload (payload) {
      this.removeFeaturedPayload.name = payload.name
      this.removeFeaturedPayload.productSlug = payload.slug
      this.removeFeatured = true
    },
    clearRemoveFeaturedPayload () {
      this.removeFeatured = false
      this.removeFeaturedPayload.name = ''
      this.removeFeaturedPayload.productSlug = ''
    },
    removeFeaturedProduct () {
      let self = this
      self.removeFeaturedButtonLoading = true
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.delete(
        'catalogs/' + self.catalogSlug + '/collections/featured-products/products/' +
        self.removeFeaturedPayload.productSlug + '/'
      )
        .then(function (response) {
          if (response.status === 204) {
            self.removeFeaturedButtonLoading = false
            self.alertPayload.message = 'Product removed successfully!'
            self.showAlert(self.alertPayload)
            self.removeFeatured = false
            self.getFeaturedProducts()
            self.getCatalog()
            self.getCatalogProducts()
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
    this.getCatalog()
    this.getCatalogProducts()
    this.getFeaturedProducts()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
