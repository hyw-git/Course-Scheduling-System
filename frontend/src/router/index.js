import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import Plans from '../views/Plans.vue'
import Timetable from '../views/Timetable.vue'
import Settings from '../views/Settings.vue'
import NewPlan from '../views/NewPlan.vue'
import ClassroomSettings from '../views/ClassroomSettings.vue'
import TeacherSettings from '../views/TeacherSettings.vue'
import CourseSettings from '../views/CourseSettings.vue'
import auth from '../api/auth'

const routes = [
  { path: '/', name: 'Overview', component: Overview },
  { path: '/plans', name: 'Plans', component: Plans, meta: { requiresAuth: true } },
  { path: '/plans/new', name: 'NewPlan', component: NewPlan, meta: { requiresAuth: true } },
  { path: '/timetable', name: 'Timetable', component: Timetable, meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/settings/rooms', name: 'ClassroomSettings', component: ClassroomSettings, meta: { requiresAuth: true } },
  { path: '/settings/teachers', name: 'TeacherSettings', component: TeacherSettings, meta: { requiresAuth: true } },
  { path: '/settings/courses', name: 'CourseSettings', component: CourseSettings, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 登录验证：如果路由需要认证但用户未登录，则重定向到首页。
// router.beforeEach((to, from, next) => {
//   if (to.meta && to.meta.requiresAuth && !auth.isAuthenticated.value) {
//     // Redirect to home and include attempted path so UI can show a prompt
//     next({ path: '/', query: { attempted: to.fullPath } })
//   } else {
//     next()
//   }
// })

// 跳过登录功能，直接允许访问所有路由，用于测试。
// 替换为上面注释掉的代码重新启用登录验证。
router.beforeEach((to, from, next) => {
  next()
})

export default router
