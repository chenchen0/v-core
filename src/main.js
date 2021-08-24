import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";

// import * as filters from "./filters"; // 全局vue filter
// register global utility filters.
// Object.keys(filters).forEach(key => {
//     Vue.filter(key, filters[key]);
// });
Vue.config.productionTip = false;

Vue.use(ElementUI, {size: "small"});

// import VCore from "./index";
import VCore from "../lib/index.umd";
Vue.use(VCore);

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
