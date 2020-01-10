import { axiosInstance } from 'boot/axios'

export function updateCatalogAction ({ commit, dispatch }, catalogSlug) {
  return axiosInstance.get(
    'catalogs/' + catalogSlug + '/'
  )
    .then(function (response) {
      if (response.status === 200) {
        if (response.data.logo_image.thumbnail) {
          dispatch('navbar/updateIsLoadingAction', false, { root: true })
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
          dispatch('navbar/updateIsLoadingAction', false, { root: true })
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

export function updateIsLoadingAction ({ commit }, loadingState) {
  return commit('updateIsLoading', loadingState)
}
