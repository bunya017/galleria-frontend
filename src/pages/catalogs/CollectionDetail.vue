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
            <form class="q-gutter-sm">
              <q-select
                dense
                lazy-rules
                use-input
                hide-selected
                :options="options"
                label="Product"
                hint="Select product"
                v-model="newCollectionProduct.product"
                style="width: auto;"
              />
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
      options: [
        'sdfsfd', 'sdfgsfg'
      ],
      addProd: false,
      newCollectionProduct: {
        collection: null,
        product: null
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
            self.newProduct.collection = response.data.id
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
            self.products = response.data
          }
        })
    }
  },
  created: function () {
    this.getCatalog()
    this.getCollectionDetail()
  }
}
</script>

<style>
</style>
