<template>
  <q-page padding>
    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-gutter-sm">
      <q-breadcrumbs separator=">>">
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          :label="product.category.catalog.name"
          :to="{
            name:'catalog-detail',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el
          label="Products List"
          :to="{
            name:'products-list',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el :label="product.name" />
      </q-breadcrumbs>
    </div>
    <q-card flat class="row q-pa-md">
      <div class="col-12 col-sm-6">
        <q-img :src="product.photos[0].photo" />
      </div>
      <div class="col-12 col-sm-6 q-pl-sm-md q-pt-lg q-pt-sm-lg">
        <div class="text-uppercase text-h5">{{ product.name }}</div>
        <div class="text-caption text-italic text-grey-6">in {{ product.description }}</div>
        <div class="text-subtitle1 text-grey-8">{{ product.description }}</div>
        <div class="text-h5 q-pt-md q-pt-sm-xl">{{ product.price }}</div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'ProductDetailView',
  data: function () {
    return {
      product: {}
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getProductDetail: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/p/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId
      )
        .then(function (response) {
          self.product = response.data
        })
    }
  },
  created: function () {
    this.getProductDetail()
  }
}
</script>

<style>
</style>
