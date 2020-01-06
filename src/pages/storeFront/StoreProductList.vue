<template>
  <q-page>
    <div class="q-px-md-xl q-py-md-sm q-pa-sm" v-if="prodListNotFound === false">
      <!-- Header -->
      <div class="text-h4 xs">All Products</div>
      <div class="text-h3 sm">All Products</div>
      <div class="text-h2 md">All Products</div>

      <!-- Breadcrumbs -->
      <div class="q-py-sm q-gutter-sm">
        <q-breadcrumbs
          separator="/"
          class="text-uppercase breadcrumbs-text"
          gutter="xs"
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
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="prodListNotFound === true">
      <div class="col-12 q-px-md">
        <div class="text-h2 q-pb-lg">404</div>
        <p class="text-body1">We can't seem to find the page you're looking for.</p>
        <div class="q-gutter-sm q-py-sm">
          <q-btn
            color="primary"
            label="Go back"
            @click="$router.back()"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreProductList',
  meta () {
    return {
      title: 'Products'
    }
  },
  data () {
    return {
      catalogSlug: this.$route.params.catalogSlug,
      products: [],
      prodListNotFound: null
    }
  },
  methods: {
    getProductsList () {
      let self = this
      self.$store.dispatch('navbar/updateIs404Action', false)
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.products = response.data
            self.$store.dispatch('navbar/updateIs404Action', false)
            self.prodListNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.$store.dispatch('navbar/updateIs404Action', true)
            self.prodListNotFound = true
            self.$q.loading.hide()
          }
        })
    }
  },
  created () {
    this.getProductsList()
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
