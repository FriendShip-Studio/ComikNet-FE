import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import { router } from "./router";
import pinia from "./store";

const app = createApp(App);

app.use(Antd);
app.use(router);
app.use(pinia);

app.mount("#app");


