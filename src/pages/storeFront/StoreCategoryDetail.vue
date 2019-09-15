<template>
  <q-page>
    <!-- Category header -->
    <div class="col-12">
      <q-img
        :src="category.background_image.full_size"
        class="my-header-image"
      >
        <div class="absolute-full text-subtitle2 flex flex-center">
          <!-- Header -->
          <div class="text-h4 text-uppercase xs q-py-md">{{ category.name }}</div>
          <div class="text-h3 text-uppercase sm q-py-md">{{ category.name }}</div>
          <div class="text-h2 text-uppercase md q-py-md">{{ category.name }}</div>
        </div>
      </q-img>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'StoreCategoryDetail',
  data () {
    return {
      category: {},
      products: []
    }
  },
  methods: {
    getCategoryDetail: function () {
      let self = this
      self.$axios.get(
        'catalogs/' + self.$route.params.catalogSlug + '/categories/' + self.$route.params.categorySlug + '/'
      )
        .then(function (response) {
          if (response.status === 200) {
            self.category = response.data
            self.products = response.data.product_entries
          }
        })
    }
  },
  created () {
    this.getCategoryDetail()
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
  @media (max-width: 599px) {
    .my-header-image {
      height: 45vw;
    }
  }
  @media (max-width: 860px) {
    .my-header-image {
      height: 35vw;
    }
  }
  @media (max-width: 999px) {
    .my-header-image {
      height: 25vw;
    }
  }
  @media (min-width: 1000px) {
    .my-header-image {
      height: 20vw;
    }
  }
</style>
