import { createRouter, createWebHashHistory } from 'vue-router'
import MainChecklistComponent from '../components/MainChecklistComponent.vue'
import AdminDashboard from '../components/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'checklist',
    component: MainChecklistComponent
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
