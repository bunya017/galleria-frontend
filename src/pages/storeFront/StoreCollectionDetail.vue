<template>
  <q-page padding>
    <div class="row justify-center">
      <!-- Product List -->
      <div class="col-12 col-sm-10">
        <div class="row q-pt-lg q-pb-xl q-col-gutter-md" v-if="collectionProducts">
          <div
            class="col-6 col-sm-4 col-md-3"
            v-for="collectionProduct in collectionProducts"
            :key="collectionProduct.id"
          >
            <q-card>
              <q-img
                :src="collectionProduct.product.photos[0].photo.small"
                :ratio="1"
              />
              <q-card-section class="q-pa-xs q-pa-sm-sm text-center">
                <div class="text-subtitle1 text-capitalize">
                  {{ collectionProduct.product.name }}
                </div>
                <div class="text-subtitle1 q-pt-sm-xs text-grey-8">₦{{ collectionProduct.product.price }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreCollectionDetail',
  data () {
    return {
      collection: {},
      collectionProducts: []
    }
  },
  methods: {
    getCollectionDetail: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + self.$route.params.collectionSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collection = response.data
            self.collectionProducts = response.data.collection_products
          }
        })
    }
  },
  created () {
    this.getCollectionDetail()
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
