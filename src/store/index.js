import Vue from 'vue'
import Vuex from 'vuex'
import storeNavbar from './storeNavbar'
import dashboardStore from './dashboardStore'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      navbar: storeNavbar,
      dashStore: dashboardStore
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
