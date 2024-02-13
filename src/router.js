// router.js
import { createRouter, createWebHistory } from 'vue-router';
import MainChecklistComponent from './components/MainChecklistComponent.vue';
import AdminDashboard from './components/AdminDashboard.vue';

console.log("Using Router")

const routes = [
  { path: '/chex', component: MainChecklistComponent },
  { path: '/admin', component: AdminDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
