<template>
  <q-page padding>
    <div class="text-h4">Products List</div>
    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-gutter-sm">
      <q-breadcrumbs separator=">>">
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          :label="catalog.name"
          :to="{
            name:'catalog-detail',
            params: {
              slug: this.$route.params.catalogSlug
            }
          }"
        />
        <q-breadcrumbs-el label="Products List" />
      </q-breadcrumbs>
    </div>
    <!-- Add new product-->
    <div class="q-pa-md">
      <div class="column items-end">
        <div class="col">
          <q-btn color="primary" label="Add new product" @click="newProd = true" />
        </div>
      </div>
    </div>
    <!-- New product dialog -->
    <q-dialog v-model="newProd" position="top" no-backdrop-dismiss>
      <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
        <q-card-section class="q-py-sm">
          <div class="text-h5">New Product</div>
          <div class="text-subtitle2">Add new product</div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <div class="q-px-md">
            <form v-on:submit.prevent.stop="addNewProduct">
              <q-input
                ref="name"
                dense
                lazy-rules
                auto-focus
                label="Name"
                type="text"
                v-model="newProduct.name"
                :error="nameError.status"
                :rules="[ val => !!val || 'This field is required.' ]"
                @input="nameError.status = false"
              >
                <template v-slot:error>
                  {{ nameError.message }}
                </template>
              </q-input>
              <q-select
                ref="category"
                dense
                lazy-rules
                :options="options"
                label="Category"
                v-model="newProduct.category"
                :error="categoryError.status"
                :rules="[ val => !!val || 'This field is required.' ]"
                @input="categoryError.status = false"
              >
                <template v-slot:error>
                  {{ categoryError.message }}
                </template>
              </q-select>
              <q-input
                ref="price"
                dense
                lazy-rules
                auto-focus
                label="Price"
                type="number"
                v-model="newProduct.price"
                :error="priceError.status"
                :rules="[ val => !!val || 'Please enter a valid number.' ]"
                @input="priceError.status = false"
              >
                <template v-slot:error>
                  {{ priceError.message }}
                </template>
              </q-input>
              <q-input
                ref="description"
                dense
                lazy-rules
                auto-focus
                label="Description"
                type="text"
                v-model="newProduct.description"
                :error="descriptionError.status"
                :rules="[ val => !!val || 'This field is required.' ]"
                @input="descriptionError.status = false"
              >
                <template v-slot:error>
                  {{ descriptionError.message }}
                </template>
              </q-input>
              <!-- Image uploader -->
              <div class="row">
                <q-uploader
                  class="col"
                  ref="photoFiles"
                  label="Photos"
                  color="white"
                  text-color="grey-8"
                  accept=".png, .jpeg, .jpg, .gif"
                  multiple
                  hide-upload-btn
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs" :class="{ 'negative-border': photosError.status }">
                      <q-btn
                        v-if="scope.queuedFiles.length > 0"
                        icon="clear_all" @click="scope.removeQueuedFiles"
                        round
                        dense
                        flat
                      />
                      <div class="col">
                        <div class="q-uploader__title" :class="{ 'text-negative': photosError.status }">Photos</div>
                        <div class="q-uploader__subtitle" v-if="scope.queuedFiles.length > 0">{{ scope.uploadSizeLabel }}</div>
                        <div class="q-uploader__subtitle text-negative" v-if="photosError.status === true">This field is required.</div>
                      </div>
                      <q-btn
                        v-if="photosError.status === true"
                        icon="error"
                        color="negative"
                        round
                        dense
                        flat
                      />
                      <q-btn
                        v-if="scope.editable"
                        icon="add_box"
                        @click="scope.pickFiles"
                        round
                        dense
                        flat
                      />
                    </div>
                  </template>
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
                          <img :src="file.__img.src" class="product-photo">
                        </q-item-section>
                        <q-item-section top side>
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
                <q-btn flat label="Cancel" color="negative" v-close-dialog />
                <q-btn flat class="bg-primary" type="submit" label="Add new" color="white" />
              </q-card-actions>
            </form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Products List -->
    <div class="row q-at-sm q-pb-xl">
      <div class="col-12">
        <q-table
          :data="products"
          :columns="columns"
          row-key="name"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-item class="q-pa-none">
                <q-item-section side>
                  <q-avatar v-if="props.row.photos.length > 1" rounded size="56px">
                    <img :src="props.row.photos[0].photo">
                  </q-avatar>
                  <q-avatar v-else color="primary" text-color="white" size="56px">
                    {{ props.row.name.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ props.row.name }}
                  </q-item-label>
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
  name: 'ProductsList',
  data: function () {
    return {
      options: [], // Category drop-down options
      newProd: false,
      newProduct: {
        name: '',
        category: null,
        price: null,
        description: ''
      },
      products: [],
      catalog: {},
      columns: [
        { name: 'name', label: 'PRODUCTS', field: 'name', align: 'left', sortable: true },
        { name: 'price', label: 'PRICE', field: 'price', align: 'left', sortable: true },
        { name: 'description', label: 'DESCRIPTION', field: 'description', align: 'left', sortable: false }
      ],
      nameError: {
        message: '',
        status: false
      },
      categoryError: {
        message: '',
        status: false
      },
      priceError: {
        message: '',
        status: false
      },
      descriptionError: {
        message: '',
        status: false
      },
      photosError: {
        message: '',
        status: false
      },
      alertPayload: {
        color: 'positive',
        textColor: 'white',
        icon: 'thumb_up',
        position: 'top',
        message: '',
        actions: [{ label: 'Dismiss', color: 'negative' }],
        classes: 'q-mt-xl',
        onDismiss: this.dismiss
      }
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getProductsList: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/p/products/'
      )
        .then(function (response) {
          self.products = response.data
        })
    },
    getProductsCatalog: function () {
      let self = this
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug
      )
        .then(function (response) {
          self.catalog = response.data
          for (let i = 0; i < response.data.categories.length; i++) {
            self.options.push({
              label: response.data.categories[i].name,
              value: response.data.categories[i].id
            })
          }
        })
    },
    addNewProduct: function () {
      let self = this

      let uploads = this.$refs.photoFiles.files
      let payload = new FormData()
      payload.append('name', self.newProduct.name)
      payload.append('category', self.newProduct.category.value)
      payload.append('price', self.newProduct.price)
      payload.append('description', self.newProduct.description)
      for (let i = 0; i < uploads.length; i++) {
        payload.append('photos', uploads[i])
      }

      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken(),
        'Content-Type': 'multipart/form'
      }
      self.$axios.post(
        'catalogs/' + this.$route.params.catalogSlug + '/p/products/',
        payload
      )
        .then(function (response) {
          if (response.status === 201) {
            self.alertPayload.message = 'New product added successfully!'
            self.showAlert(self.alertPayload)
            self.newProd = false
            self.clearNewProductModel()
          }
        })
        .catch(function (error) {
          if (error.response.data.name) {
            self.nameError.message = error.response.data.name[0]
            self.nameError.status = true
          }
          if (error.response.data.category) {
            self.categoryError.message = error.response.data.category[0]
            self.categoryError.status = true
          }
          if (error.response.data.price) {
            self.priceError.message = error.response.data.price[0]
            self.priceError.status = true
          }
          if (error.response.data.description) {
            self.descriptionError.message = error.response.data.description[0]
            self.descriptionError.status = true
          }
          if (error.response.data.photos) {
            self.photosError.message = error.response.data.photos[0]
            self.photosError.status = true
          }
        })
    },
    showAlert: function (payload) {
      const {
        color, textColor, message, icon,
        position, actions, classes, onDismiss
      } = payload

      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        actions,
        classes,
        onDismiss
      })
    },
    clearNewProductModel: function () {
      this.newProduct.name = ''
      this.newProduct.category = null
      this.newProduct.price = null
      this.newProduct.description = ''
    },
    dismiss: function () {
      this.getProductsList()
      this.getProductsCatalog()
    }
  },
  created: function () {
    this.getProductsList()
    this.getProductsCatalog()
  }
}
</script>

<style scoped>
.product-photo {
  width: 56px;
  height: 56px;
  border-radius: 5px;
}
.negative-border {
  border-bottom: 2px solid #c10015;
  margin: auto;
}
</style>