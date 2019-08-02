<template>
  <q-page padding>
    <!-- Product List -->
    <div class="row q-pt-lg q-pb-xl q-col-gutter-md">
      <div
        class="col-6 col-sm-4 col-md-3"
        v-for="product in products"
        :key="product.id"
      >
        <q-card>
          <q-img
            :src="product.photos[0].photo.small"
            :ratio="1"
          />
          <q-card-section>
            <div>{{ product.name }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreProductList',
  data () {
    return {
      products: []
    }
  },
  methods: {
    getProductsList: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.products = response.data
          }
        })
    }
  },
  created: function () {
    this.getProductsList()
  }
}
</script>

<style>
</style>
