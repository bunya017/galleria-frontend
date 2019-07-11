<template>
  <q-page padding>
    <!-- Collections List -->
    <div class="row q-pt-sm q-pb-xl q-col-gutter-md">
      <div class="col-12" v-for="collection in collections" :key="collection.name">
        <q-card>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" size="56px">
                  {{ collection.name.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ collection.name }}</q-item-label>
                <q-item-label caption>{{ collection.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn size="12px" flat dense round icon="more_vert" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CollectionList',
  data: function () {
    return {
      collections: []
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
