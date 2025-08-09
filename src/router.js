
import { createRouter, createWebHashHistory } from 'vue-router'
import Login from './views/Login.vue'
import Console from './views/Console.vue'
import Admin from './views/Admin.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/console', component: Console },
  { path: '/admin', component: Admin }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
