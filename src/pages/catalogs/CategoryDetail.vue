<template>
  <q-page padding>
    <!-- Title -->
    <div class="text-h4 col-12 col-sm-6">
      {{ category.name }} Category
    </div>

    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-gutter-sm">
      <q-breadcrumbs separator="/" class="text-uppercase">
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          v-if="catalog"
          :label="catalog.name"
          :to="{
            name:'catalog-detail',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el
          v-if="catalog"
          label="Categories"
          :to="{
            name:'catalog-detail',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el :label="category.name" />
      </q-breadcrumbs>
    </div>

    <!-- Category products list-->
    <div class="row q-pt-lg q-col-gutter-md">
      <div class="col-12" v-for="product in products" :key="product.id">
        <q-card>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar v-if="product.photos.length > 0" rounded size="56px">
                  <img :src="product.photos[0].photo.thumbnail">
                </q-avatar>
                <q-avatar v-else color="primary" text-color="white">
                  {{ product.name.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <router-link
                  v-if="catalog.slug"
                  :to="{
                    name: 'product-detail',
                    params: {
                      catalogSlug: catalog.slug,
                      referenceId: product.reference_id,
                      productSlug: product.slug
                    }
                  }"
                >
                  <q-item-label class="text-black">{{ product.name }}</q-item-label>
                  <q-item-label caption lines="2">
                    {{ product.description }}
                  </q-item-label>
                  <q-item-label caption class="q-pt-sm text-weight-bold">
                    ₦{{ product.price }}
                  </q-item-label>
                </router-link>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CategoryDetail',
  data () {
    return {
      catalog: {},
      category: {},
      products: []
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCategoryDetail: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/categories/' + self.$route.params.categorySlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.category = response.data
            self.catalog = response.data.catalog
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
</style>
