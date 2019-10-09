export function updateCatalog (state, payload) {
  state.catalog.name = payload.name
  state.catalog.slug = payload.slug
}
