<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <q-list separator>
          <q-item v-for="product in products" :key="product.id">
            <q-item-section side>
              <q-avatar square size="128px">
                <img contain :src="product.photos[0].photo.small">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ product.name }}</q-item-label>
              <q-item-label caption lines="2">{{ product.description }}</q-item-label>
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
      products: []
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
