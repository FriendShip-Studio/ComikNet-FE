import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/UserControl/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/UserControl/Register.vue"),
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/views/Layout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        meta: {
          title: "首页",
          expand: false,
        },
      },
      {
        path: "search",
        name: "Search",
        component: () => import("@/views/Search.vue"),
        meta: {
          title: "搜索",
          expand: true,
        },
      },
      {
        path: "/user",
        name: "User",
        component: () => import("@/views/UserControl/user.vue"),
        meta: {
          title: "个人中心",
          expand: false,
        },
      },
      {
        path: "/favor",
        name: "Favor",
        component: () => import("@/views/UserControl/favor.vue"),
        meta: {
          title: "我的收藏",
          expand: true,
        },
      },
      {
        path: "album/:id",
        name: "Album",
        component: () => import("@/views/Comic/album.vue"),
        meta: {
          title: "漫画详情",
          expand: true,
        },
      },
      {
        path: "comic/:id",
        name: "Comic",
        component: () => import("@/views/Comic/page.vue"),
        meta: {
          title: "漫画阅读",
          expand: false,
        },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
