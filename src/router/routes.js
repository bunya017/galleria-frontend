
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
        path: 'c/:slug',
        name: 'catalog-detail',
        component: () => import('pages/catalogs/CatalogDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'c/:catalogSlug/products',
        name: 'products-list',
        component: () => import('pages/catalogs/ProductsList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'c/:catalogSlug/product/:slug',
        name: 'product-detail',
        component: () => import('pages/catalogs/ProductDetailView.vue'),
        meta: { requiresAuth: true }
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
