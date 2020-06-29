import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import './plugins/element.js'
import vuetify from './plugins/vuetify'

// 配置请求的根路径
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:8082'
Vue.prototype.$http = axios

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
