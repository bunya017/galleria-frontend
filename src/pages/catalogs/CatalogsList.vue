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
                >
                  <template v-slot:error>
                    {{ nameError.message }}
                  </template>
                </q-input>
                <q-input
                  dense
                  type="text"
                  label="Description"
                  v-model="newCatalog.description"
                  :rules="[ val => !!val || 'This field is required.' ]"
                />
                <q-input
                  dense
                  type="text"
                  label="Shop address"
                  v-model="newCatalog.contact_address"
                  :rules="[ val => !!val || 'This field is required.' ]"
                />
                <q-input
                  dense
                  type="text"
                  label="Contact email"
                  v-model="newCatalog.contact_email"
                  :rules="[ val => !!val || 'This field is required.' ]"
                />
                <q-input
                  dense
                  type="text"
                  label="Contact phone"
                  v-model="newCatalog.contact_phone"
                  :rules="[ val => !!val || 'This field is required.' ]"
                />
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
      if (self.$refs.name.hasError) {
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
          }
        })
        .catch(function (error) {
          if (error.response.data.name) {
            self.nameError.message = error.response.data.name[0]
            self.nameError.status = true
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
    }
  },
  created: function () {
    this.getCatalogs()
  }
}
</script>

<style>
</style>
