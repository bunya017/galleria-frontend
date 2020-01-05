<template>
  <q-page padding>
    <!-- Title -->
    <div class="text-h4 col-12 col-sm-6">
      Featured Products
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'FeaturedProducts',
  meta () {
    return {
      title: 'Featured Products'
    }
  },
  data () {
    return {
      collection: {},
      featuredProducts: [],
      collectionNotFound: null
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getFeaturedProducts: function () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.catalogSlug + '/collections/featured-products/?is_featured=true'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collection = response.data
            self.featuredProducts = response.data.collection_products
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
    }
  },
  computed: {
    catalogSlug () {
      return this.$route.params.catalogSlug
    }
  },
  created () {
    this.getFeaturedProducts()
  }
}
</script>
