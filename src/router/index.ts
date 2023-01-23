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
        meta: {
          title: "首页",
          expand: false,
        },
      },
      {
        path: "search",
        name: "Search",
        component: () => import("@/views/search/index.vue"),
        meta: {
          title: "搜索",
          expand: true,
        },
      },
      {
        path: "user",
        name: "User",
        component: () => import("@/views/user/index.vue"),
        meta: {
          title: "个人资料",
          expand: false,
        },
      },
      {
        path: "favor",
        name: "Favor",
        component: () => import("@/views/favor/index.vue"),
        meta: {
          title: "收藏夹",
          expand: true,
        },
      },
      {
        path: "history",
        name: "History",
        component: () => import("@/views/history/index.vue"),
        meta: {
          title: "历史记录",
          expand: true,
        },
      },
      {
        path: "album/:id",
        name: "Album",
        component: () => import("@/views/album/index.vue"),
        meta: {
          title: "画廊",
          expand: false,
        },
      },
      {
        path: "comic/:id",
        name: "Comic",
        component: () => import("@/views/reader/index.vue"),
        meta: {
          title: "漫画阅读",
          expand: false,
        },
      },
      {
        path: "0721",
        name: "0721",
        component: () => import("@/components/JMImage/example.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
