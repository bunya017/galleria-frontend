<template>
  <q-page padding>
    <div v-if="categoryNotFound === false">
      <!-- Title -->
      <div class="text-h4 col-12 col-sm-6">
        {{ category.name }} Category
      </div>

      <!-- Breadcrumbs -->
      <div class="q-pa-sm q-gutter-sm">
        <q-breadcrumbs separator="/" class="text-uppercase breadcrumbs-text" gutter="xs">
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
      <div class="row q-pt-lg q-col-gutter-md" v-if="products.length > 0">
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
                    <q-item-label>{{ product.name }}</q-item-label>
                    <q-item-label caption>
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
      <div v-else class="row jutify-center text-center q-pb-md" style="padding-top: 10vh;">
        <div class="col-12 q-px-md">
          <img height="150" width="150" alt="Quasar logo" src="../../assets/undraw-no-data.svg">
          <div class="text-body1 q-py-sm">
            You have not added any product to this category yet.<!-- Click on the
            <q-btn v-if="$q.screen.lt.sm" round size="xs" color="primary" icon="add" />
            <q-btn v-else size="sm" dense class="q-py-xs" color="primary" icon="add" label="ADD PRODUCT" />
            button to add one.-->
          </div>
        </div>
      </div>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="categoryNotFound === true">
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
  name: 'CategoryDetail',
  meta () {
    return {
      title: `${this.category.name} | ${this.catalog.name}`
    }
  },
  data () {
    return {
      categoryNotFound: null,
      catalog: {},
      category: {},
      products: []
    }
  },
  methods: {
    getAuthToken () {
      return sessionStorage.getItem('authToken')
    },
    getCategoryDetail () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
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
            self.categoryNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.categoryNotFound = true
            self.$q.loading.hide()
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
  color: inherit;
}
</style>
