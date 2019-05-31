<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-sm-10" v-if="product.category">
        <!-- Breadcrumbs -->
        <div class="q-pa-sm q-gutter-sm">
          <q-breadcrumbs separator=">>">
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
        <q-card flat class="row q-pa-md">
          <div class="col-12 col-sm-6">
            <q-img :src="product.photos[0].photo" />
          </div>
          <div class="col-12 col-sm-6 q-pl-sm-md q-pt-lg q-pt-sm-lg">
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
            <div class="q-pt-none text-caption text-italic text-grey-6">in {{ product.category.name }} category.</div>
            <div>
              <span class="text-subtitle1 text-grey-9">{{ product.description }}</span>
              <span class="text-caption text-grey-7 q-pl-xs"><q-icon name="edit" />Click to edit</span>
              <q-popup-edit buttons v-model="editProduct.description" title="Edit product description">
                <q-input v-model="editProduct.description" type="text" dense autofocus counter />
              </q-popup-edit>
            </div>
            <div class="q-pt-md q-pt-sm-xl">
              <span class="text-h5">₦ {{ product.price }}</span>
              <span class="text-caption text-grey-7 q-pl-xs"><q-icon name="edit" />Click to edit</span>
              <q-popup-edit buttons v-model="editProduct.price" title="Edit product price (₦)">
                <q-input v-model="editProduct.price" type="number" dense autofocus counter />
              </q-popup-edit>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ProductDetailView',
  data: function () {
    return {
      product: {},
      editProduct: {
        name: '',
        price: null,
        description: ''
      },
      catalogSlug: this.$route.params.catalogSlug

    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getProductDetail: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/p/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId
      )
        .then(function (response) {
          self.product = response.data
          self.editProduct.name = self.product.name
          self.editProduct.price = self.product.price
          self.editProduct.description = self.product.description
        })
    },
    editProductName: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.patch(
        'catalogs/' + self.$route.params.catalogSlug + '/p/' + self.$route.params.productSlug + '/' + self.$route.params.referenceId + '/',
        { 'name': self.editProduct.name }
      )
        .then(function (response) {
          self.clearEditProductModel()
          console.log({
            'catalogSlug': self.catalogSlug,
            'referenceId': response.data.reference_id,
            'productSlug': response.data.slug
          })
          self.$router.push({
            name: 'product-detail',
            params: {
              catalogSlug: self.catalogSlug,
              referenceId: response.data.reference_id,
              productSlug: response.data.slug
            }
          })
        })
    },
    clearEditProductModel: function () {
      this.editProduct.name = ''
      this.editProduct.description = ''
      this.editProduct.price = null
    }
  },
  created: function () {
    this.getProductDetail()
  }
}
</script>

<style>
</style>
