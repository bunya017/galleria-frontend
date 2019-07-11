<template>
  <q-page padding>
    <!-- Collectins List -->
    <div class="row q-at-sm q-pb-xl">
      <div class="col-12">
        <q-table
          :data="collections"
          :columns="columns"
          row-key="name"
          flat
          hide-header
          hide-bottom
        >
          <template v-slot:top>
            <div class="text-h4">Collections</div>
            <q-space />
            <q-btn
              class="bg-primary q-mt-xs-md"
              flat
              color="white"
              icon="add"
              label="new collection"
            />
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-item
                clickable
                v-ripple
                class="q-pa-none"
              >
                <q-item-section side>
                  <q-avatar color="primary" text-color="white" size="56px">
                    {{ props.row.name.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ props.row.name }}</q-item-label>
                  <q-item-label caption lines="1">{{ props.row.description }}</q-item-label>
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
  name: 'CollectionList',
  data: function () {
    return {
      collections: [],
      columns: [
        { name: 'name', label: 'COLLECTIONS', field: 'name', align: 'left' },
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
