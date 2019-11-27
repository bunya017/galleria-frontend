<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <q-list separator>
          <q-item v-for="product in products" :key="product.id">
            <q-item-section thumbnail>
              <router-link
                :to="{
                  name: 'store-product-detail',
                  params: {
                    catalogSlug: catalogSlug,
                    referenceId: product.reference_id,
                    productSlug: product.slug
                  }
                }"
              >
                <q-avatar square size="96px">
                  <img contain :src="product.photos[0].photo.small">
                </q-avatar>
              </router-link>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="2" class="text-body1">
                <router-link
                  class="text-black"
                  :to="{
                    name: 'store-product-detail',
                    params: {
                      catalogSlug: catalogSlug,
                      referenceId: product.reference_id,
                      productSlug: product.slug
                    }
                  }"
                >
                  {{ product.name }}
                </router-link>
              </q-item-label>
              <q-item-label caption lines="2">{{ product.description }}</q-item-label>
              <q-item-label class="q-pt-md text-body1 text-weight-medium">
                <router-link
                  class="text-black"
                  :to="{
                    name: 'store-product-detail',
                    params: {
                      catalogSlug: catalogSlug,
                      referenceId: product.reference_id,
                      productSlug: product.slug
                    }
                  }"
                >
                  ₦{{ product.price }}
                </router-link>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreSearch',
  data () {
    return {
      products: [],
      catalogSlug: this.$route.params.catalogSlug
    }
  },
  methods: {
    getProductsList: function () {
      let self = this
      if (self.$route.query.name !== '') {
        self.$axios.get(
          'catalogs/' + self.$route.params.catalogSlug + '/products/?name__icontains=' +
          self.$route.query.name
        )
          .then(function (response) {
            if (response.status === 200) {
              self.products = response.data
            }
          })
      }
    }
  },
  computed: {
    queryName () {
      return this.$route.query.name || 1
    }
  },
  watch: {
    queryName: {
      handler (newName, oldName) {
        this.getProductsList()
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
