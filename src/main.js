// 导入全局样式表
import './assets/css/global.css'
import 'mavon-editor/dist/css/index.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './plugins/element.js'
import './plugins/ant'
import vuetify from './plugins/vuetify'
import store from '@/store/'
import VueWechatTitle from 'vue-wechat-title'

// 引入mavonEditor
import mavonEditor from 'mavon-editor'
import router from './router'
import './plugins/ant-design-vue.js'

// 配置请求的根路径
Vue.config.productionTip = false
Vue.use(VueWechatTitle)
axios.defaults.baseURL = 'http://' + process.env.VUE_APP_BASEURL
Vue.prototype.$http = axios
Vue.use(mavonEditor)

window.addEventListener('storage', function (event) {
  // event.key确认修改的locaStorage变化key，event.newValue是修改后的值
  if (event.key === 'token') {
    sessionStorage.setItem('token', event.newValue)
  }
})

Vue.directive('loadmore', {
  bind (el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      const CONDITION = this.scrollHeight - this.scrollTop - this.clientHeight <= 1
      if (CONDITION) {
        binding.value()
      }
    })
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
