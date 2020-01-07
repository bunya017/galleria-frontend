<template>
  <q-page padding>
    <div v-if="isLoading === false">
      <!-- Title -->
      <div class="row items-center q-pt-sm">
        <div class="text-h4 col-12 col-sm-6">My Catalogs</div>
        <div class="col-12 col-sm-6 gt-xs">
          <q-btn
            class="bg-primary float-right"
            flat
            color="white"
            icon="add"
            label="new catalog"
            @click="newCat = true"
          />
        </div>
      </div>

      <!-- New catalog dialog/modal -->
      <q-dialog v-model="newCat" position="top" @hide="clearNewCatalogModel" no-backdrop-dismiss>
        <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
          <q-card-section class="text-center">
            <div class="text-h5">New catalog</div>
            <div class="text-subtitle2">Create new product catalog</div>
          </q-card-section>

          <q-card-section class="q-pt-xl">
            <div class="q-pa-md">
              <form v-on:submit.prevent.stop="addNewCatalog">
                <div class="q-gutter-y-sm">
                  <q-input
                    ref="name"
                    dense
                    autofocus
                    type="text"
                    label="Name"
                    bottom-slots
                    :error="nameError.status"
                    v-model="newCatalog.name"
                    :rules="[ val => !!val || 'This field is required.' ]"
                    @input="nameError.status = false"
                  >
                    <template v-slot:error>
                      {{ nameError.message }}
                    </template>
                  </q-input>
                  <q-input
                    ref="description"
                    dense
                    type="text"
                    label="Description"
                    bottom-slots
                    :error="descriptionError.status"
                    v-model="newCatalog.description"
                    :rules="[ val => !!val || 'This field is required.' ]"
                    @input="descriptionError.status = false"
                  >
                    <template v-slot:error>
                      {{ descriptionError.message }}
                    </template>
                  </q-input>
                  <q-input
                    ref="contactAddress"
                    dense
                    type="text"
                    label="Shop address"
                    bottom-slots
                    :error="contactAddressError.status"
                    v-model="newCatalog.contact_address"
                    :rules="[ val => !!val || 'This field is required.' ]"
                    @input="contactAddressError.status = false"
                  >
                    <template v-slot:error>
                      {{ contactAddressError.message }}
                    </template>
                  </q-input>
                  <q-input
                    ref="contactEmail"
                    dense
                    type="text"
                    label="Contact email"
                    bottom-slots
                    :error="contactEmailError.status"
                    v-model="newCatalog.contact_email"
                    :rules="[ val => !!val || 'This field is required.' ]"
                    @input="contactEmailError.status = false"
                  >
                    <template v-slot:error>
                      {{ contactEmailError.message }}
                    </template>
                  </q-input>
                  <q-input
                    ref="contactPhone"
                    dense
                    type="text"
                    label="Contact phone"
                    bottom-slots
                    :error="contactPhoneError.status"
                    v-model="newCatalog.contact_phone"
                    :rules="[ val => !!val || 'This field is required.' ]"
                    @input="contactPhoneError.status = false"
                  >
                    <template v-slot:error>
                      {{ contactPhoneError.message }}
                    </template>
                  </q-input>
                  <!-- Logo Image uploader -->
                  <image-input
                    class="q-pb-md"
                    ref="logoImage"
                    label="Logo Image"
                    color="white"
                    text-color="grey-8"
                    accept=".png, .jpeg, .jpg, .gif"
                  />
                  <!-- Background Image uploader -->
                  <image-input
                    class="q-pb-md"
                    ref="bgImage"
                    label="Background Image"
                    color="white"
                    text-color="grey-8"
                    accept=".png, .jpeg, .jpg, .gif"
                  />
                </div>
                <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                  <q-btn
                    flat
                    label="Cancel"
                    color="negative"
                    v-close-popup
                  />
                  <q-btn
                    flat
                    color="white"
                    type="submit"
                    label="Add new"
                    class="bg-primary"
                    :loading="newCatalogButtonLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Catalog List -->
      <div class="row q-pt-lg q-pb-xl q-col-gutter-md" v-if="catalogs[0]">
        <div class="col-12">
          <q-card>
            <q-list separator>
              <q-item
                v-for="catalog in catalogs"
                :key="catalog.id"
              >
                <q-item-section avatar>
                  <q-avatar v-if="catalog.logo_image.thumbnail" size="56px">
                    <img :src="catalog.logo_image.thumbnail">
                  </q-avatar>
                  <q-avatar v-else-if="catalog.background_image.thumbnail" size="56px">
                    <img :src="catalog.background_image.thumbnail">
                  </q-avatar>
                  <q-avatar v-else color="primary" size="56px" text-color="white">
                    {{ getFirstLetters(catalog.name) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <router-link
                    :to="{
                      name: 'catalog-detail',
                      params: {
                        slug: catalog.slug
                      }
                    }"
                  >
                    <q-item-label>{{ catalog.name }}</q-item-label>
                    <q-item-label caption>{{ catalog.description }}</q-item-label>
                  </router-link>
                </q-item-section>
                <q-item-section class="gt-xs">
                  <q-item-label>{{ catalog.categories.length }} Categories</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn size="12px" flat dense round icon="more_vert">
                    <q-menu auto-close>
                      <q-list style="width: 200px;">
                        <q-item clickable @click="makeDeleteCatalogPayload(catalog)">
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

      <!-- Delete category dialog -->
      <q-dialog v-model="deleteCat" @hide="clearDeleteCatalogPayload" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6 text-center">Confirm Permanent Delete?</div>
          </q-card-section>
          <q-card-section class="row items-center">
            <span class="q-py-xs text-center">
              You are about to delete <strong class="text-negative">{{ deleteCatalogPayload.name }}</strong> including all its categories, collections & product data and photos (if any). Enter the name of this catalog in the box below to confirm deletion of this catalog. Please note that this is not <strong>not reversible.</strong>
            </span>
            <div class="fit q-pt-lg">
              Confirm Catalog Name:
              <q-input
                dense
                outlined
                type="text"
                v-model="confirmDeletePayload"
                :placeholder="deleteCatalogPayload.name"
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
              @click="deleteCatalog"
              :loading="deleteCatalogButtonLoading"
              :disabled="confirmDeletePayload !== deleteCatalogPayload.name"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Floating button -->
      <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
        <q-btn fab icon="add" color="primary" @click="newCat = true" />
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CatalogsList',
  meta () {
    return {
      title: 'Dashboard'
    }
  },
  data () {
    return {
      isLoading: true,
      newCatalogButtonLoading: false,
      deleteCatalogButtonLoading: false,
      catalogsCount: 0,
      activeCatalogs: 0,
      newCat: false,
      catalogs: {},
      deleteCat: false,
      confirmDeletePayload: '',
      deleteCatalogPayload: {
        name: '',
        url: ''
      },
      newCatalog: {
        name: '',
        description: '',
        contact_address: '',
        contact_email: '',
        contact_phone: ''
      },
      alertPayload: {
        color: 'green-1',
        textColor: 'positive',
        icon: 'check_circle',
        position: 'top',
        message: '',
        classes: 'q-mt-xl'
      },
      nameError: {
        status: false,
        message: ''
      },
      descriptionError: {
        status: false,
        message: 'This field is required.'
      },
      contactAddressError: {
        status: false,
        message: 'This field is required.'
      },
      contactPhoneError: {
        status: false,
        message: 'This field is required.'
      },
      contactEmailError: {
        status: false,
        message: 'This field is required.'
      }
    }
  },
  methods: {
    getAuthToken () {
      return sessionStorage.getItem('authToken')
    },
    getCatalogs () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/'
      )
        .then(function (response) {
          self.catalogs = response.data
          self.catalogsCount = response.data.length
          let payload = []
          for (let i = 0; i < response.data.length; i++) {
            payload.push({
              name: response.data[i].name,
              slug: response.data[i].slug
            })
          }
          self.isLoading = false
          self.$q.loading.hide()
        })
    },
    addNewCatalog () {
      let self = this
      self.newCatalogButtonLoading = true
      self.$refs.name.validate()
      self.$refs.description.validate()
      self.$refs.contactAddress.validate()
      self.$refs.contactPhone.validate()
      self.$refs.contactEmail.validate()
      if (
        self.$refs.name.hasError ||
        self.$refs.description.hasError ||
        self.$refs.contactAddress.hasError ||
        self.$refs.contactPhone.hasError ||
        self.$refs.contactPhone.hasError ||
        self.$refs.contactEmail.hasError
      ) {
        self.formHasError = true
        self.newCatalogButtonLoading = false
      }
      let catalogPayload = new FormData()
      let bgImage = self.$refs.bgImage.files
      let logoImage = self.$refs.logoImage.files
      catalogPayload.append('name', self.newCatalog.name)
      catalogPayload.append('description', self.newCatalog.description)
      catalogPayload.append('contact_address', self.newCatalog.contact_address)
      catalogPayload.append('contact_email', self.newCatalog.contact_email)
      catalogPayload.append('contact_phone', self.newCatalog.contact_phone)
      if (bgImage.length === 1) {
        catalogPayload.append('background_image', bgImage[0])
      }
      if (logoImage.length === 1) {
        catalogPayload.append('logo_image', logoImage[0])
      }
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken(),
        'Content-Type': 'multipart/form'
      }
      self.$axios.post(
        'catalogs/',
        catalogPayload
      )
        .then(function (response) {
          if (response.status === 201) {
            self.getCatalogs()
            self.alertPayload.message = 'Catalog created successfully!'
            self.showAlert(self.alertPayload)
            self.newCatalogButtonLoading = false
            self.newCat = false
          }
        })
        .catch(function (error) {
          if (error.response.data.name) {
            self.nameError.message = error.response.data.name[0]
            self.nameError.status = true
          }
          if (error.response.data.description) {
            self.descriptionError.status = true
          }
          if (error.response.data.contact_address) {
            self.contactAddressError.status = true
          }
          if (error.response.data.contact_phone) {
            self.contactPhoneError.status = true
          }
          if (error.response.data.contact_email) {
            self.contactEmailError.status = true
          }
          self.newCatalogButtonLoading = false
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
    clearNewCatalogModel () {
      this.newCatalog.name = ''
      this.newCatalog.description = ''
      this.newCatalog.contact_address = ''
      this.newCatalog.contact_email = ''
      this.newCatalog.contact_phone = ''
    },
    getFirstLetters (payload) {
      let wordsList = payload.split(' ')
      if (!!wordsList[1] === true) {
        return wordsList[0].charAt(0).toUpperCase() + wordsList[1].charAt(0)
      } else {
        return wordsList[0].charAt(0).toUpperCase()
      }
    },
    makeDeleteCatalogPayload (payload) {
      this.deleteCat = true
      this.deleteCatalogPayload.name = payload.name
      this.deleteCatalogPayload.url = process.env.PROD
        ? payload.url.replace('http://', 'https://') : payload.url
    },
    clearDeleteCatalogPayload () {
      this.deleteCatalogPayload.name = ''
      this.deleteCatalogPayload.url = ''
      this.confirmDeletePayload = ''
    },
    deleteCatalog () {
      let self = this
      self.deleteCatalogButtonLoading = true
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.delete(
        self.deleteCatalogPayload.url
      )
        .then(function (response) {
          if (response.status === 204) {
            self.getCatalogs()
            self.alertPayload.message = 'Catalog deleted successfully!'
            self.showAlert(self.alertPayload)
            self.deleteCatalogButtonLoading = false
            self.deleteCat = false
          }
        })
    }
  },
  created () {
    this.getCatalogs()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
.product-photo {
  width: 56px;
  height: 56px;
  border-radius: 5px;
}
</style>
