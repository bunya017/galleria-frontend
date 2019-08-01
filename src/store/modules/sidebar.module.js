export const sidebarModule = {
  state: {
    sidebarCatalogs: []
  },
  mutations: {
    addSidebarCatalogs (state, catalogs) {
      state.sidebarCatalogs = catalogs
    }
  },
  getters: {
    getSidebarCatalogs (state) {
      return state.sidebarCatalogs
    }
  },
  actions: {
    addSidebarCatalogsAction ({ commit }, catalogs) {
      commit('addSidebarCatalogs', catalogs)
    }
  }
}
