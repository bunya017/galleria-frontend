<template>
  <q-page>
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

    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-pa-sm-md q-gutter-sm">
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

    <div class="q-px-sm q-px-sm-md">
      <!-- Collection products -->
      <div class="row justify-center">
        <div class="col-12 col-sm-10">
          <div class="row q-pt-sm q-pt-md-md q-pb-xl q-col-gutter-md" v-if="collectionProducts">
            <div
              class="col-6 col-sm-4 col-md-3"
              v-for="collectionProduct in collectionProducts"
              :key="collectionProduct.id"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreCollectionDetail',
  data () {
    return {
      collection: {},
      collectionProducts: []
    }
  },
  methods: {
    getCollectionDetail: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + self.$route.params.collectionSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collection = response.data
            self.collectionProducts = response.data.collection_products
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
  }
  @media (max-width: 599px) {
    .my-header-image {
      height: 45vw;
    }
  }
  @media (min-width: 860px) {
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
