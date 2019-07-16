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
        >
          <q-tooltip>Add new product to this collection</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Floating button -->
    <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary">
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
      catalog: {}
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
