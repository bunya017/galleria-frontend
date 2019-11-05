<template>
  <q-page padding>
    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-gutter-sm">
      <q-breadcrumbs separator="/">
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          v-if="catalog"
          :label="catalog.name"
          :to="{
            name:'catalog-detail',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el
          v-if="catalog"
          label="Categories"
          :to="{
            name:'catalog-detail',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el :label="category.name" />
      </q-breadcrumbs>
    </div>

    <!-- Title -->
    <div v-if="category" class="row items-center q-pt-sm q-pb-lg">
      <div class="text-h4 col-12 col-sm-6">
        {{ category.name }} Category
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CategoryDetail',
  data () {
    return {
      catalog: {},
      category: {},
      products: []
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCategoryDetail: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/categories/' + self.$route.params.categorySlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.category = response.data
            self.catalog = response.data.catalog
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
