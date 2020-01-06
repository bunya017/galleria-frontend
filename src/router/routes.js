
const routes = [
  {
    path: '/',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/Index.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('pages/users/Signup.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/users/Login.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/my-catalogs',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'my-catalogs',
        component: () => import('pages/catalogs/CatalogsList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':slug',
        name: 'catalog-detail',
        component: () => import('pages/catalogs/CatalogDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':catalogSlug/products',
        name: 'products-list',
        component: () => import('pages/catalogs/ProductsList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':catalogSlug/featured-products',
        name: 'featured-products',
        component: () => import('pages/catalogs/FeaturedProducts.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':catalogSlug/product/:referenceId/:productSlug',
        name: 'product-detail',
        component: () => import('pages/catalogs/ProductDetailView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':catalogSlug/collections',
        name: 'collection-list',
        component: () => import('pages/catalogs/CollectionList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':catalogSlug/collections/:collectionSlug',
        name: 'collection-detail',
        component: () => import('pages/catalogs/CollectionDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':catalogSlug/categories/:categorySlug',
        name: 'category-detail',
        component: () => import('pages/catalogs/CategoryDetail.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/stores',
    component: () => import('layouts/StoreFrontLayout.vue'),
    children: [
      {
        path: ':catalogSlug',
        name: 'store-home',
        component: () => import('pages/storeFront/StoreHome.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: ':catalogSlug/products',
        name: 'store-product-list',
        component: () => import('pages/storeFront/StoreProductList.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: ':catalogSlug/collections',
        name: 'store-collection-list',
        component: () => import('pages/storeFront/StoreCollectionList.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: ':catalogSlug/collections/:collectionSlug',
        name: 'store-collection-detail',
        component: () => import('pages/storeFront/StoreCollectionDetail.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: ':catalogSlug/categories',
        name: 'store-category-list',
        component: () => import('pages/storeFront/StoreCategoryList.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: ':catalogSlug/categories/:categorySlug',
        name: 'store-category-detail',
        component: () => import('pages/storeFront/StoreCategoryDetail.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: ':catalogSlug/products/:referenceId/:productSlug',
        name: 'store-product-detail',
        component: () => import('pages/storeFront/StoreProductDetail.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: ':catalogSlug/search',
        name: 'store-search',
        component: () => import('pages/storeFront/StoreSearch.vue'),
        meta: { requiresAuth: false }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
