import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  // if (to.name === "login") return next();

  // const isAuthenticated = false;
  // if (!isAuthenticated) {
  //   const { fullPath } = to;
  //   let redirection = "";

  //   if (fullPath && fullPath !== "/") {
  //     redirection = `?next=${encodeURI(fullPath)}`;
  //   }
  //   next(`/login${redirection}`);
  // }

  next();
});

export default router;
