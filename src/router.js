import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'

Vue.use(VueRouter)

// 当用户访问这些路由的时候，内容会填充到App.vue里面
// App.vue如果要显示这些内容，需要添加<review-url></review-url>
const routes = [{
  path: '/login',
  component: Login
},
{
  path: '/',
  redirect: '/login'
}
]

const router = new VueRouter({
  routes
})

export default router
