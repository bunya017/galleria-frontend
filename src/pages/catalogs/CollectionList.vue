<template>
  <q-page padding>
    <div class="text-h4">Collections</div>
    <div class="row q-pt-lg q-pb-xl q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CollectionList',
  data: function () {
    return {
      collections: {}
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCollectionList: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collections = response.data
          }
        })
    }
  }
}
</script>

<style>
</style>
