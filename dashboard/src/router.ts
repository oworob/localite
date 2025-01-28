import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/sections/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/sections/login/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/sections/login/LoginView.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/sections/projects/ProjectsView.vue'),
    },
    {
      path: '/projects/new',
      name: 'project-new',
      component: () => import('@/sections/project-new/ProjectNew.vue'),
    },
    {
      path: '/projects/:id',
      name: 'project',
      component: () => import('@/sections/project/ProjectView.vue'),
    },
    {
      path: '/projects/:id/manage',
      name: 'project-manage',
      component: () => import('@/sections/PageNotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: () => import('@/sections/PageNotFoundView.vue'),
    },
  ],
})

export default router
