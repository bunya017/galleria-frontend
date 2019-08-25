<template>
  <q-page>
    <!-- content -->
    <div class="row justify-center text-center">
      <!-- Catalog header -->
      <div class="col-12">
        <q-img
          :src="catalog.categories[0].background_image.full_size"
          class="my-header-image"
        >
          <div class="absolute-full text-subtitle2 flex flex-center">
            <div class="my-text-head text-uppercase">
              {{ catalog.name }}
            </div>
          </div>
        </q-img>
      </div>
      <div class="col-12 col-sm-10 q-pa-sm q-pa-sm-md">
        <!-- Collections & Categories -->
        <div class="row q-col-gutter-sm" v-if="catalog">
          <div class="col-6">
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
          </div>
          <div class="col-6">
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
          </div>
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
      catalog: {},
      products: []
    }
  },
  methods: {
    getCatalog: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.catalog = response.data
          }
        })
    },
    getCatalogProducts: function () {
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
    this.getCatalog()
    this.getCatalogProducts()
  }
}
</script>

<style scoped>
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
      height: 60vw;
    }
    .my-card-image {
      height: 25vw;
    }
    .product-slide {
      width: 30vw;
    }
  }
  @media (min-width: 600px) {
    .my-text-head {
      font-size: 4vw;
    }
    .my-card-image {
      height: 20vw;
    }
  }
  @media (max-width: 860px) {
    .my-header-image {
      height: 50vw;
    }
  }
  @media (max-width: 999px) {
    .my-header-image {
      height: 45vw;
    }
  }
  @media (min-width: 1000px) {
    .my-header-image {
      height: 35vw;
    }
  }
</style>
