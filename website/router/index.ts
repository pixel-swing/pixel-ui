import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

export default function createVueRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  return router
}