<template>
  <q-page>
    <div v-if="collDetailNotFound === false">
      <!-- Collection header -->
      <div class="col-12">
        <q-img
          :src="collection.background_image.full_size"
          class="my-header-image"
        >
          <div class="absolute-full text-subtitle2 flex flex-center">
            <!-- Header -->
            <div class="text-h4 text-uppercase xs q-py-md">{{ collection.name }}</div>
            <div class="text-h3 text-uppercase sm q-py-md">{{ collection.name }}</div>
            <div class="text-h2 text-uppercase md q-py-md">{{ collection.name }}</div>
          </div>
        </q-img>
      </div>

      <div class="q-px-sm-lg q-px-md-xl">
        <!-- Breadcrumbs -->
        <div class="q-pa-sm q-pa-sm-md q-gutter-sm">
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
            <q-breadcrumbs-el
              label="Collections"
              :to="{
                name: 'store-collection-list',
                params: {
                  catalogSlug: this.$route.params.catalogSlug
                }
              }"
            />
            <q-breadcrumbs-el :label="collection.name" />
          </q-breadcrumbs>
        </div>

        <!-- Product List -->
        <div class="q-px-sm q-px-sm-md">
          <!-- Collection products -->
          <div class="row justify-center">
            <div class="col-12">
              <div class="row q-pt-sm q-pt-md-md q-pb-xl q-col-gutter-md" v-if="collectionProducts">
                <div
                  class="col-6 col-sm-4 col-md-3"
                  v-for="collectionProduct in collectionProducts"
                  :key="collectionProduct.id"
                >
                  <router-link
                    v-if="collection.slug"
                    :to="{
                      name: 'store-product-detail',
                      params: {
                        catalogSlug: catalogSlug,
                        referenceId: collectionProduct.product.reference_id,
                        productSlug: collectionProduct.product.slug
                      }
                    }"
                  >
                    <q-card>
                      <q-img
                        :src="collectionProduct.product.photos[0].photo.small"
                        :ratio="1"
                      />
                      <q-card-section class="q-pa-xs q-pa-sm-sm text-center">
                        <div class="text-subtitle1 text-capitalize">
                          {{ collectionProduct.product.name }}
                        </div>
                        <div class="text-subtitle1 q-pt-sm-xs text-grey-8">₦{{ collectionProduct.product.price }}</div>
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
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="collDetailNotFound === true">
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
  name: 'StoreCollectionDetail',
  meta () {
    return {
      title: this.collection.name
    }
  },
  data () {
    return {
      catalogSlug: this.$route.params.catalogSlug,
      collection: {},
      collectionProducts: [],
      collDetailNotFound: null
    }
  },
  methods: {
    getCollectionDetail () {
      let self = this
      self.$store.dispatch('navbar/updateIs404Action', false)
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + self.$route.params.collectionSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collection = response.data
            self.collectionProducts = response.data.collection_products
            self.$store.dispatch('navbar/updateIs404Action', false)
            self.collDetailNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.$store.dispatch('navbar/updateIs404Action', true)
            self.collDetailNotFound = true
            self.$q.loading.hide()
          }
        })
    }
  },
  created () {
    this.getCollectionDetail()
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
