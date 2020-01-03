<template padding>
  <div class="row jutify-center text-center" style="padding-top: 25vh;">
    <div class="col-12 q-px-md">
      <div class="text-h2 q-pb-lg">404</div>
      <p class="text-body1">We can't seem to find the page you're looking for.</p>
      <div class="q-gutter-sm q-py-sm">
        <q-btn
          color="primary"
          label="Go back"
          @click="handleBack"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  meta () {
    return {
      title: '404',
      titleTemplate: title => `${title} - Galleria`
    }
  },
  methods: {
    handleBack () {
      if (this.loggedInStatus === true) {
        return this.$router.back() || this.$router.push('my-catalogs')
      } else {
        return this.$router.back() || this.$router.push('/')
      }
    }
  },
  computed: {
    loggedInStatus () {
      return this.$store.state.dashStore.isLoggedIn
    }
  }
}
</script>
