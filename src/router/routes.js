
const routes = [
  {
    path: '/',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'signup', component: () => import('pages/users/Signup.vue') },
      { path: 'login', component: () => import('pages/users/Login.vue') }
    ]
  },
  {
    path: '/my-catalogs',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      { path: '', component: () => import('pages/catalogs/CatalogsList.vue') }
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
