<template>
  <q-page padding>
    <div class="text-h4">Collections</div>
    <div class="row q-pt-lg q-pb-xl q-col-gutter-md">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="col-12 col-sm-6 col-md-3"
      >
        <q-card>
          <div class="row justify-center items-center" style="min-height: 100px;">
            <div class="text-center">
              <div class="text-h5">{{ collection.name }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Collectins List -->
    <div class="row q-at-sm q-pb-xl">
      <div class="col-12">
        <q-table
          :data="collections"
          :columns="columns"
          row-key="name"
          hide-header
          hide-bottom
        >
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CollectionList',
  data: function () {
    return {
      collections: [],
      columns: [
        { name: 'name', label: 'COLLECTIONS', field: 'name', align: 'left' },
        { name: 'catalog', label: 'CATALOG', field: 'catalog', align: 'left', classes: 'gt-xs' },
        { name: 'actions', label: 'ACTIONS', align: 'left' }
      ]
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCollectionList: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collections = response.data
          }
        })
    }
  },
  created: function () {
    this.getCollectionList()
  }
}
</script>

<style>
</style>
