<template>
  <q-page padding>
    <div v-if="collectionNotFound === false">
      <!-- Title -->
      <div v-if="collection" class="row items-center q-pt-sm q-pb-none">
        <div class="text-h4 col-12 col-sm-6">
          {{ collection.name }} Collection
        </div>
        <div class="col-12 col-sm-6 gt-xs">
          <q-btn
            class="bg-primary float-right"
            flat
            color="white"
            icon="add"
            label="add product"
            @click="addProd = true"
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
                slug: catalog.slug
              }
            }"
          />
          <q-breadcrumbs-el
            v-if="catalog"
            label="Collection List"
            :to="{
              name:'collection-list',
              params: {
                slug: this.$route.params.catalogSlug
              }
            }"
          />
          <q-breadcrumbs-el>
            {{ collection.name }}
          </q-breadcrumbs-el>
        </q-breadcrumbs>
      </div>

      <!-- Colection products list-->
      <div class="row q-pt-lg q-col-gutter-md">
        <div class="col-12" v-for="product in collectionProducts" :key="product.id">
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
                        catalogSlug: catalog.slug,
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
                </q-item-section>
                <q-item-section side>
                  <q-btn size="12px" flat dense round icon="more_vert">
                    <q-menu auto-close>
                      <q-list style="width: 200px;">
                        <q-item
                          clickable
                          @click="makeRemoveProductPayload(product.product)"
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

      <!-- Add new products to collection dialog -->
      <q-dialog
        v-model="addProd"
        position="top"
        no-backdrop-dismiss
        @hide="newCollectionProduct.product = null"
      >
        <q-card class="q-mt-lg" style="width: 600px; max-width: 85vw;">
          <q-card-section>
            <div class="text-h5">Add product</div>
            <div class="text-subtitle2 text-grey-7 q-py-xs">
              Add product to {{ collection.name }} collection
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <div class="q-px-sm-md">
              <form
                class="q-gutter-sm"
                v-on:submit.prevent.stop="addProductToCollection"
              >
                <q-select
                  dense
                  lazy-rules
                  use-input
                  :options="options"
                  label="Product"
                  hint="Select product"
                  :error="productError.status"
                  :error-message="productError.message"
                  v-model="newCollectionProduct.product"
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
                  <q-btn flat label="Cancel" color="grey-7" v-close-popup />
                  <q-btn flat type="submit" label="Add new" color="primary" />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Remove product from collection dialog -->
      <q-dialog v-model="removeProd" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-md q-py-md text-center">
              Are you sure you want to remove <span class="text-weight-bold">{{ removeProductPayload.name }}</span> from this collection?
            </span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn flat label="Remove" color="primary" @click="removeCollectionProduct" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Floating button -->
      <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
        <q-btn fab icon="add" color="primary" @click="addProd = true">
          <q-tooltip>Add new product to this collection</q-tooltip>
        </q-btn>
      </q-page-sticky>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="collectionNotFound === true">
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
  name: 'CollectionDetail',
  data: function () {
    return {
      collectionNotFound: null,
      collection: {},
      catalog: {},
      collectionProducts: [],
      products: [],
      options: [],
      addProd: false,
      removeProd: false,
      newCollectionProduct: {
        collection: null,
        product: null
      },
      productError: {
        status: false,
        message: ''
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
      },
      removeProductPayload: {
        name: '',
        productSlug: null
      }
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCollectionDetail: function () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + self.$route.params.collectionSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collection = response.data
            self.collectionProducts = response.data.collection_products
            self.newCollectionProduct.collection = response.data.id
            self.collectionNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.collectionNotFound = true
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
        'catalogs/' + self.$route.params.catalogSlug + '/'
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
    },
    addProductToCollection: function () {
      let self = this
      let payload = {}
      payload.collection = self.newCollectionProduct.collection
      payload.product = self.newCollectionProduct.product.value
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.post(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + self.$route.params.collectionSlug + '/products/',
        payload
      )
        .then(function (response) {
          if (response.status === 201) {
            self.getCatalog()
            self.getCollectionDetail()
            self.getCatalogProducts()
            self.alertPayload.message = 'Product added successfully!'
            self.showAlert(self.alertPayload)
            self.addProd = false
          }
        })
        .catch(function (error) {
          if (error.response.data.non_field_errors[0].indexOf('The fields product, collection') > -1) {
            self.productError.message = 'You already have this product in this collection!'
            self.productError.status = true
            self.errorAlertPayload.message = 'You already have this product in this collection!'
            self.showAlert(self.errorAlertPayload)
          }
        })
    },
    showAlert: function (payload) {
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
    makeRemoveProductPayload: function (payload) {
      this.removeProductPayload.name = payload.name
      this.removeProductPayload.productSlug = payload.slug
      this.removeProd = true
    },
    removeCollectionProduct: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.delete(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + self.$route.params.collectionSlug + '/products/' + self.removeProductPayload.productSlug + '/'
      )
        .then(function (response) {
          if (response.status === 204) {
            self.products = []
            self.options = []
            self.getCatalog()
            self.getCollectionDetail()
            self.getCatalogProducts()
            self.alertPayload.message = 'Product removed successfully!'
            self.showAlert(self.alertPayload)
            self.removeProd = false
          }
        })
    }
  },
  created: function () {
    this.getCatalog()
    this.getCollectionDetail()
    this.getCatalogProducts()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
