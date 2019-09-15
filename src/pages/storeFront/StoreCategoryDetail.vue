<template>
  <q-page>
  </q-page>
</template>

<script>
export default {
  name: 'StoreCategoryDetail',
  data () {
    return {
      category: {},
      products: []
    }
  },
  methods: {
    getCategoryDetail: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/categories/' + self.$route.params.categorySlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.category = response.data
            self.products = response.data.product_entries
          }
        })
    }
  },
  created () {
    this.getCategoryDetail()
  }
}
</script>
