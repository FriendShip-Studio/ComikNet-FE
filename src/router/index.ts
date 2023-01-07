import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/register/index.vue"),
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/views/Layout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
      },
      {
        path: "favor",
        name: "Favor",
        component: () => import("@/views/favor/index.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
