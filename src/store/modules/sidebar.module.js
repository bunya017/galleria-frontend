export const sidebarModule = {
  state: {
    sidebarCatalogs: []
  },
  mutations: {
    addSidebarCatalogs (state, catalogList) {
      state.sidebarCatalogs = catalogList
    }
  },
  getters: {
    getSidebarCatalogs (state) {
      return state.sidebarCatalogs
    }
  },
  actions: {}
}