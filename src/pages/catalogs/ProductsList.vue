<template>
  <q-page padding>
    <div class="text-h4">Products List</div>
    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-gutter-sm">
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
    <!-- Add new product-->
    <div class="q-pa-md">
      <div class="column items-end">
        <div class="col">
          <q-btn color="primary" label="Add new product" @click="newProd = true" />
        </div>
      </div>
    </div>
    <!-- New product dialog -->
    <q-dialog v-model="newProd" persistent>
      <q-card class="q-mt-lg" style="width: 600px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5">New Product</div>
          <div class="text-subtitle2">Add new product</div>
        </q-card-section>
        <q-card-section>
          <form>
            <div class="q-gutter-y-md">
              <q-input
                dense
                auto-focus
                label="Name"
                type="text"
                v-model="newProduct.name"
              />
              <q-input
                dense
                auto-focus
                label="Category"
                type="text"
                v-model="newProduct.category"
              />
              <q-input
                dense
                auto-focus
                label="Price"
                type="number"
                v-model="newProduct.price"
              />
              <q-input
                dense
                auto-focus
                label="Description"
                type="text"
                v-model="newProduct.description"
              />
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Products List -->
    <div class="row q-at-sm q-pb-xl">
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
      newProd: false,
      newProduct: {
        name: '',
        category: null,
        price: null,
        description: ''
      },
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
