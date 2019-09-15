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
      categoryProducts: []
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
            self.categoryProducts = response.data.category_products
          }
        })
    }
  }
}
</script>
