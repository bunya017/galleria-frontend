<template>
  <q-page padding>
    <div class="text-h4 col-12 col-sm-6">Collection Detail</div>
  </q-page>
</template>

<script>
export default {
  name: 'CollectionDetail',
  data: function () {
    return {
      collection: {}
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
    }
  }
}
</script>

<style>
</style>
