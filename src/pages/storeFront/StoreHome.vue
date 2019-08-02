<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center">
      <div class="col-12 col-sm-10">
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-card style="width: 100%">
              <q-img
                :src="catalog.categories[0].background_image.small"
              >
                <div class="absolute-full text-subtitle2 flex flex-center">
                  Categories
                </div>
              </q-img>
            </q-card>
          </div>
          <div class="col-6">
            <q-card style="width: 100%">
              <q-img
                :src="catalog.collections[0].background_image.small"
              >
                <div class="absolute-full text-subtitle2 flex flex-center">
                  Collections
                </div>
              </q-img>
            </q-card>
          </div>
        </div>
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
