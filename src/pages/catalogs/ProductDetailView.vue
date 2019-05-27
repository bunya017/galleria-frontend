<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
export default {
  name: 'ProductDetailView',
  data: function () {
    return {
      product: {}
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
