<template>
  <q-page padding>
    <div class="row justify-center">
      <!-- Product Detail -->
      <div class="col-12 col-md-9 q-pa-sm q-pa-sm-md" v-if="product.category">
        <div class="row q-col-gutter-md-md">
          <!-- Product Images -->
          <div class="col-12 col-md-6">
            <q-carousel
              swipeable
              arrows
              animated
              v-model="imageSlide"
              thumbnails
              infinite
            >
              <q-carousel-slide
                contain
                v-for="productPhoto in product.photos"
                :key="productPhoto.id"
                :name="productPhoto.id"
                :img-src="productPhoto.photo.small"
              />
            </q-carousel>
          </div>
          <!-- Product Info -->
          <div class="col-12 col-md-6">
            <!-- Breadcrumbs -->
            <div class="q-pa-sm q-gutter-sm">
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
            <div class="text-capitalize text-h4 text-weight-medium q-py-sm">{{ product.name }}</div>
            <div class="q-py-sm text-caption text-italic text-grey-6">
              in {{ product.category.name }} category.
            </div>
            <div class="text-h6 q-py-sm">₦ {{ product.price }}</div>
            <div class="text-body2 text-grey-9">{{ product.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreProductDetail',
  data () {
    return {
      product: {},
      imageSlide: null,
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
            self.imageSlide = response.data.photos[0].id
          }
        })
    }
  },
  created () {
    this.getProductDetail()
  }
}
</script>
