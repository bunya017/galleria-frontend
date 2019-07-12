<template>
  <q-page padding>
    <div class="row items-center q-pt-sm q-pb-lg">
      <div class="text-h4 col-12 col-sm-6">Products List</div>
      <div class="col-12 col-sm-6 gt-xs">
        <q-btn
          class="bg-primary float-right"
          flat
          color="white"
          icon="add"
          label="new collection"
        />
      </div>
    </div>
    <!-- Collections List -->
    <div class="row q-pt-sm q-col-gutter-md">
      <div class="col-12" v-for="collection in collections" :key="collection.name">
        <q-card>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ collection.name.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ collection.name }}</q-item-label>
                <q-item-label caption>{{ collection.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn size="12px" flat dense round icon="more_vert">
                  <q-menu auto-close>
                    <q-list style="width: 200px;">
                      <q-item clickable @click="makeDeleteCollectionPayload(collection)">
                        <q-item-section avatar>
                          <q-avatar rounded icon="delete" />
                        </q-item-section>
                        <q-item-section>
                          Delete
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Delete collection dialog -->
    <q-dialog v-model="deleteColl" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-md q-py-md text-center">
            Are you sure you want to delete <span class="text-weight-bold">{{ deleteCollectionPayload.name }}</span> category permanently?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Floating button -->
    <q-page-sticky class="lt-sm" position="bottom-right" :offset="[30, 30]">
      <q-btn fab icon="add" color="primary" />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'CollectionList',
  data: function () {
    return {
      deleteColl: false,
      collections: [],
      deleteCollectionPayload: {
        name: '',
        slug: ''
      }
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
    },
    makeDeleteCollectionPayload: function (payload) {
      this.deleteColl = true
      this.deleteCollectionPayload.name = payload.name
      this.deleteCollectionPayload.slug = payload.slug
    }
  },
  created: function () {
    this.getCollectionList()
  }
}
</script>

<style>
</style>
