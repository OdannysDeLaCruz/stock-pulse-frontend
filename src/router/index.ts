import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/stocks',
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: () => import('@/views/stocks/StocksPage.vue'),
    },
    {
      path: '/stocks/:ticker',
      name: 'stocksTicker',
      component: () => import('@/views/stocks/StockDetailPage.vue'),
    },
    {
      path: '/stocks/topics/:topic',
      name: 'stocksTopic',
      component: () => import('@/views/stocks/TopicShowerPage.vue'),
    },

  ],
})

export default router
