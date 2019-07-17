<template>
  <q-page padding>
    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-gutter-sm">
      <q-breadcrumbs separator=">>">
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          v-if="catalog"
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

    <!-- Title -->
    <div v-if="collection"  class="row items-center q-pt-sm q-pb-lg">
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
        >
          <q-tooltip>Add new product to this collection</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Add new products to collection dialog -->
    <q-dialog v-model="addProd" position="top" no-backdrop-dismiss>
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
                v-model="newCollectionProduct.product"
                @filter="filterFunction"
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
                <q-btn flat label="Cancel" color="negative" v-close-popup />
                <q-btn flat type="submit" label="Add new" color="primary" />
              </q-card-actions>
            </form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Floating button -->
    <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary" @click="addProd = true">
        <q-tooltip>Add new product to this collection</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'CollectionDetail',
  data: function () {
    return {
      collection: {},
      catalog: {},
      products: [],
      options: [],
      addProd: false,
      newCollectionProduct: {
        collection: null,
        product: null
      },
      alertPayload: {
        color: 'positive',
        textColor: 'white',
        icon: 'thumb_up',
        position: 'top',
        message: '',
        closeBtn: 'Close',
        classes: 'q-mt-xl'
      }
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCollectionDetail: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + self.$route.params.collectionSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collection = response.data
            self.newCollectionProduct.collection = response.data.id
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
    getProducts: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/'
      )
        .then(function (response) {
          if (response.status === 200) {
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
            self.getProducts()
            self.alertPayload.message = 'Product added successfully!'
            self.showAlert(self.alertPayload)
            self.addProd = false
          }
        })
    },
    showAlert: function (payload) {
      const {
        color, textColor, message, icon,
        position, closeBtn, classes
      } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        closeBtn,
        classes
      })
    }
  },
  created: function () {
    this.getCatalog()
    this.getCollectionDetail()
    this.getProducts()
  }
}
</script>

<style>
</style>
