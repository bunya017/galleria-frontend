<template>
  <q-page padding>
    <div class="text-h4">Products List</div>
    <!-- Breadcrumbs -->
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
    <!-- Products List -->
    <div class="row q-pt-sm q-pb-xl">
      <div class="col-12">
        <q-table
          :data="products"
          :columns="columns"
          row-key="name"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-item class="q-pa-none">
                <q-item-section side>
                  <q-avatar rounded size="50px">
                    <img :src="props.row.photos[0].photo">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ props.row.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
          </template>
        </q-table>
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
      catalog: {},
      columns: [
        { name: 'name', label: 'PRODUCTS', field: 'name', align: 'left', sortable: true },
        { name: 'price', label: 'PRICE', field: 'price', align: 'left', sortable: true },
        { name: 'description', label: 'DESCRIPTION', field: 'description', align: 'left', sortable: false }
      ]
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
