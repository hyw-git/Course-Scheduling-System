import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import Plans from '../views/Plans.vue'
import Timetable from '../views/Timetable.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', name: 'Overview', component: Overview },
  { path: '/plans', name: 'Plans', component: Plans },
  { path: '/timetable', name: 'Timetable', component: Timetable },
  { path: '/settings', name: 'Settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
