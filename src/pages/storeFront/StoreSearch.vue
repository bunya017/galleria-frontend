<template>
  <q-page padding>
    <div class="row justify-center" v-if="searchNotFound === false">
      <div class="col-12 col-md-10">
        <q-list separator v-if="products.length > 0">
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
        <div v-else class="text-italic q-pt-md text-subtitle1">
          No search results found for "{{ queryName }}".
        </div>
      </div>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="searchNotFound === true">
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
  name: 'StoreSearch',
  meta () {
    return {
      title: 'Search'
    }
  },
  data () {
    return {
      products: [],
      catalogSlug: this.$route.params.catalogSlug,
      searchNotFound: null
    }
  },
  methods: {
    getProductsList () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      if (self.$route.query.name !== '') {
        self.$axios.get(
          'catalogs/' + self.$route.params.catalogSlug + '/products/?name__icontains=' +
          self.$route.query.name
        )
          .then(function (response) {
            if (response.status === 200) {
              self.products = response.data
              self.$store.dispatch('navbar/updateIs404Action', false)
              self.searchNotFound = false
              self.$q.loading.hide()
            }
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.$store.dispatch('navbar/updateIs404Action', true)
              self.searchNotFound = true
              self.$q.loading.hide()
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
