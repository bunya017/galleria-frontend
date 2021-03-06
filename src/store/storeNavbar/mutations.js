export function updateCatalog (state, payload) {
  state.catalog.name = payload.name
  state.catalog.slug = payload.slug
  state.catalog.logo = payload.logo
  state.catalog.contactEmail = payload.contact_email
  state.catalog.contactPhone = payload.contact_phone
  state.catalog.contactAddress = payload.contact_address
  state.catalog.backgroundImage = payload.backgroundImage
}

export function updateIs404 (state, payload) {
  state.is404 = payload
}

export function updateIsLoading (state, payload) {
  state.isLoading = payload
}
