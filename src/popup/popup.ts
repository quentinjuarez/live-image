import { createApp } from "vue";

import Popup from "./popup.vue";
import "./popup.css";
import { createPinia } from "pinia";
import router from "./pages/router";

const pinia = createPinia();

createApp(Popup).use(pinia).use(router).mount("#popup");
