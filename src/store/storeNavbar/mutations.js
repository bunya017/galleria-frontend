export function updateCatalog (state, payload) {
  state.catalog.name = payload.name
  state.catalog.slug = payload.slug
  state.catalog.logo = payload.logo
  state.catalog.contactEmail = payload.contact_email
  state.catalog.contactPhone = payload.contact_phone
  state.catalog.contactAddress = payload.contact_address
  state.catalog.backgroundImage = payload.backgroundImage
}
