<template>
  <q-page class="q-pa-lg">
    <div class="text-h4">Dashboard</div>
    <div class="q-px-sm q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Dashboard" :to="{name:'my-catalogs'}" />
      </q-breadcrumbs>
    </div>

    <div class="row q-pt-lg q-pb-xl q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">Add new catlog</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ numberOfCatalogs }} Catalogs</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ numberOfProducts }} Products</div>
            <div class="text-subtitle2">across all catalogs</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card style="min-height: 100px;">
          <div class="text-center">
            <div class="text-h5">{{ activeCatalogs }} Active</div>
            <div class="text-subtitle2">Catalogs</div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="text-h5">My Catalogs</div>
    <div class="row q-pt-sm q-pb-xl q-col-gutter-md">
      <div class="col-12" v-for="catalog in catalogs" :key="catalog.id">
        <q-card>
          <q-list>
            <q-item clickable>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">V</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ catalog.name }}</q-item-label>
                <q-item-label caption>{{ catalog.description }}</q-item-label>
              </q-item-section>
              <q-item-section class="gt-xs">
                <q-item-label>{{ catalog.categories.length }} Categories</q-item-label>
              </q-item-section>
              <q-item-section side class="gt-xs">
                <q-badge color="green-10" text-color="white" label="active" />
              </q-item-section>
              <q-item-section top side>
                <q-btn size="12px" flat dense round icon="more_vert" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data: function () {
    return {
      numberOfCatalogs: 0,
      numberOfProducts: 0,
      activeCatalogs: 0,
      catalogs: {}
    }
  },
  methods: {
    getAuthToken: function () {
      return sessionStorage.getItem('authToken')
    },
    getCatalogs: function () {
      let self = this
      self.$axios.defaults.headers.common = {
        'Authorization': 'Token ' + self.getAuthToken()
      }
      self.$axios.get(
        'catalogs/'
      )
        .then(function (response) {
          self.catalogs = response.data
          self.numberOfCatalogs = response.data.length
        })
    }
  },
  created: function () {
    this.getCatalogs()
  }
}
</script>

<style>
</style>
