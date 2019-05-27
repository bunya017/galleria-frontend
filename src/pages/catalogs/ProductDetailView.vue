<template>
  <q-page padding>
    <div class="row q-gutter-lg">
      <div class="col">
        <q-img
          :src="product.photos[0].photo"
        />
      </div>
      <div class="col">
        <div class="text-h4">{{ product.name }}</div>
        <div class="text-h4 text-bold q-pt-xl">{{ product.price }}</div>
        <div class="text-caption q-pt-xl">{{ product.description }}</div>
      </div>
    </div>
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
