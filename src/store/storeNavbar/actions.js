import { axiosInstance } from 'boot/axios'

export function updateCatalogAction ({ commit }, catalogSlug) {
  return axiosInstance.get(
    'catalogs/' + catalogSlug + '/'
  )
    .then(function (response) {
      if (response.status === 200) {
        if (response.data.logo_image.thumbnail) {
          return commit(
            'updateCatalog',
            {
              name: response.data.name,
              slug: response.data.slug,
              logo: response.data.logo_image,
              contact_phone: response.data.contact_phone,
              contact_email: response.data.contact_email,
              contact_address: response.data.contact_address,
              backgroundImage: response.data.background_image
            })
        } else {
          return commit(
            'updateCatalog',
            {
              name: response.data.name,
              slug: response.data.slug,
              logo: response.data.background_image,
              backgroundImage: response.data.background_image
            })
        }
      }
    })
}

export function updateIs404Action ({ commit }, errorState) {
  return commit('updateIs404', errorState)
}
