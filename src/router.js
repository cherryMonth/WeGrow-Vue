import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Block from '@/views/Block'
import UserInformation from '@/views/UserInformation'
import Topic from '@/views/Topic'
import store from '@/store'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 当用户访问这些路由的时候，内容会填充到App.vue里面
// App.vue如果要显示这些内容，需要添加<review-url></review-url>
const routes = [{
  path: '/login',
  component: Login
},
{
  path: '/',
  redirect: '/home'
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

  // 如果是访问登陆页面，那么直接跳转
  if (to.path === '/login') { return next() }

  // 如果sessionStorage不存在内容，那么就需要用户进行登陆
  if (!sessionStorage.getItem('token')) return next('/login')

  // 如果用户的信息为空，则向后端发起请求获取用户信息
  if (store.getters.rolesList.length === 0) {
    store.dispatch('GetInfo').then(res => {
      next()
    }).catch(err => {
      // 如果请求失败，则自动注销并返回到登录页面
      store.dispatch('LogOut').then(() => {
        Message.error(err || 'Verification failed, please login again')
        next({ path: '/login' })
      })
    })
  }
  next()
}
)

export default router
