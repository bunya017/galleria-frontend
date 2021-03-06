<template>
  <q-page padding>
    <div v-if="collListNotFound === false">
      <!-- Title -->
      <div class="row items-center q-pt-sm q-pb-none">
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

      <!-- Breadcrumbs -->
      <div class="q-pa-sm q-gutter-sm">
        <q-breadcrumbs separator="/" class="text-uppercase breadcrumbs-text" gutter="xs">
          <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
          <q-breadcrumbs-el
            v-if="catalog"
            :label="catalog.name"
            :to="{
              name:'catalog-detail',
              params: {
                slug: this.$route.params.catalogSlug
              }
            }"
          />
          <q-breadcrumbs-el label="Collection List" />
        </q-breadcrumbs>
      </div>

      <!-- Collections List -->
      <div class="row q-pt-sm q-col-gutter-md" v-if="collections.length > 0">
        <div class="col-12" v-for="collection in collections" :key="collection.name">
          <q-card>
            <q-list>
              <q-item
                v-if="catalogSlug"
              >
                <q-item-section avatar>
                  <q-avatar v-if="collection.background_image.thumbnail" size="56px">
                    <img :src="collection.background_image.thumbnail">
                  </q-avatar>
                  <q-avatar v-else color="primary" size="56px" text-color="white">
                    {{ collection.name.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <router-link
                    :to="{
                      name: 'collection-detail',
                      params: {
                        catalogSlug: catalogSlug,
                        collectionSlug: collection.slug
                      }
                    }"
                  >
                    <q-item-label>{{ collection.name }}</q-item-label>
                    <q-item-label caption>{{ collection.description }}</q-item-label>
                  </router-link>
                </q-item-section>
                <q-item-section side>
                  <q-btn size="12px" flat dense round icon="more_vert">
                    <q-menu auto-close>
                      <q-list style="width: 200px;">
                        <q-item clickable @click="makeEditCollectionPayload(collection)">
                          <q-item-section avatar>
                            <q-avatar rounded icon="edit" />
                          </q-item-section>
                          <q-item-section>
                            Edit
                          </q-item-section>
                        </q-item>
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
      <div v-else class="row jutify-center text-center q-pb-md" style="padding-top: 10vh;">
        <div class="col-12 q-px-md">
          <img height="150" width="150" alt="Quasar logo" src="../../assets/undraw-no-data.svg">
          <div class="text-body1 q-py-sm">
            You have not added any collection yet. Click on the
            <q-btn v-if="$q.screen.lt.sm" round size="xs" color="primary" icon="add" />
            <q-btn v-else size="sm" dense class="q-py-xs" color="primary" icon="add" label="NEW COLLECTION" />
            button to add one.
          </div>
        </div>
      </div>

      <!-- Edit collection dialog -->
      <q-dialog
        position="top"
        no-backdrop-dismiss
        v-model="collectionEdit"
        @hide="clearEditCollectionPayload"
      >
        <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
          <q-card-section class="q-py-md">
            <div class="text-h5">Edit Collection</div>
            <div class="text-subtitle2">Edit collection details</div>
          </q-card-section>
          <q-card-section class="q-px-sm q-py-lg">
            <div class="q-px-md">
              <form @submit.prevent.stop="editCollection">
                <q-input
                  dense
                  auto-focus
                  lazy-rules
                  type="text"
                  label="Name"
                  v-model="editCollectionPayload.name"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  dense
                  lazy-rules
                  type="text"
                  label="Description"
                  v-model="editCollectionPayload.description"
                  :rules="[val => !!val || 'Field is required']"
                />
                <image-input
                  ref="editCollectionBgImage"
                  label="Background image (Change the current logo image)"
                  color="white"
                  textColor="grey-8"
                  accept=".jpg, image/*"
                />
                <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                  <q-btn
                    flat
                    label="Cancel"
                    color="grey-7"
                    v-close-popup
                  />
                  <q-btn
                    label="Edit Collection"
                    type="submit"
                    color="primary"
                    :loading="editCollectionButtonLoading"
                    :disabled="editCollectionButtonLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Delete collection dialog -->
      <q-dialog v-model="deleteColl" persistent @hide="clearDeleteCollectionModel">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-center">Confirm Permanent Delete?</div>
          </q-card-section>
          <q-card-section class="row items-center">
            <span class="q-py-xs text-center">
              You are about to delete <strong class="text-negative">{{ deleteCollectionPayload.name }}</strong> including all its data and photos (if any). Enter the name of this collection in the box below to confirm deletion of this collection. Please note that this is not <strong>not reversible.</strong>
            </span>
            <div class="fit q-pt-lg">
              Confirm Collection Name:
              <q-input
                dense
                outlined
                type="text"
                v-model="confirmDeletePayload"
                :placeholder="deleteCollectionPayload.name"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              outline
              label="Cancel"
              color="grey-7"
              v-close-popup
            />
            <q-btn
              label="Delete"
              color="negative"
              @click="deleteCollection"
              :loading="deleteCollectionButtonLoading"
              :disabled="(confirmDeletePayload !== deleteCollectionPayload.name)
                || deleteCollectionButtonLoading"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- New collection dialog -->
      <q-dialog
        v-model="newColl"
        position="top"
        no-backdrop-dismiss
        @hide="clearNewCollectionModel"
      >
        <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
          <q-card-section>
            <div class="text-h5">New collection</div>
            <div class="text-subtitle2">Add new product collection</div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <div class="q-px-sm-md">
              <form class="q-gutter-sm" v-on:submit.prevent.stop="addNewCollection">
                <q-input
                  ref="name"
                  dense
                  autofocus
                  type="text"
                  label="Name"
                  :error="nameError.status"
                  :error-message="nameError.message"
                  v-model="newCollection.name"
                  :rules="[ val => !!val || 'This field is required.' ]"
                  @input="nameError.status = false"
                />
                <q-input
                  ref="description"
                  dense
                  rows="2"
                  type="textarea"
                  label="Description"
                  v-model="newCollection.description"
                  :rules="[ val => !!val || 'This field is required.' ]"
                />
                <!-- Background Image input -->
                <image-input
                  ref="bgImageFile"
                  label="Background image (Change the current logo image)"
                  color="white"
                  textColor="grey-8"
                  accept=".jpg, image/*"
                />
                <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                  <q-btn
                    flat
                    label="Cancel"
                    color="grey-7"
                    v-close-popup
                  />
                  <q-btn
                    type="submit"
                    label="Add new"
                    color="primary"
                    :loading="newCollectionButtonLoading"
                    :disabled="newCollectionButtonLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Floating button -->
      <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
        <q-btn fab icon="add" color="primary" @click="newColl = true" />
      </q-page-sticky>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="collListNotFound === true">
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
  name: 'CollectionList',
  meta () {
    return {
      title: `Collections | ${this.catalog.name}`
    }
  },
  data () {
    return {
      newCollectionButtonLoading: false,
      deleteCollectionButtonLoading: false,
      editCollectionButtonLoading: false,
      collListNotFound: null,
      deleteColl: false,
      collectionEdit: false,
      confirmDeletePayload: '',
      newColl: false,
      catalog: {},
      catalogSlug: this.$route.params.catalogSlug,
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
      editCollectionPayload: {
        name: '',
        description: '',
        slug: ''
      },
      alertPayload: {
        color: 'green-1',
        textColor: 'positive',
        icon: 'check_circle',
        position: 'top',
        message: '',
        classes: 'q-mt-xl'
      },
      errorAlertPayload: {
        color: 'red-1',
        textColor: 'negative',
        icon: 'error',
        position: 'top',
        message: '',
        classes: 'q-mt-xl'
      },
      nameError: {
        status: false,
        message: ''
      }
    }
  },
  methods: {
    getAuthToken () {
      return sessionStorage.getItem('authToken')
    },
    getCollectionList () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/?is_featured=false'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collections = response.data
            self.collListNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.collListNotFound = true
            self.$q.loading.hide()
          }
        })
    },
    makeDeleteCollectionPayload (payload) {
      this.deleteColl = true
      this.deleteCollectionPayload.name = payload.name
      this.deleteCollectionPayload.slug = payload.slug
    },
    deleteCollection () {
      let self = this
      self.deleteCollectionButtonLoading = true
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
            self.deleteCollectionButtonLoading = false
            self.deleteColl = false
          }
        })
    },
    showAlert (payload) {
      const {
        color, textColor, message, icon,
        position, classes
      } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        classes
      })
    },
    getCollectionsCatalog () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug
      )
        .then(function (response) {
          self.catalog = response.data
        })
    },
    addNewCollection () {
      let self = this
      self.newCollectionButtonLoading = true
      self.newCollection.catalog = self.catalog.id
      let payload = new FormData()
      payload.append('name', self.newCollection.name)
      payload.append('catalog', self.newCollection.catalog)
      payload.append('description', self.newCollection.description)
      if (this.$refs.bgImageFile.files.length > 0) {
        payload.append('background_image', this.$refs.bgImageFile.files[0])
      }

      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken(),
        'Content-Type': 'multipart/form'
      }
      self.$axios.post(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/',
        payload
      )
        .then(function (response) {
          if (response.status === 201) {
            self.getCollectionList()
            self.alertPayload.message = 'Collection added successfully!'
            self.showAlert(self.alertPayload)
            self.newCollectionButtonLoading = false
            self.newColl = false
          }
        })
        .catch(function (error) {
          if (error.response.data.name) {
            if (error.response.data.name[0].indexOf('A collection named') >= 0) {
              self.errorAlertPayload.message = error.response.data.name[0]
              self.showAlert(self.errorAlertPayload)
            }
            self.newCollectionButtonLoading = false
            self.nameError.message = error.response.data.name[0]
            self.nameError.status = true
          }
        })
    },
    clearNewCollectionModel () {
      this.newCollection.name = ''
      this.newCollection.description = ''
      this.newCollection.catalog = null
      this.newCollection.background_image = null
      this.nameError.status = false
      this.nameError.message = ''
    },
    clearDeleteCollectionModel () {
      this.deleteCollectionPayload.name = ''
      this.deleteCollectionPayload.slug = ''
      this.confirmDeletePayload = ''
    },
    makeEditCollectionPayload (payload) {
      this.collectionEdit = true
      this.editCollectionPayload.name = payload.name
      this.editCollectionPayload.description = payload.description
      this.editCollectionPayload.slug = payload.slug
    },
    clearEditCollectionPayload () {
      this.editCollectionPayload.name = ''
      this.editCollectionPayload.description = ''
      this.editCollectionPayload.slug = ''
    },
    editCollection () {
      let self = this
      self.editCollectionButtonLoading = true
      self.editCollectionPayload.catalog = self.catalog.id
      let payload = new FormData()
      payload.append('name', self.editCollectionPayload.name)
      payload.append('catalog', self.editCollectionPayload.catalog)
      payload.append('description', self.editCollectionPayload.description)
      if (this.$refs.editCollectionBgImage.files.length > 0) {
        payload.append('background_image', this.$refs.editCollectionBgImage.files[0])
      }

      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken(),
        'Content-Type': 'multipart/form'
      }
      self.$axios.patch(
        'catalogs/' + self.catalogSlug + '/collections/' + self.editCollectionPayload.slug + '/',
        payload
      )
        .then(function (response) {
          if (response.status === 200) {
            self.getCollectionList()
            self.alertPayload.message = 'Collection edited successfully!'
            self.editCollectionButtonLoading = false
            self.collectionEdit = false
            self.showAlert(self.alertPayload)
          }
        })
        .catch(function (error) {
          if (error.response.data.name) {
            if (error.response.data.name[0].indexOf('A collection named') >= 0) {
              self.errorAlertPayload.message = error.response.data.name[0]
              self.showAlert(self.errorAlertPayload)
            }
            self.editCollectionButtonLoading = false
          }
        })
    }
  },
  created () {
    this.getCollectionList()
    this.getCollectionsCatalog()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
