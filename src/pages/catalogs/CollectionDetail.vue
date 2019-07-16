<template>
  <q-page padding>
    <div class="text-h4 col-12 col-sm-6">Collection Detail</div>
  </q-page>
</template>

<script>
export default {
  name: 'CollectionDetail',
  data: function () {
    return {
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
