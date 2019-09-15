<template>
  <q-page padding>
  </q-page>
</template>

<script>
export default {
  name: 'StoreCategoryList',
  data () {
    return {
      categories: []
    }
  },
  methods: {
    getCategoryList: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/categories/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.categories = response.data
          }
        })
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>
