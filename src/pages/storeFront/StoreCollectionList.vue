<template>
  <q-page>
    <!-- content -->
  </q-page>
</template>

<script>
export default {
  name: 'StoreCollectionList',
  data () {
    return {
      collections: []
    }
  },
  methods: {
    getCollectionList: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collections = response.data
          }
        })
    }
  },
  created () {
    this.getCollectionList()
  }
}
</script>

<style>
</style>
