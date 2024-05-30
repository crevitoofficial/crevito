import App from './App'
import VueI18n from "vue-i18n";
import gloabalConfig from './config/gloabal.config'
// import { i18n } from './utils/vueI18n';


// #ifndef VUE3
import Vue from 'vue'

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: gloabalConfig.DEFAULT_LANG,
  messages: {
  }
});

// Vue.prototype._i18n = i18n
Vue.prototype.$global = gloabalConfig

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    i18n,
    ...App
})
app.$mount()
// 导出供外部js引入使用
export default app
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
