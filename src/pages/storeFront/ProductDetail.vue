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
              slug: catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el
          :label="product.category.name"
          :to="{
            name: 'store-category-detail',
            params: {
              catalogSlug: catalogSlug,
              categorySlug: product.category.slug
            }
          }"
        />
        <q-breadcrumbs-el :label="product.name" />
      </q-breadcrumbs>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ProductDetail',
  data () {
    return {
      product: {},
      catalogSlug: this.$route.params.catalogSlug
    }
  },
  methods: {
    getProductDetail: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId
      )
        .then(function (response) {
          if (response.status === 200) {
            self.product = response.data
          }
        })
    }
  },
  created () {
    this.getProductDetail()
  }
}
</script>
