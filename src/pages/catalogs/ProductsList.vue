<template>
  <q-page padding>
    <div class="text-h4">Products List</div>
  </q-page>
</template>

<script>
export default {
  data: function () {
    return {
      catalog: {}
    }
  },
  methods: {
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
        })
    }
  }
}
</script>

<style>
</style>
