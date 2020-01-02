<template>
  <q-page padding>
    <div v-if="catalogNotFound === false">
      <!-- Title -->
      <div class="row items-center q-pt-sm q-pb-none">
        <div class="text-h4 col-12 col-sm-6">{{ catalog.name }}</div>
        <div class="col-12 col-sm-6 gt-xs">
          <q-btn
            class="bg-primary float-right"
            flat
            color="white"
            icon="add"
            label="New Category"
            @click="newCat = true"
          />
        </div>
      </div>

      <!-- Breadcrumbs -->
      <div class="q-px-sm q-gutter-sm">
        <q-breadcrumbs separator="/" class="text-uppercase breadcrumbs-text" gutter="xs">
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
        <div class="col-6 col-md-3">
          <router-link
            v-if="catalog.slug"
            :to="{
              name: 'collection-list',
              params: {
                catalogSlug: catalog.slug
              }
            }"
          >
            <q-card>
              <div class="row justify-center items-center" style="min-height: 100px;">
                <div class="text-center">
                  <div class="text-h5">Collections</div>
                  <div class="text-subtitle2">(Click to view)</div>
                </div>
              </div>
            </q-card>
          </router-link>
        </div>
        <div class="col-6 col-md-3">
          <router-link
            v-if="catalog.slug"
            :to="{
              name: 'products-list',
              params: {
                catalogSlug: catalog.slug
              }
            }"
          >
            <q-card>
              <div class="row justify-center items-center" style="min-height: 100px;">
                <div class="text-center">
                  <div class="text-h5">{{ productCount }} Products</div>
                  <div class="text-subtitle2">(Click to view)</div>
                </div>
              </div>
            </q-card>
          </router-link>
        </div>
        <div class="col-6 col-md-3">
          <router-link
            v-if="catalog.slug"
            :to="{
              name: 'store-home',
              params: {
                catalogSlug: catalog.slug
              }
            }"
            target="_blank"
          >
            <q-card>
              <div class="row justify-center items-center" style="min-height: 100px;">
                <div class="text-center">
                  <div class="text-h5">
                    Visit Site <q-icon name="launch" color="primary" />
                  </div>
                </div>
              </div>
            </q-card>
          </router-link>
        </div>
        <!-- Edit Catalog Info-->
        <div class="col-6 col-md-3">
          <q-card @click="makeEditCatalogPayload">
            <div class="row justify-center items-center cursor-pointer" style="min-height: 100px;">
              <div class="text-center">
                <div class="text-h5">
                  <q-icon name="edit" color="primary" /> Edit Details
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <!-- Edit catalog dialog -->
      <q-dialog v-model="catalogEdit" @hide="clearEditCatalogPayload" position="top" no-backdrop-dismiss>
        <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
          <q-card-section class="q-py-md">
            <div class="text-h5">Edit Catalog</div>
            <div class="text-subtitle2">Edit catalog details</div>
          </q-card-section>
          <q-card-section class="q-px-sm q-py-lg">
            <div class="q-px-md">
              <form v-on:submit.prevent.stop="editCatalog">
                <q-input
                  dense
                  auto-focus
                  lazy-rules
                  type="text"
                  label="Name"
                  v-model="editCatalogPayload.name"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  dense
                  lazy-rules
                  type="text"
                  label="Description"
                  v-model="editCatalogPayload.description"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  dense
                  lazy-rules
                  type="text"
                  label="Shop address"
                  v-model="editCatalogPayload.contact_address"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  dense
                  lazy-rules
                  type="email"
                  label="Contact email"
                  v-model="editCatalogPayload.contact_email"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  dense
                  lazy-rules
                  type="text"
                  label="Contact phone"
                  v-model="editCatalogPayload.contact_phone"
                  :rules="[val => !!val || 'Field is required']"
                />
                <image-input
                  class="q-pb-md"
                  ref="editCatalogLogoImage"
                  label="Logo image (Change the current logo image)"
                  color="white"
                  textColor="grey-8"
                  accept=".jpg, image/*"
                />
                <image-input
                  ref="editCatalogBgImage"
                  label="Background image (Change the background image)"
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
                    label="Edit Catalog"
                    type="submit"
                    color="primary"
                    :loading="editCatalogButtonLoading"
                    :disabled="editCatalogButtonLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- New category modal/dialog -->
      <q-dialog v-model="newCat" position="top" no-backdrop-dismiss>
        <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
          <q-card-section class="text-center">
            <div class="text-h5">New Category</div>
            <div class="text-subtitle2">Add new product category</div>
          </q-card-section>

          <q-card-section class="q-pt-xl">
            <div class="q-pa-md">
              <form v-on:submit.prevent.stop="addNewCategory">
                <div class="q-gutter-y-sm">
                  <q-input
                    ref="name"
                    dense
                    autofocus
                    type="text"
                    label="Name"
                    bottom-slots
                    :error="nameError.status"
                    v-model="newCategory.name"
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
                    v-model="newCategory.description"
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
                      accept=".jpg, image/*"
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
                </div>
                <q-card-actions align="right" class="q-gutter-x-md q-pt-lg">
                  <q-btn
                    flat
                    label="Cancel"
                    color="grey-8"
                    v-close-popup
                  />
                  <q-btn
                    type="submit"
                    label="Add new"
                    color="primary"
                    :disabled="newCategoryButtonLoading"
                    :loading="newCategoryButtonLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Categories List -->
      <div class="text-h5">Categories</div>
      <div class="row q-pt-sm q-pb-xl q-col-gutter-md">
        <div class="col-12" v-for="category in catalog.categories" :key="category.name">
          <q-card>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-if="category.background_image.thumbnail" size="56px">
                    <img :src="category.background_image.thumbnail">
                  </q-avatar>
                  <q-avatar v-else color="primary" size="56px" text-color="white">
                    {{ getFirstLetters(category.name) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <router-link
                    :to="{
                      name: 'category-detail',
                      params: {
                        catalogSlug: catalog.slug,
                        categorySlug: category.slug
                      }
                    }"
                  >
                    <q-item-label>{{ category.name }}</q-item-label>
                    <q-item-label caption>{{ category.description }}</q-item-label>
                  </router-link>
                </q-item-section>
                <q-item-section side>
                  <q-btn size="12px" flat dense round icon="more_vert">
                    <q-menu auto-close>
                      <q-list style="width: 200px;">
                        <q-item clickable @click="makeDeleteCategoryPayload(category)">
                          <q-item-section avatar>
                            <q-avatar rounded icon="delete" />
                          </q-item-section>
                          <q-item-section>
                            Delete
                          </q-item-section>
                        </q-item>
                        <q-item clickable @click="makeEditCategoryPayload(category)">
                          <q-item-section avatar>
                            <q-avatar rounded icon="edit" />
                          </q-item-section>
                          <q-item-section>
                            Edit
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

      <!-- Edit category dialog -->
      <q-dialog v-model="categoryEdit" position="top" no-backdrop-dismiss>
        <q-card class="q-mt-lg" style="width: 600px; max-width: 95vw;">
          <q-card-section class="q-py-md">
            <div class="text-h5">Edit Category</div>
            <div class="text-subtitle2">Edit category details</div>
          </q-card-section>
          <q-card-section class="q-px-sm q-py-lg">
            <div class="q-px-md">
              <form>
                <q-input
                  dense
                  auto-focus
                  lazy-rules
                  type="text"
                  label="Name"
                  v-model="editCategoryPayload.name"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  dense
                  lazy-rules
                  type="text"
                  label="Description"
                  v-model="editCategoryPayload.description"
                  :rules="[val => !!val || 'Field is required']"
                />
                <image-input
                  ref="editCategoryBgImage"
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
                    label="Edit Category"
                    type="submit"
                    color="primary"
                    :loading="editCategoryButtonLoading"
                    :disabled="editCategoryButtonLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Delete category dialog -->
      <q-dialog v-model="deleteCaty" @hide="clearDeleteCategoryPayload" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6 text-center">Confirm Permanent Delete?</div>
          </q-card-section>
          <q-card-section class="row items-center">
            <span class="q-py-xs text-center">
              You are about to delete <strong class="text-negative">{{ deleteCategoryPayload.name }}</strong> including all its product data and photos (if any). Enter the name of this category in the box below to confirm deletion of this category. Please note that this is not <strong>not reversible.</strong>
            </span>
            <div class="fit q-pt-lg">
              Confirm Category Name:
              <q-input
                dense
                outlined
                type="text"
                v-model="confirmDeletePayload"
                :placeholder="deleteCategoryPayload.name"
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
              @click="deleteCategory"
              :loading='deleteCategoryButtonLoading'
              :disabled="(confirmDeletePayload !== deleteCategoryPayload.name) || deleteCategoryButtonLoading"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Floating Button -->
      <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
        <q-btn fab icon="add" color="primary" @click="newCat = true" />
      </q-page-sticky>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="catalogNotFound === true">
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
  name: 'CatalogDetail',
  data: function () {
    return {
      newCategoryButtonLoading: false,
      deleteCategoryButtonLoading: false,
      editCatalogButtonLoading: false,
      editCategoryButtonLoading: false,
      catalogNotFound: null,
      productCount: 0,
      activeProducts: 0,
      newCat: false,
      catalogEdit: false,
      categoryEdit: false,
      catalog: {},
      deleteCaty: false,
      confirmDeletePayload: '',
      deleteCategorySlug: '',
      editCatalogPayload: {
        name: '',
        description: '',
        contact_address: '',
        contact_email: '',
        contact_phone: '',
        url: ''
      },
      newCategory: {
        name: '',
        description: '',
        catalog: null
      },
      editCategoryPayload: {
        name: '',
        description: '',
        catalog: null,
        slug: ''
      },
      deleteCategoryPayload: {
        name: '',
        description: '',
        catalog: null
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
      }
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCatalogDetail: function () {
      let self = this
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/' + self.$route.params.slug
      )
        .then(function (response) {
          if (response.status === 200) {
            self.catalog = response.data
            self.productCount = self.getProductCount(response.data.categories)
            self.catalogNotFound = false
            self.$q.loading.hide()
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.catalogNotFound = true
            self.$q.loading.hide()
          }
        })
    },
    getProductCount: function (payload) {
      let productsAmount = 0
      for (let i = 0; i < payload.length; i++) {
        productsAmount += payload[i].product_entries.length
      }
      return productsAmount
    },
    getFirstLetters: function (payload) {
      let wordsList = payload.split(' ')
      if (!!wordsList[1] === true) {
        return wordsList[0].charAt(0).toUpperCase() + wordsList[1].charAt(0)
      } else {
        return wordsList[0].charAt(0).toUpperCase()
      }
    },
    addNewCategory: function () {
      let self = this
      self.newCategoryButtonLoading = true
      self.$refs.name.validate()
      self.$refs.description.validate()

      if (self.$refs.name.hasError || self.$refs.description.hasError) {
        self.formHasError = true
        self.newCategoryButtonLoading = false
      } else {
        self.newCategory.catalog = self.catalog.id
        let payload = new FormData()
        payload.append('name', self.newCategory.name)
        payload.append('catalog', self.newCategory.catalog)
        payload.append('description', self.newCategory.description)
        if (this.$refs.bgImageFile.files.length > 0) {
          payload.append('background_image', this.$refs.bgImageFile.files[0])
        }
        this.$axios.defaults.headers.common = {
          'Authorization': 'Token ' + self.getAuthToken(),
          'Content-Type': 'multipart/form'
        }
        self.$axios.post(
          'catalogs/' + self.catalog.slug + '/categories/',
          payload
        )
          .then(function (response) {
            if (response.status === 201) {
              self.alertPayload.message = 'Category added successfully!'
              self.getCatalogDetail()
              self.showAlert(self.alertPayload)
              self.newCat = false
              self.newCategoryButtonLoading = false
              self.clearNewCategoryModel()
            }
          })
          .catch(function (error) {
            if (error.response.data.non_field_errors) {
              self.nameError.message = 'Oops! This category already exists in this catalog.'
              self.nameError.status = true
              self.newCategoryButtonLoading = false
            }
          })
      }
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
    clearNewCategoryModel: function () {
      this.newCategory.name = ''
      this.newCategory.description = ''
      this.newCategory.catalog = null
    },
    makeDeleteCategoryPayload: function (payload) {
      this.deleteCaty = true
      this.deleteCategoryPayload.name = payload.name
      this.deleteCategoryPayload.description = payload.description
      this.deleteCategoryPayload.catalog = payload.catalog
      this.deleteCategorySlug = payload.slug
    },
    clearDeleteCategoryPayload: function () {
      this.deleteCategoryPayload.name = ''
      this.deleteCategoryPayload.description = ''
      this.deleteCategoryPayload.catalog = null
      this.confirmDeletePayload = ''
    },
    deleteCategory: function () {
      let self = this
      self.deleteCategoryButtonLoading = true
      self.newCategory.catalog = self.catalog.id
      this.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.delete(
        'catalogs/' + self.catalog.slug + '/categories/' + self.deleteCategorySlug + '/',
        self.deleteCategoryPayload
      )
        .then(function (response) {
          if (response.status === 204) {
            self.getCatalogDetail()
            self.alertPayload.message = 'Category deleted successfully!'
            self.showAlert(self.alertPayload)
            self.deleteCategoryButtonLoading = false
            self.deleteCaty = false
          }
        })
    },
    makeEditCatalogPayload: function () {
      this.catalogEdit = true
      this.editCatalogPayload.name = this.catalog.name
      this.editCatalogPayload.description = this.catalog.description
      this.editCatalogPayload.contact_address = this.catalog.contact_address
      this.editCatalogPayload.contact_email = this.catalog.contact_email
      this.editCatalogPayload.contact_phone = this.catalog.contact_phone
      this.editCatalogPayload.url = process.env.PROD
        ? this.catalog.url.replace('http://', 'https://') : this.catalog.url
    },
    clearEditCatalogPayload: function () {
      this.editCatalogPayload.name = ''
      this.editCatalogPayload.description = ''
      this.editCatalogPayload.contact_address = ''
      this.editCatalogPayload.contact_email = ''
      this.editCatalogPayload.contact_phone = ''
      this.editCatalogPayload.url = ''
    },
    editCatalog () {
      let self = this
      self.editCatalogButtonLoading = true
      let payload = new FormData()
      payload.append('name', self.editCatalogPayload.name)
      payload.append('description', self.editCatalogPayload.description)
      payload.append('contact_address', self.editCatalogPayload.contact_address)
      payload.append('contact_email', self.editCatalogPayload.contact_email)
      payload.append('contact_phone', self.editCatalogPayload.contact_phone)
      if (self.$refs.editCatalogBgImage.files.length > 0) {
        payload.append('background_image', self.$refs.editCatalogBgImage.files[0])
      }
      if (self.$refs.editCatalogLogoImage.files.length > 0) {
        payload.append('logo_image', self.$refs.editCatalogLogoImage.files[0])
      }

      self.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken(),
        'Content-Type': 'multipart/form'
      }
      self.$axios.patch(
        self.editCatalogPayload.url,
        payload
      )
        .then(function (response) {
          if (response.status === 200) {
            self.getCatalogDetail()
            self.alertPayload.message = 'Edited successfully!'
            self.editCatalogButtonLoading = false
            self.catalogEdit = false
            self.showAlert(self.alertPayload)
          }
        })
    },
    makeEditCategoryPayload: function (payload) {
      this.categoryEdit = true
      this.editCategoryPayload.name = payload.name
      this.editCategoryPayload.description = payload.description
      this.editCategoryPayload.catalog = payload.catalog
      this.editCategoryPayload.slug = payload.slug
    }
  },
  created: function () {
    this.getCatalogDetail()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
.bg-image {
  max-height: 56px;
  width: auto;
  border-radius: 5px;
}
</style>
