<template>
  <q-page padding>
    <div v-if="productNotFound === false">
      <div class="row justify-center">
        <div class="col-12 col-sm-10" v-if="product.category">
          <!-- Breadcrumbs -->
          <div class="q-pa-sm q-gutter-sm">
            <q-breadcrumbs separator="/" class="text-uppercase breadcrumbs-text" gutter="xs">
              <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
              <q-breadcrumbs-el
                :label="product.category.catalog.name"
                :to="{
                  name:'catalog-detail',
                  params: {
                    slug: this.$route.params.catalogSlug
                  }
                }"
              />
              <q-breadcrumbs-el
                label="Products List"
                :to="{
                  name:'products-list',
                  params: {
                    slug: this.$route.params.catalogSlug
                  }
                }"
              />
              <q-breadcrumbs-el :label="product.name" />
            </q-breadcrumbs>
          </div>
          <!-- Product Detial -->
          <q-card flat class="row q-pa-md">
            <div class="col-12 col-sm-6">
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
            <div class="col-12 col-sm-6 q-pl-sm-md q-pt-lg q-pt-sm-lg">
              <!-- Product Name -->
              <div>
                <span class="text-uppercase text-h5">{{ product.name }}</span>
                <span class="text-caption text-grey-7 q-pl-xs"><q-icon name="edit" />Click to edit</span>
                <q-popup-edit
                  buttons
                  @save="editProductName"
                  v-model="editProduct.name"
                  title="Edit product name"
                >
                  <q-input v-model="editProduct.name" type="text" dense autofocus counter />
                </q-popup-edit>
              </div>
              <!-- Product Category -->
              <div class="q-pt-none text-caption text-italic text-grey-6">
                in {{ product.category.name }} category.
              </div>
              <!-- Product Price -->
              <div class="q-pt-md">
                <span class="text-h5">₦ {{ product.price }}</span>
                <span class="text-caption text-grey-7 q-pl-xs"><q-icon name="edit" />Click to edit</span>
                <q-popup-edit
                  buttons
                  @save="editProductPrice"
                  v-model="editProduct.price"
                  title="Edit product price (₦)"
                >
                  <q-input v-model="editProduct.price" type="number" dense autofocus counter />
                </q-popup-edit>
              </div>
              <!-- Product Description -->
              <div class="q-pt-md q-pt-sm-xl">
                <span class="text-subtitle1 text-grey-9">{{ product.description }}</span>
                <span class="text-caption text-grey-7 q-pl-xs"><q-icon name="edit" />Click to edit</span>
                <q-popup-edit
                  buttons
                  @save="editProductDescription"
                  v-model="editProduct.description"
                  title="Edit product description"
                >
                  <q-input v-model="editProduct.description" type="text" dense autofocus counter />
                </q-popup-edit>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="productNotFound === true">
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
  name: 'ProductDetailView',
  data: function () {
    return {
      productNotFound: null,
      product: {},
      imageSlide: null,
      catalogSlug: this.$route.params.catalogSlug,
      editProduct: {
        name: '',
        price: null,
        description: ''
      },
      alertPayload: {
        color: 'green-1',
        textColor: 'positive',
        icon: 'check_circle',
        position: 'top',
        message: '',
        classes: 'q-mt-xl'
      }
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getProductDetail: function () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId
      )
        .then(function (response) {
          if (response.status === 200) {
            self.product = response.data
            self.imageSlide = response.data.photos[0].id
            self.editProduct.name = self.product.name
            self.editProduct.price = self.product.price
            self.editProduct.description = self.product.description
            self.productNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.productNotFound = true
            self.$q.loading.hide()
          }
        })
    },
    editProductName: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.patch(
        'catalogs/' + self.$route.params.catalogSlug + '/products/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId + '/',
        { 'name': self.editProduct.name }
      )
        .then(function (response) {
          if (response.status === 200) {
            self.clearEditProductModel()
            self.$router.push({
              name: 'product-detail',
              params: {
                catalogSlug: self.catalogSlug,
                referenceId: response.data.reference_id,
                productSlug: response.data.slug
              }
            })
            self.getProductDetail()
            self.alertPayload.message = 'Product name changed successfully!'
            self.showAlert(self.alertPayload)
          }
        })
    },
    editProductDescription: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.patch(
        'catalogs/' + self.$route.params.catalogSlug + '/products/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId + '/',
        { 'description': self.editProduct.description }
      )
        .then(function (response) {
          if (response.status === 200) {
            self.clearEditProductModel()
            self.getProductDetail()
            self.alertPayload.message = 'Product description changed successfully!'
            self.showAlert(self.alertPayload)
          }
        })
    },
    editProductPrice: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.patch(
        'catalogs/' + self.$route.params.catalogSlug + '/products/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId + '/',
        { 'price': self.editProduct.price }
      )
        .then(function (response) {
          if (response.status === 200) {
            self.clearEditProductModel()
            self.getProductDetail()
            self.alertPayload.message = 'Product price changed successfully!'
            self.showAlert(self.alertPayload)
          }
        })
    },
    clearEditProductModel: function () {
      this.editProduct.name = ''
      this.editProduct.description = ''
      this.editProduct.price = null
    },
    showAlert: function (payload) {
      const {
        color, textColor, message, icon,
        position, classes
      } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        classes
      })
    }
  },
  created: function () {
    this.getProductDetail()
  }
}
</script>

<style>
</style>
