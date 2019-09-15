<template>
  <q-page>
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

    <!-- Breadcrumbs -->
    <div class="q-pa-md q-gutter-sm">
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
    <div class="row justify-center">
      <div class="col-12 col-sm-10">
        <div class="row q-pt-lg q-pb-xl q-col-gutter-md" v-if="products">
          <div
            class="col-6 col-sm-4 col-md-3"
            v-for="product in products"
            :key="product.id"
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
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreCategoryDetail',
  data () {
    return {
      category: {},
      products: []
    }
  },
  methods: {
    getCategoryDetail: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/categories/' + self.$route.params.categorySlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.category = response.data
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

<style scoped>
  a {
    text-decoration: none;
  }
  @media (max-width: 599px) {
    .my-header-image {
      height: 45vw;
    }
  }
  @media (max-width: 860px) {
    .my-header-image {
      height: 35vw;
    }
  }
  @media (max-width: 999px) {
    .my-header-image {
      height: 25vw;
    }
  }
  @media (min-width: 1000px) {
    .my-header-image {
      height: 20vw;
    }
  }
</style>
