<template>
  <q-page padding>
    <div class="row items-center q-pt-sm q-pb-lg">
      <div class="text-h4 col-12 col-sm-6">Collection List</div>
      <div class="col-12 col-sm-6 gt-xs">
        <q-btn
          class="bg-primary float-right"
          flat
          color="white"
          icon="add"
          label="new collection"
          @click="newColl = true"
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
          <q-btn flat label="Delete" color="negative" @click="deleteCollection" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- New collection dialog -->
    <q-dialog v-model="newColl" position="top" no-backdrop-dismiss>
      <q-card class="q-mt-lg" style="width: 600px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5">New collection</div>
          <div class="text-subtitle2">Add new product collection</div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <div class="q-px-sm-md">
            <form class="q-gutter-sm">
              <q-input
                ref="name"
                dense
                autofocus
                type="text"
                label="Name"
                v-model="newCollection.name"
                :rules="[ val => !!val || 'This field is required.' ]"
              />
              <q-input
                ref="description"
                dense
                type="textarea"
                label="description"
                v-model="newCollection.description"
                :rules="[ val => !!val || 'This field is required.' ]"
              />
              <!-- Background Image input -->
              <div class="row">
                <q-uploader
                  class="col"
                  ref="bgImageFile"
                  label="Background Image(optional)"
                  color="white"
                  text-color="grey-8"
                  accept=".png, .jpeg, .jpg, .gif"
                  hide-upload-btn
                >
                  <template v-slot:list="scope">
                    <q-list separator>
                      <q-item v-for="file in scope.files" :key="file.name">
                        <q-item-section>
                          <q-item-label class="full-width ellipsis">
                            {{ file.name }}
                          </q-item-label>
                          <q-item-label caption>
                            {{ file.__sizeLabel }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section
                          v-if="file.__img"
                          thumbnail
                        >
                          <img :src="file.__img.src" class="bg-image">
                        </q-item-section>
                        <q-item-section side>
                          <q-btn
                            size="12px"
                            flat
                            dense
                            round
                            icon="delete"
                            @click="scope.removeFile(file)"
                          />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </template>
                </q-uploader>
              </div>
              <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                <q-btn flat label="Cancel" color="negative" v-close-popup />
              </q-card-actions>
            </form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Floating button -->
    <q-page-sticky class="lt-sm" position="bottom-right" :offset="[30, 30]">
      <q-btn fab icon="add" color="primary" @click="newColl = true" />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'CollectionList',
  data: function () {
    return {
      deleteColl: false,
      newColl: false,
      collections: [],
      newCollection: {
        name: '',
        catalog: null,
        description: '',
        background_image: null
      },
      deleteCollectionPayload: {
        name: '',
        slug: ''
      },
      alertPayload: {
        color: 'positive',
        textColor: 'white',
        icon: 'thumb_up',
        position: 'top',
        message: '',
        closeBtn: 'Close',
        classes: 'q-mt-xl'
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
    },
    deleteCollection: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.delete(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/' + this.deleteCollectionPayload.slug + '/'
      )
        .then(function (response) {
          if (response.status === 204) {
            self.getCollectionList()
            self.alertPayload.message = 'Collection deleted successfully!'
            self.showAlert(self.alertPayload)
            self.deleteColl = false
          }
        })
    },
    showAlert: function (payload) {
      const {
        color, textColor, message, icon,
        position, closeBtn, classes
      } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        closeBtn,
        classes
      })
    }
  },
  created: function () {
    this.getCollectionList()
  }
}
</script>

<style scoped>
.bg-image {
  max-height: 56px;
  width: auto;
  border-radius: 5px;
}
</style>
