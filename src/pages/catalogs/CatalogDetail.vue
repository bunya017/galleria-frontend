<template>
  <q-page padding>
    <div class="text-h4">{{ catalog.name }}</div>
    <div class="q-px-sm q-gutter-sm">
      <q-breadcrumbs separator=">">
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          :label="catalog.name"
          :to="{
            name:'my-catalogs',
            params: {
              slug: this.$route.params.slug
            }
          }"
        />
      </q-breadcrumbs>
    </div>

    <div class="row q-pt-lg q-pb-xl q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="cursor-pointer" @click="newCat = true" style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">Add new category</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ categoryCount }} Categories</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ productCount }} Products</div>
            <div class="text-subtitle2">(Click to view all products)</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ activeProducts }} Active</div>
            <div class="text-subtitle2">Products</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- New category modal/dialog -->
    <q-dialog v-model="newCat" persistent>
      <q-card class="q-mt-lg" style="width: 600px; max-width: 80vw;">
        <q-card-section class="text-center">
          <div class="text-h5">New category</div>
          <div class="text-subtitle2">Add new product category</div>
        </q-card-section>

        <q-card-section class="q-pt-xl">
          <div class="q-pa-md">
            <form v-on:submit.prevent="addNewCategory">
              <div class="q-gutter-y-sm">
                <q-input
                  dense
                  autofocus
                  type="text"
                  label="Name"
                  v-model="newCategory.name"
                  :rules="[ val => !!val || 'This field is required.' ]"
                />
                <q-input
                  dense
                  type="text"
                  label="Description"
                  v-model="newCategory.description"
                  :rules="[ val => !!val || 'This field is required.' ]"
                />
              </div>
              <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                <q-btn flat label="Cancel" color="negative" v-close-dialog />
                <q-btn flat class="bg-primary" type="submit" label="Add new" color="white" v-close-dialog />
              </q-card-actions>
            </form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="text-h5">Categories</div>
    <div class="row q-pt-sm q-pb-xl q-col-gutter-md">
      <div class="col-12" v-for="category in catalog.categories" :key="category.name">
        <q-card>
          <q-list>
            <q-item clickable>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ getFirstLetter(category.name) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ category.name }}</q-item-label>
                <q-item-label caption>{{ category.description }}</q-item-label>
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
  name: 'CatalogDetail',
  data: function () {
    return {
      categoryCount: 0,
      productCount: 0,
      activeProducts: 0,
      newCat: false,
      catalog: {},
      newCategory: {
        name: '',
        description: '',
        catalog: null
      },
      alertPayload: {
        color: 'positive',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        message: '',
        closeBtn: 'Close',
        classes: 'q-mt-xl',
        onDismiss: this.dismiss
      }
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCatalogDetail: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.slug
      )
        .then(function (response) {
          self.catalog = response.data
          self.categoryCount = response.data.categories.length
          self.productCount = self.getProductCount(response.data.categories)
        })
    },
    getProductCount: function (payload) {
      let productsAmount = 0
      for (let i = 0; i < payload.length; i++) {
        productsAmount += payload[i].product_entries.length
      }
      return productsAmount
    },
    getFirstLetter: function (payload) {
      return payload.charAt(0).toUpperCase()
    },
    addNewCategory: function () {
      let self = this
      self.newCategory.catalog = self.catalog.id
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.post(
        'catalogs/' + self.catalog.slug + '/categories/',
        self.newCategory
      )
        .then(function (response) {
          if (response.status === 201) {
            self.alertPayload.message = 'Category added successfully!'
            self.showAlert(self.alertPayload)
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
      this.getCatalogDetail()
    }
  },
  created: function () {
    this.getCatalogDetail()
  }
}
</script>

<style>
</style>
