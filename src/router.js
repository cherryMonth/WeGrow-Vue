import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Block from '@/views/Block'
import UserInformation from '@/views/UserInformation'
import Topic from '@/views/Topic'

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
},
{
  path: '/home',
  component: Home
},
{
  path: '/create_block',
  name: 'block',
  component: Block
},
// 用户个人信息
{
  path: '/user_information',
  name: 'user_information',
  component: UserInformation
},
// 专题信息，只能下拉加载
{
  path: '/topic:id',
  name: Topic,
  component: UserInformation
}
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从那个路径跳过来
  // next 是一个函数，表示放行，可以添加参数表示强制跳转的路径
  if (to.path === '/login') return next()
  // 先获取token
  const token = window.sessionStorage.getItem('Authorization')
  if (!token) return next('/login')
  next()
}
)

export default router
