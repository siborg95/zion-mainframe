import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Console from "../views/Console.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/console", component: Console },
    { path: "/console.html", redirect: "/console" },
    { path: "/:pathMatch(.*)*", redirect: "/login" }
  ]
});
