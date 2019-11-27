<template>
  <q-page padding>
  </q-page>
</template>

<script>
export default {
  name: 'StoreSearch',
  data () {
    return {
      products: []
    }
  },
  methods: {
    getProductsList: function () {
      let self = this
      if (self.$route.query.name !== '') {
        self.$axios.get(
          'catalogs/' + self.$route.params.catalogSlug + '/products/?name__icontains=' +
          self.$route.query.name
        )
          .then(function (response) {
            if (response.status === 200) {
              self.products = response.data
            }
          })
      }
    }
  },
  computed: {
    queryName () {
      return this.$route.query.name || 1
    }
  },
  watch: {
    queryName: {
      handler (newName, oldName) {
        this.getProductsList()
      },
      immediate: true
    }
  }
}
</script>
