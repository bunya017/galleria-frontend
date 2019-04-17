<template>
  <q-page padding>
    <div class="text-h4">Products List</div>
  </q-page>
</template>

<script>
export default {
  name: 'ProductsList',
  data: function () {
    return {
      products: [],
      catalog: {}
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getProductsList: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/p/products/'
      )
        .then(function (response) {
          self.products = response.data
        })
    },
    getproductsCatalog: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug
      )
        .then(function (response) {
          self.catalog = response.data
        })
    }
  },
  created: function () {
    this.getProductsList()
    this.getproductsCatalog()
  }
}
</script>

<style>
</style>
