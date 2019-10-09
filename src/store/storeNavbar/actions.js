import axios from 'axios'

export function updateCatalogAction ({ commit }, catalogSlug) {
  return axios.get(
    'http://localhost:8000/api/catalogs/' + catalogSlug + '/'
  )
    .then(function (response) {
      if (response.status === 200) {
        return commit('updateCatalog', { name: response.data.name, slug: response.data.slug })
      }
    })
}
