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

export function updateCatalogProductsAction ({ commit }, catalogSlug) {
  let products = []
  return axiosInstance.get(
    'catalogs/' + catalogSlug + '/products/'
  )
    .then(function (response) {
      if (response.status === 200) {
        for (var i = 0; i < response.data.length; i++) {
          products[i] = {
            label: response.data[i].name,
            slug: response.data[i].slug
          }
        }
        return commit('updateCatalogProducts', products)
      }
    })
}
