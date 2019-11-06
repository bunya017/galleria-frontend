export function updateCatalog (state, payload) {
  state.catalog.name = payload.name
  state.catalog.slug = payload.slug
  state.catalog.logo = payload.logo
  state.catalog.backgroundImage = payload.backgroundImage
}
