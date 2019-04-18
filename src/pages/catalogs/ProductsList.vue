<template>
  <q-page padding>
    <div class="text-h4">Products List</div>
    <div class="q-px-sm q-gutter-sm">
      <q-breadcrumbs separator=">>">
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          :label="catalog.name"
          :to="{
            name:'catalog-detail',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el label="Products List" />
      </q-breadcrumbs>
    </div>
    <div class="row q-pt-sm q-pb-xl q-col-gutter-md">
      <div class="col-12" v-for="product in products" :key="product.id">
        <q-card>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar rounded size="75px">
                  <img :src="product.photos[0].photo">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label caption>{{ product.description }}</q-item-label>
              </q-item-section>
              <q-item-section>
                {{ product.price }}
              </q-item-section>
              <q-item-section class="gt-xs">
                {{ product.description }}
              </q-item-section>
              <q-item-section side>
                <q-btn size="12px" flat dense round icon="more_vert" />
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
  name: 'ProductsList',
  data: function () {
    return {
      products: [],
      catalog: {}
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getProductsList: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/p/products/'
      )
        .then(function (response) {
          self.products = response.data
        })
    },
    getProductsCatalog: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug
      )
        .then(function (response) {
          self.catalog = response.data
        })
    }
  },
  created: function () {
    this.getProductsList()
    this.getProductsCatalog()
  }
}
</script>

<style>
</style>
