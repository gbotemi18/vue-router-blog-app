import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: 'Latest posts' },
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/page/:pageNumber(\\d+)',
    name: 'posts-page',
    meta: { title: 'Latest posts' },
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/posts/:postId/:slug?',
    name: 'post-detail',
    meta: { title: 'Post details' },
    component: () => import('../views/PostDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: { title: 'Page not found' },
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
