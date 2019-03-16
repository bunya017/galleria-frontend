<template>
  <q-page padding>
    <div class="text-h4">{{ catalog.name }}</div>
    <div class="q-px-sm q-gutter-sm">
      <q-breadcrumbs separator=">">
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          :label="catalog.name"
          :to="{
            name:'my-catalogs',
            params: {
              slug: this.$route.params.slug
            }
          }"
        />
      </q-breadcrumbs>
    </div>

    <div class="row q-pt-lg q-pb-xl q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="cursor-pointer" style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">Add new category</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ categoryCount }} Categories</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ productCount }} Products</div>
            <div class="text-subtitle2">across all categories</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ activeProducts }} Active</div>
            <div class="text-subtitle2">Products</div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CatalogDetail',
  data: function () {
    return {
      categoryCount: 0,
      productCount: 0,
      activeProducts: 0,
      catalog: {}
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCatalogDetail: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.slug
      )
        .then(function (response) {
          self.catalog = response.data
          self.categoryCount = response.data.categories.length
          self.productCount = self.getProductCount(response.data.categories)
        })
    },
    getProductCount: function (payload) {
      let productsAmount = 0
      for (let i = 0; i < payload.length; i++) {
        productsAmount += payload[i].product_entries.length
      }
      return productsAmount
    }
  },
  created: function () {
    this.getCatalogDetail()
  }
}
</script>

<style>
</style>
