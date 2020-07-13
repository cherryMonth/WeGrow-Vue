import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Block from '@/views/Block'
import DisplayBlock from '@/views/DisplayBlock'
import UserInformation from '@/views/UserInformation'
import Topic from '@/views/Topic'
import Users from '@/views/Users'
import store from '@/store'
import { Message } from 'element-ui'
import Register from '@/components/Register'
import Settings from '@/components/Settings'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 当用户访问这些路由的时候，内容会填充到App.vue里面
// App.vue如果要显示这些内容，需要添加<review-url></review-url>
const routes = [{
  name: 'login',
  path: '/login',
  meta: {
    title: '登陆-WeGrow'
  },
  component: Login
},
{
  name: 'register',
  meta: {
    title: '注册-WeGrow'
  },
  path: '/register',
  component: Register
},
{
  name: 'root',
  meta: {
    title: '首页'
  },
  path: '/',
  redirect: '/home'
},
{
  name: 'home',
  path: '/home',
  meta: {
    title: 'Home'
  },
  component: Home
},
{
  path: '/block/:id',
  name: 'edit_block',
  meta: {
    title: '创作'
  },
  component: Block
},
{
  path: '/block',
  meta: {
    title: '创作'
  },
  name: 'block',
  component: Block
},
{
  path: '/b/:id',
  name: 'displayBlock',
  component: DisplayBlock
},
// 用户个人信息
{
  path: '/user_information',
  meta: {
    title: '用户中心'
  },
  name: 'user_information',
  component: UserInformation
},
// 专题信息，只能下拉加载
{
  path: '/topic',
  meta: {
    title: '主题广场'
  },
  name: 'topic',
  component: Users
},
{
  path: '/users',
  meta: {
    title: '用户广场'
  },
  name: 'users',
  component: Topic
},
{
  path: '/settings',
  meta: {
    title: '设置'
  },
  name: 'settings',
  component: Settings
},
{
  path: '/logout',
  name: 'logout'
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

  // 设置跳转页的标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 如果是访问登陆页面或者注册页面或者退出，那么直接跳转
  if (to.name === 'login' || to.name === 'register') { return next() }

  // 如果sessionStorage不存在内容，那么就需要用户进行登陆
  if (!sessionStorage.getItem('token')) {
    Message.error('请先进行登陆!')
    return next('/login')
  }

  if (to.name === 'logout') {
    store.dispatch('LogOut').then(() => {
      Message.success('用户注销成功')
      next({ path: '/login' })
    }).catch(error => {
      return Promise.reject(error)
    })
  }

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
