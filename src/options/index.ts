import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./app.vue";
import "./main.css";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "index",
      path: "/",
      component: () => import("./pages/index.vue"),
    },
  ],
});

// router.beforeEach((to) => {
//   if (to.path === "/") return "/options";
// });

createApp(App).use(router).mount("#app");
