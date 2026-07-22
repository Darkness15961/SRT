import { createRouter, createWebHistory } from 'vue-router'
import WheelView from '@/views/WheelView.vue'
import ConfigView from '@/views/ConfigView.vue'

const routes = [
  {
    path: '/',
    name: 'wheel',
    component: WheelView,
  },
  {
    path: '/config',
    name: 'config',
    component: ConfigView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
