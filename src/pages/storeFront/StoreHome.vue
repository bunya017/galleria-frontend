<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div class="col-6">
        <q-card style="width: 100%">
          <q-img
            :src="catalog.categories[0].background_image.small"
          >
            <div class="absolute-full text-subtitle2 flex flex-center">
              View by categories
            </div>
          </q-img>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreHome',
  data () {
    return {
      catalog: {}
    }
  },
  methods: {
    getCatalog: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.catalog = response.data
          }
        })
    }
  },
  created: function () {
    this.getCatalog()
  }
}
</script>

<style>
</style>
