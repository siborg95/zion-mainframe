import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Console from "../views/Console.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/console", component: Console, meta: { requiresAuth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("token")) return next("/login");
  next();
});

export default router;
