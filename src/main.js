import Vue from "vue";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

Vue.use(vuetify);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
