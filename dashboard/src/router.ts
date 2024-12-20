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
      path: '/about',
      name: 'about',
      component: () => import('@/sections/AboutView.vue'),
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
  ],
})

export default router
