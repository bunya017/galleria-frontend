<template>
  <q-page padding>
    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-gutter-sm">
      <q-breadcrumbs
        separator="/"
        class="text-uppercase"
      >
        <q-breadcrumbs-el
          label="Store"
          :to="{
            name: 'store-home',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el label="Categories" />
      </q-breadcrumbs>
    </div>

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
