import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/projects',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/sections/login-register/LoginRegister.vue'),
      props: { mode: 'login' },
      meta: { title: 'Login' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/sections/login-register/LoginRegister.vue'),
      props: { mode: 'register' },
      meta: { title: 'Register' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/sections/projects/ProjectsView.vue'),
      meta: { title: 'Projects' },
    },
    {
      path: '/projects/new',
      name: 'project-new',
      component: () => import('@/sections/project-create/ProjectCreate.vue'),
      meta: { title: 'Create New Project' },
    },
    {
      path: '/projects/:id',
      name: 'project',
      component: () => import('@/sections/project/ProjectView.vue'),
      meta: { title: 'Project' },
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: () => import('@/components/Error.vue'),
      props: { error: 'This page does not exist.' },
      meta: { title: 'Page Not Found' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = 'Localite | ' + to.meta.title
  next()
})

export default router
