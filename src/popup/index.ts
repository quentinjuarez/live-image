import { createApp } from "vue";

import App from "./app.vue";
import "./main.css";
import { createPinia } from "pinia";
import router from "./pages/router";

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");
