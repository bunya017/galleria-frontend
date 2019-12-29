<template>
  <q-page padding>
    <div v-if="prodListNotFound === false">
      <div class="text-h4">Products List</div>
      <!-- Breadcrumbs -->
      <div class="q-pa-sm q-gutter-sm">
        <q-breadcrumbs separator="/" class="text-uppercase breadcrumbs-text" gutter="xs">
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

      <!-- New product dialog -->
      <q-dialog v-model="newProd" @hide="clearNewProductModel" position="top" no-backdrop-dismiss>
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
                        <q-btn v-if="scope.canAddFiles" icon="add_box" round dense flat>
                          <q-uploader-add-trigger />
                        </q-btn>
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
                  <q-btn flat label="Cancel" color="negative" v-close-popup />
                  <q-btn flat type="submit" label="Add new" color="primary" />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Products List -->
      <div class="row q-py-md-md q-py-sm-sm q-px-sm">
        <div class="col-12">
          <q-table
            :data="products"
            :columns="columns"
            row-key="name"
            :pagination.sync="pagination"
            :filter="filter"
            binary-state-sort
            :grid="$q.screen.lt.sm"
            :hide-bottom="$q.screen.lt.sm"
            no-data-label="You do not have product entries on this catalog"
          >
            <template v-slot:top>
              <q-input dense label='Search' class="col-sm-6 col-xs-12" v-model="filter" debounce="300" color="primary">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-space />
              <q-btn flat color="white" class="bg-primary q-mt-xs-md gt-xs" label="add new product" @click="newProd = true" />
            </template>
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-item
                  clickable
                  v-ripple
                  :to="{
                    name: 'product-detail',
                    params: {
                      catalogSlug: slugCatalog,
                      referenceId: props.row.reference_id,
                      productSlug: props.row.slug
                    }
                  }"
                  class="q-pa-none"
                >
                  <q-item-section side>
                    <q-avatar v-if="props.row.photos.length > 0" rounded size="56px">
                      <img :src="props.row.photos[0].photo.thumbnail">
                    </q-avatar>
                    <q-avatar v-else color="primary" text-color="white" size="56px">
                      {{ props.row.name.charAt(0).toUpperCase() }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ props.row.name }}</q-item-label>
                    <q-item-label caption lines="2">{{ props.row.description }}</q-item-label>
                    <q-item-label class="q-pt-sm xs text-weight-bold">₦{{ props.row.price }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td auto-width :props="props">
                <q-btn size="12px" flat dense round icon="more_vert">
                  <q-menu auto-close>
                    <q-list style="width: 200px;">
                      <q-item clickable @click="makeEditProductPayload(props.row)">
                        <q-item-section avatar>
                          <q-avatar rounded icon="edit" />
                        </q-item-section>
                        <q-item-section>
                          Edit
                        </q-item-section>
                      </q-item>
                      <q-item clickable @click="makeDeleteProductPayload(props.row)">
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
              </q-td>
            </template>
            <template v-slot:item="props">
              <div
                class="q-py-xs col-12 grid-style-transition"
                :style="props.selected ? 'transform: scale(0.95);' : ''"
              >
                <q-card :class="props.selected ? 'bg-grey-2' : ''">
                  <q-item class="q-pa-sm">
                    <q-item-section side>
                      <q-avatar v-if="props.row.photos.length > 0" rounded size="56px">
                        <img :src="props.row.photos[0].photo.thumbnail">
                      </q-avatar>
                      <q-avatar v-else color="primary" text-color="white" size="56px">
                        {{ props.row.name.charAt(0).toUpperCase() }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <router-link
                        :to="{
                          name: 'product-detail',
                          params: {
                            catalogSlug: slugCatalog,
                            referenceId: props.row.reference_id,
                            productSlug: props.row.slug
                          }
                        }"
                      >
                        <q-item-label>{{ props.row.name }}</q-item-label>
                        <q-item-label caption>{{ props.row.description }}</q-item-label>
                        <q-item-label class="q-pt-xs xs text-weight-bold">
                          ₦{{ props.row.price }}
                        </q-item-label>
                      </router-link>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn size="12px" flat dense round icon="more_vert">
                        <q-menu auto-close>
                          <q-list style="width: 200px;">
                            <q-item clickable @click="makeEditProductPayload(props.row)">
                              <q-item-section avatar>
                                <q-avatar rounded icon="edit" />
                              </q-item-section>
                              <q-item-section>
                                Edit
                              </q-item-section>
                            </q-item>
                            <q-item clickable @click="makeDeleteProductPayload(props.row)">
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
                </q-card>
              </div>
            </template>
          </q-table>
        </div>
      </div>

      <!-- Delete product dialog -->
      <q-dialog v-model="deleteProd" @hide="clearDeleteProductPayload" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6 text-center">Confirm Permanent Delete?</div>
          </q-card-section>
          <q-card-section class="row items-center">
            <span class="q-py-xs text-center">
              You are about to delete <strong class="text-negative">{{ deleteProductPayload.name }}</strong> including all its data and photos (if any). Enter the name of this product in the box below to confirm deletion of this product. Please note that this is not <strong>not reversible.</strong>
            </span>
            <div class="fit q-pt-lg">
              Confirm Product Name:
              <q-input
                dense
                outlined
                type="text"
                v-model="confirmDeletePayload"
                :placeholder="deleteProductPayload.name"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn outline label="Cancel" color="grey-7" v-close-popup />
            <q-btn label="Delete" :disabled="confirmDeletePayload !== deleteProductPayload.name" color="negative" @click="deleteProduct" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit product dialog -->
      <q-dialog v-model="editProd" @hide="clearEditProductPayload" position="top" no-backdrop-dismiss>
        <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
          <q-card-section class="q-py-sm">
            <div class="text-h5">Edit Product</div>
            <div class="text-subtitle2">Edit product details</div>
          </q-card-section>
          <q-card-section class="q-px-sm q-py-lg">
            <div class="q-px-md" v-if="editProductPayload.category">
              <form v-on:submit.prevent.stop="editProduct">
                <q-input
                  lazy-rules
                  auto-focus
                  label="Name"
                  type="text"
                  v-model="editProductPayload.name"
                />
                <q-select
                  lazy-rules
                  :options="options"
                  label="Category"
                  v-model="options[editProductPayload.category.id - 1].label"
                />
                <q-input
                  lazy-rules
                  auto-focus
                  label="Price"
                  type="number"
                  v-model="editProductPayload.price"
                />
                <q-input
                  lazy-rules
                  auto-focus
                  label="Description"
                  type="text"
                  v-model="editProductPayload.description"
                />
                <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                  <q-btn flat label="Cancel" color="primary" v-close-popup />
                  <q-btn flat label="Edit" color="primary" type="submit" />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Floating button -->
      <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
        <q-btn fab icon="add" color="primary" @click="newProd = true" />
      </q-page-sticky>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="prodListNotFound === true">
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
  name: 'ProductsList',
  data: function () {
    return {
      prodListNotFound: null,
      slugCatalog: this.$route.params.catalogSlug,
      options: [], // Category drop-down options
      pagination: {
        sortBy: 'name',
        rowsPerPage: 10
      },
      filter: '',
      newProd: false,
      deleteProd: false,
      confirmDeletePayload: '',
      editProd: false,
      deleteProductPayload: {
        name: '',
        category: null,
        price: null,
        description: '',
        url: ''
      },
      editProductPayload: {
        name: '',
        category: null,
        price: null,
        description: '',
        url: ''
      },
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
        { name: 'actions', label: '', align: 'left' }
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
        color: 'green-1',
        textColor: 'positive',
        icon: 'check_circle',
        position: 'top',
        message: '',
        classes: 'q-mt-xl'
      }
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getProductsList: function () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/products/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.products = response.data
            self.prodListNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.prodListNotFound = true
            self.$q.loading.hide()
          }
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
        'catalogs/' + this.$route.params.catalogSlug + '/products/',
        payload
      )
        .then(function (response) {
          if (response.status === 201) {
            self.alertPayload.message = 'New product added successfully!'
            self.showAlert(self.alertPayload)
            self.newProd = false
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
    clearNewProductModel: function () {
      this.newProduct.name = ''
      this.newProduct.category = null
      this.newProduct.price = null
      this.newProduct.description = ''
    },
    makeDeleteProductPayload: function (payload) {
      this.deleteProd = true
      this.deleteProductPayload.name = payload.name
      this.deleteProductPayload.description = payload.description
      this.deleteProductPayload.category = payload.category
      this.deleteProductPayload.price = payload.price
      this.deleteProductPayload.url = process.env.PROD
        ? payload.url.replace('http://', 'https://') : payload.url
    },
    makeEditProductPayload: function (payload) {
      this.editProd = true
      this.editProductPayload.name = payload.name
      this.editProductPayload.description = payload.description
      this.editProductPayload.category = payload.category
      this.editProductPayload.price = payload.price
      this.editProductPayload.url = process.env.PROD
        ? payload.url.replace('http://', 'https://') : payload.url
    },
    clearDeleteProductPayload: function () {
      this.deleteProductPayload.name = ''
      this.deleteProductPayload.category = null
      this.deleteProductPayload.price = null
      this.deleteProductPayload.description = ''
      this.deleteProductPayload.url = ''
      this.confirmDeletePayload = ''
    },
    clearEditProductPayload: function () {
      this.editProductPayload.name = ''
      this.editProductPayload.category = null
      this.editProductPayload.price = null
      this.editProductPayload.description = ''
      this.editProductPayload.url = ''
    },
    deleteProduct: function () {
      let self = this

      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken(),
        'Content-Type': 'multipart/form'
      }
      self.$axios.delete(
        self.deleteProductPayload.url
      )
        .then(function (response) {
          if (response.status === 204) {
            self.getProductsList()
            self.getProductsCatalog()
            self.alertPayload.message = 'Edited successfully!'
            self.showAlert(self.alertPayload)
            self.deleteProd = false
          }
        })
    },
    editProduct: function () {
      let self = this
      let payload = {}
      payload.name = self.editProductPayload.name
      payload.category = self.editProductPayload.category.id
      payload.price = self.editProductPayload.price
      payload.description = self.editProductPayload.description

      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken(),
        'Content-Type': 'multipart/form'
      }
      self.$axios.put(
        self.editProductPayload.url,
        payload
      )
        .then(function (response) {
          if (response.status === 200) {
            self.getProductsList()
            self.getProductsCatalog()
            self.alertPayload.message = 'Edited successfully!'
            self.showAlert(self.alertPayload)
            self.editProd = false
          }
        })
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

a {
  text-decoration: none;
  color: inherit;
}
</style>
