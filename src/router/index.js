import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Console from "../views/Console.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/console", component: Console, meta: { requiresAuth: true } },
  { path: "/console.html", redirect: "/console" },
  { path: "/:pathMatch(.*)*", redirect: "/login" }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, _from, next) => {
  const hasToken = !!localStorage.getItem("token");
  if (to.path === "/login" && hasToken) return next("/console");
  if (to.meta.requiresAuth && !hasToken) return next("/login");
  next();
});

export default router;
