<template>
  <q-page padding>
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
                <div class="text-h5 text-black">Collections</div>
                <div class="text-subtitle2 text-black">(Click to view)</div>
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
                <div class="text-h5 text-black">{{ productCount }} Products</div>
                <div class="text-subtitle2 text-black">(Click to view)</div>
              </div>
            </div>
          </q-card>
        </router-link>
      </div>
    </div>

    <!-- New category modal/dialog -->
    <q-dialog v-model="newCat" position="top" no-backdrop-dismiss>
      <q-card class="q-mt-lg" style="width: 600px; max-width: 80vw;">
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
                <q-btn flat label="Cancel" color="grey-8" v-close-popup />
                <q-btn flat type="submit" label="Add new" color="primary"  />
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
                  <q-item-label class="text-black">{{ category.name }}</q-item-label>
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
    <q-dialog v-model="deleteCaty" @hide="clearDeleteCategoryPayload" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-md q-py-md text-center">
            Are you sure you want to delete <span class="text-weight-bold">{{ deleteCategoryPayload.name }}</span> category permanently?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteCategory" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Floating Button -->
    <q-page-sticky class="lt-sm" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary" @click="newCat = true" />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'CatalogDetail',
  data: function () {
    return {
      isError: true,
      productCount: 0,
      activeProducts: 0,
      newCat: false,
      catalog: {},
      deleteCaty: false,
      deleteCategorySlug: '',
      newCategory: {
        name: '',
        description: '',
        catalog: null
      },
      deleteCategoryPayload: {
        name: '',
        description: '',
        catalog: null
      },
      alertPayload: {
        color: 'positive',
        textColor: 'white',
        icon: 'thumb_up',
        position: 'top',
        message: '',
        closeBtn: 'Close',
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
      self.$refs.name.validate()
      self.$refs.description.validate()

      if (self.$refs.name.hasError || self.$refs.description.hasError) {
        self.formHasError = true
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
              self.clearNewCategoryModel()
            }
          })
          .catch(function (error) {
            if (error.response.data.non_field_errors) {
              self.nameError.message = 'Oops! This category already exists in this catalog.'
              self.nameError.status = true
            }
          })
      }
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
    },
    deleteCategory: function () {
      let self = this
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
            self.deleteCaty = false
          }
        })
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
}
.bg-image {
  max-height: 56px;
  width: auto;
  border-radius: 5px;
}
</style>
