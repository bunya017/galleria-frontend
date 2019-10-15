import { axiosInstance } from 'boot/axios'

export function updateCatalogAction ({ commit }, catalogSlug) {
  return axiosInstance.get(
    'catalogs/' + catalogSlug + '/'
  )
    .then(function (response) {
      if (response.status === 200) {
        return commit(
          'updateCatalog',
          {
            name: response.data.name,
            slug: response.data.slug,
            logo: response.data.background_image
          })
      }
    })
}
