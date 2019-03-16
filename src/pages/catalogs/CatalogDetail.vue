<template>
  <q-page padding>
    <div class="text-h4">My Catalog</div>
    <div class="q-px-sm q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
        <q-breadcrumbs-el
          label="Dashboard"
          separator=">"
          :to="{
            name:'my-catalogs',
            params: {
              slug: this.$route.params.slug
            }
          }"
        />
      </q-breadcrumbs>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CatalogDetail',
  data: function () {
    return {
      catalog: {}
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    }
  }
}
</script>

<style>
</style>
