import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  if (to.name === "login") return next();

  const store = useStore();

  if (!store.storeLoaded) {
    try {
      await store.init();
    } catch (error) {
      console.error("Failed to load store data:", error);
      return next("/error");
    }
  }

  const isAuthenticated = !!store.accessToken;
  if (!isAuthenticated) {
    const { fullPath } = to;
    let redirection = "";

    if (fullPath && fullPath !== "/") {
      redirection = `?next=${encodeURI(fullPath)}`;
    }
    next(`/login${redirection}`);
  }

  next();
});

export default router;
