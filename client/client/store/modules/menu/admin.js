import lazyLoading from './lazyLoading'

export default {
  isAuth: true,
  meta: {
    label: 'Admin',
    icon: 'fa-cog',
    expanded: false
  },

  children: [
    {
      name: 'Configs',
      path: '/configs',
      component: lazyLoading('configs', true)
    },
    {
      name: 'Home Links',
      path: '/links',
      component: lazyLoading('homeLinks', true)
    },
    {
      name: 'Integrations',
      path: '/integrations',
      component: lazyLoading('integrations', true)
    },
    {
      name: 'Stages',
      path: '/stages',
      component: lazyLoading('stages', true)
    },
    {
      name: 'Users',
      path: '/users',
      component: lazyLoading('users', true)
    }
  ]
}
