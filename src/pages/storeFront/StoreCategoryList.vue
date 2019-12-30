<template>
  <q-page>
    <div class="q-px-md-xl q-py-md-sm q-pa-sm" v-if="catListNotFound === false">
      <!-- Header -->
      <div class="text-h4 xs">Categories</div>
      <div class="text-h3 sm">Categories</div>
      <div class="text-h2 md">Categories</div>

      <!-- Breadcrumbs -->
      <div class="q-pa-sm q-pa-sm-md q-gutter-sm">
        <q-breadcrumbs
          separator="/"
          class="text-uppercase breadcrumbs-text"
          gutter="xs"
        >
          <q-breadcrumbs-el
            label="Store"
            :to="{
              name: 'store-home',
              params: {
                slug: this.$route.params.catalogSlug
              }
            }"
          />
          <q-breadcrumbs-el label="Categories" />
        </q-breadcrumbs>
      </div>

      <!-- Category List -->
      <div class="row q-col-gutter-md q-pb-lg" v-if="categories">
        <div
          class="col-6 col-sm-4"
          v-for="category in categories"
          :key="category.id"
        >
          <router-link
            :to="{
              name: 'store-category-detail',
              params: {
                catalogSlug: catalogSlug,
                categorySlug: category.slug
              }
            }"
          >
            <q-card style="width: 100%">
              <q-img
                :src="category.background_image.small"
                class="my-card-image"
              >
                <div class="absolute-full flex flex-center">
                  <div class="my-text-head text-subtitle2 text-capitalize text-weight-thin text-center">
                    {{ category.name }}
                  </div>
                </div>
              </q-img>
            </q-card>
          </router-link>
        </div>
      </div>
    </div>
    <div class="row jutify-center text-center" style="padding-top: 25vh;" v-if="catListNotFound === true">
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
  name: 'StoreCategoryList',
  data () {
    return {
      catalogSlug: this.$route.params.catalogSlug,
      categories: [],
      catListNotFound: null
    }
  },
  methods: {
    getCategoryList: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/categories/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.categories = response.data
            self.catListNotFound = false
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.catListNotFound = true
          }
        })
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>

<style scoped>
  @media (max-width: 599px) {
    .my-text-head {
      font-size: 5vw;
      line-height: 4.5vw;
    }
    .my-card-image {
      height: 25vw;
    }
  }
  @media (min-width: 600px) {
    .my-text-head {
      font-size: 4vw;
      line-height: 3.5vw;
    }
    .my-card-image {
      height: 20vw;
    }
  }
</style>
