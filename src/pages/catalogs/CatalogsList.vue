<template>
  <q-page class="q-pa-lg">
    <div class="text-h4">Dashboard</div>
    <div class="q-px-sm q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
      </q-breadcrumbs>
    </div>

    <div class="row q-pt-lg q-pb-xl q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="cursor-pointer" @click="newCat = true">
          <div class="row justify-center items-center" style="min-height: 100px;">
            <div class="text-center">
              <div class="text-h5">Add new catalog</div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <div class="row justify-center items-center" style="min-height: 100px;">
            <div class="text-center">
              <div class="text-h5">{{ numberOfCatalogs }} Catalogs</div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <div class="row justify-center items-center" style="min-height: 100px;">
            <div class="text-center">
              <div class="text-h5">{{ numberOfProducts }} Products</div>
              <div class="text-subtitle2">across all catalogs</div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <div class="row justify-center items-center" style="min-height: 100px;">
            <div class="text-center">
              <div class="text-h5">{{ activeCatalogs }} Active</div>
              <div class="text-subtitle2">Catalogs</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- New catalog dialog/modal -->
    <q-dialog v-model="newCat" persistent>
      <q-card class="q-mt-lg" style="width: 600px; max-width: 80vw;">
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
                  :error="descriptionError"
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
              </div>
              <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                <q-btn flat label="Cancel" color="negative" v-close-dialog />
                <q-btn flat class="bg-primary" type="submit" label="Add new" color="white" />
              </q-card-actions>
            </form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="text-h5">My Catalogs</div>
    <div class="row q-pt-sm q-pb-xl q-col-gutter-md">
      <div class="col-12" v-for="catalog in catalogs" :key="catalog.id">
        <q-card>
          <q-list>
            <q-item
              clickable
              :to="{
                name: 'catalog-detail',
                params: {
                  slug: catalog.slug
                }
              }"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ getFirstLetter(catalog.name) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ catalog.name }}</q-item-label>
                <q-item-label caption>{{ catalog.description }}</q-item-label>
              </q-item-section>
              <q-item-section class="gt-xs">
                <q-item-label>{{ catalog.categories.length }} Categories</q-item-label>
              </q-item-section>
              <q-item-section side class="gt-xs">
                <q-badge color="green-10" text-color="white" label="active" />
              </q-item-section>
              <q-item-section top side>
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
  name: 'CatalogsList',
  data: function () {
    return {
      numberOfCatalogs: 0,
      numberOfProducts: 0,
      activeCatalogs: 0,
      newCat: false,
      newCatalog: {
        name: '',
        description: '',
        contact_address: '',
        contact_email: '',
        contact_phone: ''
      },
      catalogs: {},
      alertPayload: {
        color: 'positive',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        message: '',
        closeBtn: 'Close',
        classes: 'q-mt-xl',
        onDismiss: this.dismiss
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
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCatalogs: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/'
      )
        .then(function (response) {
          self.catalogs = response.data
          self.numberOfCatalogs = response.data.length
        })
    },
    addNewCatalog: function () {
      let self = this
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
      }
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.post(
        'catalogs/',
        self.newCatalog
      )
        .then(function (response) {
          if (response.status === 201) {
            self.alertPayload.message = 'Catalog created successfully!'
            self.showAlert(self.alertPayload)
            self.newCat = false
            self.clearNewCatalogModel()
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
        })
    },
    showAlert: function (payload) {
      const {
        color, textColor, message, icon,
        position, closeBtn, classes, onDismiss
      } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        closeBtn,
        classes,
        onDismiss
      })
    },
    dismiss: function () {
      this.getCatalogs()
    },
    getFirstLetter: function (payload) {
      return payload.charAt(0).toUpperCase()
    },
    clearNewCatalogModel: function () {
      this.newCatalog.name = ''
      this.newCatalog.description = ''
      this.newCatalog.contact_address = ''
      this.newCatalog.contact_email = ''
      this.newCatalog.contact_phone = ''
    }
  },
  created: function () {
    this.getCatalogs()
  }
}
</script>

<style>
</style>
