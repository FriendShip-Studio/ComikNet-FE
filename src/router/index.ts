import { createRouter, createWebHashHistory } from "vue-router";

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
        meta:{
          title: "首页",
          expand: false,
        }
      },
      {
        path: "user",
        name: "User",
        component: () => import("@/views/user/index.vue"),
        meta:{
          title: "个人资料",
          expand: false,
        }
      },
      {
        path: "favor",
        name: "Favor",
        component: () => import("@/views/favor/index.vue"),
        meta:{
          title: "收藏夹",
          expand: true,
        }
      },
      {
        path: "album/:id",
        name: "Album",
        component: () => import("@/views/album/index.vue"),
        meta:{
          title: "画廊",
          expand: false,
        }
      }
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
