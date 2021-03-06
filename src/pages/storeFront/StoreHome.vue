<template>
  <q-page>
    <!-- content -->
    <div class="row justify-center text-center" v-if="catalogNotFound === false">
      <!-- Catalog header -->
      <div class="col-12">
        <q-img
          :src="catalog.background_image.full_size"
          class="my-header-image"
        >
          <div class="absolute-full text-subtitle2 flex flex-center">
            <div class="my-text-head text-uppercase">
              {{ catalog.name }}
            </div>
          </div>
        </q-img>
      </div>
      <div class="col-12 col-sm-11 col-md-10 q-pa-sm q-pa-sm-md">
        <!-- Collections & Categories -->
        <div class="row q-col-gutter-sm" v-if="catalog">
          <div class="col-6">
            <router-link
              v-if="catalog.slug"
              :to="{
                name: 'store-category-list',
                params: {
                  catalogSlug: catalog.slug
                }
              }"
            >
              <q-card style="width: 100%">
                <q-img
                  :src="catalog.categories[0].background_image.small"
                  class="my-card-image"
                >
                  <div class="absolute-full text-subtitle2 flex flex-center">
                    <div class="my-text-head text-uppercase text-weight-thin">
                      Categories
                    </div>
                  </div>
                </q-img>
              </q-card>
            </router-link>
          </div>
          <div class="col-6">
            <router-link
              v-if="catalog.slug"
              :to="{
                name: 'store-collection-list',
                params: {
                  catalogSlug: catalog.slug
                }
              }"
            >
              <q-card style="width: 100%">
                <q-img
                  :src="catalog.collections[0].background_image.small"
                  class="my-card-image"
                >
                  <div class="absolute-full text-subtitle2 flex flex-center">
                    <div class="my-text-head text-uppercase text-weight-thin">
                      Collections
                    </div>
                  </div>
                </q-img>
              </q-card>
            </router-link>
          </div>
        </div>

        <!-- Featured products -->
        <div class="row q-py-sm">
          <div
            :class="[
              $q.screen.lt.sm ? 'text-h6':'text-h5',
              'text-left', 'q-pt-lg', 'col-6'
            ]"
          >
            FEATURED
          </div>
          <div class="col-6 q-pt-lg">
            <q-btn
              dense
              flat
              class="float-right"
              color="primary"
              icon-right="arrow_forward"
              label="view all"
              :to="{
                name: 'store-product-list',
                params: {
                  catalogSlug: catalog.slug
                }
              }"
            />
          </div>
        </div>
        <div
          class="row q-py-sm q-px-sm-md q-col-gutter-md no-wrap"
          style="overflow-x: auto;"
          v-if="featuredProducts.length > 0"
        >
          <div
            v-for="product in featuredProducts"
            :key="product.product.id"
            class="col-4 col-sm-3"
          >
            <router-link
              v-if="catalog.slug"
              :to="{
                name: 'store-product-detail',
                params: {
                  catalogSlug: catalog.slug,
                  referenceId: product.product.reference_id,
                  productSlug: product.product.slug
                }
              }"
            >
              <q-card>
                <q-img
                  :src="product.product.photos[0].photo.small"
                  :ratio="9/10"
                />
                <q-card-section class="q-pa-xs q-pa-sm-sm">
                  <div class="text-capitalize text-sm-subtitle1 ellipsis">
                    {{ product.product.name }}
                  </div>
                  <div class="text-grey-8 q-px-xs text-subtitle2 text-caption">₦{{ noDecimal(product.product.price) }}</div>
                </q-card-section>
              </q-card>
            </router-link>
          </div>
        </div>
        <div
          class="row q-py-sm q-px-sm-md q-col-gutter-md no-wrap"
          style="overflow-x: auto;"
          v-else
        >
          <div
            v-for="product in products.slice(0,4)"
            :key="product.id"
            class="col-4 col-sm-3"
          >
            <router-link
              v-if="catalog.slug"
              :to="{
                name: 'store-product-detail',
                params: {
                  catalogSlug: catalog.slug,
                  referenceId: product.reference_id,
                  productSlug: product.slug
                }
              }"
            >
              <q-card>
                <q-img
                  :src="product.photos[0].photo.small"
                  :ratio="9/10"
                />
                <q-card-section class="q-pa-xs q-pa-sm-sm">
                  <div class="text-capitalize text-sm-subtitle1 ellipsis">
                    {{ product.name }}
                  </div>
                  <div class="text-grey-8 q-px-xs text-subtitle2 text-caption">₦{{ noDecimal(product.price) }}</div>
                </q-card-section>
              </q-card>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="catalogNotFound === true">
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
  name: 'StoreHome',
  data () {
    return {
      catalogNotFound: null,
      catalog: {},
      products: [],
      featuredProducts: []
    }
  },
  methods: {
    getCatalog () {
      let self = this
      self.$store.dispatch('navbar/updateIs404Action', false)
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.catalog = response.data
            for (var i = response.data.collections.length - 1; i >= 0; i--) {
              if (response.data.collections[i].is_featured === true) {
                self.featuredProducts = response.data.collections[i].collection_products
              }
            }
            self.$store.dispatch('navbar/updateIs404Action', false)
            self.catalogNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.$store.dispatch('navbar/updateIs404Action', true)
            self.catalogNotFound = true
            self.$q.loading.hide()
          }
        })
    },
    getCatalogProducts () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.products = response.data
          }
        })
    },
    noDecimal (num) {
      return Number(num).toFixed(0)
    }
  },
  created () {
    this.getCatalog()
    this.getCatalogProducts()
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: inherit;
  }
  @media (max-width: 400px) {
    .product-slide-vert {
      height: 60vw;
    }
  }
  @media (max-width: 599px) {
    .my-text-head {
      font-size: 5vw;
    }
    .my-header-image {
      height: 40vh;
    }
    .my-card-image {
      height: 30vh;
    }
    .product-slide {
      width: 30vw;
    }
  }
  @media (min-width: 600px) {
    .my-text-head {
      font-size: 4vw;
    }
  }
  @media (min-width: 600px) and (max-width: 999px) {
    .my-header-image {
      height: 50vw;
    }
    .my-card-image {
      height: 30vw;
    }
  }
  @media (max-width: 999px) and (min-width: 861px) {
    .my-header-image {
      height: 45vw;
    }
  }
  @media (min-width: 1000px) {
    .my-header-image {
      height: 35vw;
    }
    .my-card-image {
      height: 25vw;
    }
  }
</style>
