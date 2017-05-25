import lazyLoading from './lazyLoading'

function isLoggedIn (to, from, next) {
  if (window.localStorage.isAuth === 'true') {
    next()
  } else {
    next('/')
  }
}

export default {
  isAuth: true,
  meta: {
    label: 'Admin',
    icon: 'fa-cog',
    expanded: true
  },

  children: [
    {
      name: 'Configs',
      path: '/admin/configs',
      component: lazyLoading('configs', true),
      beforeEnter: isLoggedIn
    },
    {
      name: 'Home Links',
      path: '/admin/links',
      component: lazyLoading('homeLinks', true),
      beforeEnter: isLoggedIn
    },
    {
      name: 'Integrations',
      path: '/admin/integrations',
      component: lazyLoading('integrations', true),
      beforeEnter: isLoggedIn
    },
    {
      name: 'Builds',
      path: '/admin/builds',
      component: lazyLoading('builds', true),
      beforeEnter: isLoggedIn
    },
    {
      name: 'Users (in dev!)',
      path: '/admin/users',
      component: lazyLoading('users', true),
      beforeEnter: isLoggedIn
    }
  ]
}
