<template>
  <q-page>
    <div v-if="categoryNotFound === false">
      <!-- Category header -->
      <div class="col-12">
        <q-img
          :src="category.background_image.full_size"
          class="my-header-image"
        >
          <div class="absolute-full text-subtitle2 flex flex-center">
            <!-- Header -->
            <div class="text-h4 text-uppercase xs q-py-md">{{ category.name }}</div>
            <div class="text-h3 text-uppercase sm q-py-md">{{ category.name }}</div>
            <div class="text-h2 text-uppercase md q-py-md">{{ category.name }}</div>
          </div>
        </q-img>
      </div>

      <div class="q-px-sm-xl">
        <!-- Breadcrumbs -->
        <div class="q-pa-sm q-pa-sm-md q-gutter-sm breadcrumbs-text">
          <q-breadcrumbs
            separator="/"
            class="text-uppercase"
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
            <q-breadcrumbs-el
              label="Categories"
              :to="{
                name: 'store-category-list',
                params: {
                  catalogSlug: this.$route.params.catalogSlug
                }
              }"
            />
            <q-breadcrumbs-el :label="category.name" />
          </q-breadcrumbs>
        </div>

        <!-- Category products -->
        <div class="q-px-sm q-px-sm-md">
          <div class="row justify-center">
            <div class="col-12">
              <div class="row q-pt-sm q-pt-md-md q-pb-xl q-col-gutter-md" v-if="products">
                <div
                  class="col-6 col-sm-4 col-md-3"
                  v-for="product in products"
                  :key="product.id"
                >
                  <router-link
                    v-if="category.slug"
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
                      <q-card-section class="q-pa-xs q-pa-sm-sm text-center">
                        <div class="text-subtitle1 text-capitalize">
                          {{ product.name }}
                        </div>
                        <div class="text-subtitle1 q-pt-sm-xs text-grey-8">₦{{ product.price }}</div>
                      </q-card-section>
                    </q-card>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="categoryNotFound === true">
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
  name: 'StoreCategoryDetail',
  meta () {
    return {
      title: this.category.name
    }
  },
  data () {
    return {
      catalogSlug: this.$route.params.catalogSlug,
      category: {},
      products: [],
      categoryNotFound: null
    }
  },
  methods: {
    getCategoryDetail () {
      let self = this
      self.$store.dispatch('navbar/updateIs404Action', false)
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/categories/' + self.$route.params.categorySlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.category = response.data
            self.products = response.data.product_entries
            self.$store.dispatch('navbar/updateIs404Action', false)
            self.categoryNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.$store.dispatch('navbar/updateIs404Action', true)
            self.categoryNotFound = true
            self.$q.loading.hide()
          }
        })
    }
  },
  created () {
    this.getCategoryDetail()
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: inherit;
  }
  @media (max-width: 599px) {
    .my-header-image {
      height: 45vw;
    }
  }
  @media (min-width: 600px) and (max-width: 998px) {
    .my-header-image {
      height: 35vw;
    }
  }
  @media (min-width: 999px) {
    .my-header-image {
      height: 20vw;
    }
  }
</style>
