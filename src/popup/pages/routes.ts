import index from "./index.vue";
import login from "./login.vue";
import error from "./error.vue";

const routes = [
  {
    name: "login",
    path: "/login",
    component: login,
  },
  {
    name: "index",
    path: "/",
    component: index,
    meta: { authorize: "LoggedIn" },
  },
  {
    path: "/:catchAll(.*)",
    component: error,
  },
];

export default routes;
