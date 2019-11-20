<template>
  <q-page>
    <div class="q-px-md-xl q-py-md-sm q-pa-sm" v-if="catalogSlug">
      <!-- Header -->
      <div class="text-h4 xs">All Products</div>
      <div class="text-h3 sm">All Products</div>
      <div class="text-h2 md">All Products</div>

      <!-- Breadcrumbs -->
      <div class="q-py-sm q-gutter-sm">
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
          <q-breadcrumbs-el label="Products" />
        </q-breadcrumbs>
      </div>

      <!-- Product List -->
      <div class="row justify-center">
        <div class="col-12">
          <div class="row q-pt-sm q-pt-md-md q-pb-xl q-col-gutter-md">
            <div
              class="col-6 col-sm-4 col-md-3"
              v-for="product in products"
              :key="product.id"
            >
              <router-link
                v-if="catalogSlug"
                :to="{
                  name: 'store-product-detail',
                  params: {
                    catalogSlug: catalogSlug,
                    referenceId: product.reference_id,
                    productSlug: product.slug
                  }
                }"
              >
                <q-card>
                  <q-img
                    :src="product.photos[0].photo.small"
                    :ratio="1"
                  />
                  <q-card-section class="q-pa-xs text-center">
                    <div class="text-subtitle2 text-uppercase text-black">
                      {{ product.name }}
                    </div>
                    <div class="text-grey-6 q-pa-none text-caption">
                      {{ product.category.name }}
                    </div>
                    <div class="text-grey-8">₦{{ product.price }}</div>
                  </q-card-section>
                </q-card>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreProductList',
  data () {
    return {
      catalogSlug: this.$route.params.catalogSlug,
      products: []
    }
  },
  methods: {
    getProductsList: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.products = response.data
          }
        })
    }
  },
  created: function () {
    this.getProductsList()
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
