<template>
  <q-page padding>
    <div class="row justify-center">
      <!-- Product Detail -->
      <div class="col-12 col-md-9 q-px-md q-px-sm-none q-col-gutter-md-md" v-if="product.category">
        <!-- Breadcrumbs -->
        <div class="q-py-md ">
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
        <div class="row q-col-gutter-md-md">
          <!-- Product Images -->
          <div class="col-12 col-sm-7 col-md-6 q-px-md-sm">
            <q-carousel
              swipeable
              arrows
              animated
              v-model="imageSlide"
              :thumbnails="$q.screen.gt.sm"
              :navigation="$q.screen.lt.md"
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
          <div class="col-12 col-sm-5 col-md-6 q-pl-sm-md q-pl-md-none q-px-md-sm">
            <div
              :class="[
                $q.screen.lt.md ? 'text-h5':'text-h4',
                'text-capitalize', 'text-weight-medium',
                'q-py-sm'
              ]"
            >
              {{ product.name }}
            </div>
            <div class="q-py-sm text-caption text-italic text-grey-6">
              in {{ product.category.name }} category.
            </div>
            <div class="text-h6 q-py-sm">₦ {{ product.price }}</div>
            <p class="text-grey-9">{{ product.description }}</p>
            <div class="q-py-md q-gutter-sm text-grey-9 vertical-middle">
              Share:
              <q-icon size="sm" name="ion-logo-whatsapp" />
              <q-icon size="sm" name="ion-logo-facebook" />
              <q-icon size="sm" name="ion-logo-twitter" />
            </div>
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
