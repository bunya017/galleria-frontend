<template>
  <q-page>
    <div class="q-px-md-xl q-py-md-sm q-pa-sm" v-if="collListNotFound === false">
      <!-- Header -->
      <div class="text-h4 xs">Collections</div>
      <div class="text-h3 sm">Collections</div>
      <div class="text-h2 md">Collections</div>

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
          <q-breadcrumbs-el label="Collections" />
        </q-breadcrumbs>
      </div>

      <!-- Collection List -->
      <div class="row q-col-gutter-md q-pb-lg" v-if="collections">
        <div
          class="col-6 col-sm-4"
          v-for="collection in collections"
          :key="collection.id"
        >
          <router-link
            :to="{
              name: 'store-collection-detail',
              params: {
                catalogSlug: catalogSlug,
                collectionSlug: collection.slug
              }
            }"
          >
            <q-card style="width: 100%">
              <q-img
                :src="collection.background_image.small"
                class="my-card-image"
              >
                <div class="absolute-full flex flex-center">
                  <div class="my-text-head text-subtitle2 text-capitalize text-weight-thin text-center">
                    {{ collection.name }}
                  </div>
                </div>
              </q-img>
            </q-card>
          </router-link>
        </div>
      </div>
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
  name: 'StoreCollectionList',
  data () {
    return {
      catalogSlug: this.$route.params.catalogSlug,
      collections: [],
      collListNotFound: null
    }
  },
  methods: {
    getCollectionList: function () {
      let self = this
      self.$store.dispatch('navbar/updateIs404Action', false)
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collections = response.data
            self.$store.dispatch('navbar/updateIs404Action', false)
            self.collListNotFound = false
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            self.$store.dispatch('navbar/updateIs404Action', true)
            self.collListNotFound = true
          }
        })
    }
  },
  created () {
    this.getCollectionList()
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
