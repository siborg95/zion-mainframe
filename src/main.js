import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
console.log("SPA BOOT v7");     // you should see this in DevTools Console
createApp(App).use(router).mount("#app");
