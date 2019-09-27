<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
export default {
  name: 'ProductDetail',
  data () {
    return {
      product: {}
    }
  },
  methods: {
    getProductDetail: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId
      )
        .then(function (response) {
          if (response.status === 200) {
            self.product = response.data
          }
        })
    }
  }
}
</script>
