<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
export default {
  name: 'StoreCollectionDetail',
  data () {
    return {
      collection: {},
      products: []
    }
  },
  methods: {
    getCollectionDetail: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + self.$route.params.collectionSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collection = response.data
            self.products = response.data.collection_products
          }
        })
    }
  }
}
</script>

<style>
</style>
