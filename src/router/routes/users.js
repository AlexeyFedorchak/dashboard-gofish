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
  {
    path: '/lake/create',
    name: 'lake-create',
    component: () => import('@/views/apps/lake/lake-create/LakeCreate.vue'),
    meta: {
      pageTitle: 'Create Lake',
      breadcrumb: [
        {
          text: 'Lakes',
          active: true,
        },
      ],
    },
  },
  {
    path: '/lake/update/:slug',
    name: 'lake-update',
    component: () => import('@/views/apps/lake/lake-edit/LakeEdit.vue'),
    meta: {
      pageTitle: 'Edit Lake',
      breadcrumb: [
        {
          text: 'Lakes',
          active: true,
        },
      ],
    },
  },
]
