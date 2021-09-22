export default [
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/apps/user/users-list/UsersList.vue'),
    meta: {
      pageTitle: 'Users',
      breadcrumb: [
        {
          text: 'Users',
          active: true,
        },
      ],
    },
  },
  {
    path: '/lakes',
    name: 'lakes',
    component: () => import('@/views/apps/lake/lakes-list/LakesList.vue'),
    meta: {
      pageTitle: 'Lakes',
      breadcrumb: [
        {
          text: 'Lakes',
          active: true,
        },
      ],
    },
  },
]
