<template>
  <q-page :padding="$q.screen.gt.sm">
    <div class="row justify-center" v-if="prodDetailNotFound === false">
      <!-- Product Detail -->
      <div class="col-12 col-md-9 q-px-md q-px-sm-none q-col-gutter-md-md" v-if="product.category">
        <!-- Breadcrumbs -->
        <div class="q-py-md q-pt-sm-none q-pb-sm-none">
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
              thumbnails
              v-model="imageSlide"
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
            <div class="text-h6">₦ {{ product.price }}</div>
            <div class="q-gutter-sm q-py-sm">
              <q-btn
                type="a"
                :href="'https://wa.me/234' + storeCatalog.contactPhone"
                color="primary"
                icon="ion-logo-whatsapp"
                label="Text us"
              />
              <q-btn
                type="a"
                :href="'tel:' + storeCatalog.contactPhone"
                text-color="primary"
                icon="phone"
                label="Call us"
              />
            </div>
            <p class="text-grey-9 q-pt-sm">{{ product.description }}</p>
            <div class="q-py-md text-grey-9">
              Share:
              <div class="q-gutter-sm">
                <q-icon size="sm" name="ion-logo-whatsapp" />
                <q-icon size="sm" name="ion-logo-facebook" />
                <q-icon size="sm" name="ion-logo-twitter" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="prodDetailNotFound === true">
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
  name: 'StoreProductDetail',
  meta () {
    return {
      title: this.product.name
    }
  },
  data () {
    return {
      product: {},
      prodDetailNotFound: null,
      imageSlide: null,
      catalogSlug: this.$route.params.catalogSlug
    }
  },
  methods: {
    getProductDetail: function () {
      let self = this
      self.$store.dispatch('navbar/updateIs404Action', false)
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId
      )
        .then(function (response) {
          if (response.status === 200) {
            self.product = response.data
            self.imageSlide = response.data.photos[0].id
            self.$store.dispatch('navbar/updateIs404Action', false)
            self.prodDetailNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.$store.dispatch('navbar/updateIs404Action', true)
            self.prodDetailNotFound = true
            self.$q.loading.hide()
          }
        })
    }
  },
  created () {
    this.getProductDetail()
  },
  computed: {
    storeCatalog () {
      return this.$store.state.navbar.catalog
    }
  }
}
</script>
