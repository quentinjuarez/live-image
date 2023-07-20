import { createApp } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import App from "./app.vue";
import "./main.css";

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "index",
      path: "/",
      component: () => import("./pages/index.vue"),
    },
  ],
});

createApp(App).use(router).mount("#app");
