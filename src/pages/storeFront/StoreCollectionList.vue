<template>
  <q-page padding>
    <!-- Breadcrumbs -->
    <div class="q-pa-sm q-gutter-sm">
      <q-breadcrumbs
        separator="/"
        class="text-uppercase"
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

    <!-- Header -->
    <div class="text-h4 xs q-py-md">Collections</div>
    <div class="text-h3 sm q-py-md">Collections</div>
    <div class="text-h2 md q-py-md">Collections</div>

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
  </q-page>
</template>

<script>
export default {
  name: 'StoreCollectionList',
  data () {
    return {
      catalogSlug: this.$route.params.catalogSlug,
      collections: []
    }
  },
  methods: {
    getCollectionList: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/collections/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.collections = response.data
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
