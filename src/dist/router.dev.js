"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Login = _interopRequireDefault(require("./components/Login.vue"));

var _Home = _interopRequireDefault(require("./components/Home.vue"));

var _Block = _interopRequireDefault(require("@/views/Block"));

var _DisplayBlock = _interopRequireDefault(require("@/views/DisplayBlock"));

var _UserInformation = _interopRequireDefault(require("@/views/UserInformation"));

var _Topic = _interopRequireDefault(require("@/views/Topic"));

var _Users = _interopRequireDefault(require("@/views/Users"));

var _store = _interopRequireDefault(require("@/store"));

var _elementUi = require("element-ui");

var _Register = _interopRequireDefault(require("@/components/Register"));

var _Settings = _interopRequireDefault(require("@/components/Settings"));

var _Draft = _interopRequireDefault(require("@/components/Draft"));

var _Account = _interopRequireDefault(require("@/components/Account"));

var _Trash = _interopRequireDefault(require("@/components/Trash"));

var _Preference = _interopRequireDefault(require("@/components/Preference"));

var _Email = _interopRequireDefault(require("@/components/Email"));

var _Password = _interopRequireDefault(require("@/components/Password"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var originalPush = _vueRouter["default"].prototype.push;

_vueRouter["default"].prototype.push = function push(location) {
  return originalPush.call(this, location)["catch"](function (err) {
    return err;
  });
}; // 当用户访问这些路由的时候，内容会填充到App.vue里面
// App.vue如果要显示这些内容，需要添加<review-url></review-url>


var routes = [{
  name: 'login',
  path: '/login',
  meta: {
    title: '登陆-WeGrow'
  },
  component: _Login["default"]
}, {
  name: 'register',
  meta: {
    title: '注册-WeGrow'
  },
  path: '/register',
  component: _Register["default"]
}, {
  name: 'root',
  meta: {
    title: '首页'
  },
  path: '/',
  redirect: '/home'
}, {
  name: 'home',
  path: '/home',
  meta: {
    title: 'Home'
  },
  component: _Home["default"]
}, {
  path: '/block/:id',
  name: 'edit_block',
  meta: {
    title: '创作'
  },
  component: _Block["default"]
}, {
  path: '/block',
  meta: {
    title: '创作'
  },
  name: 'block',
  component: _Block["default"]
}, {
  path: '/b/:id',
  name: 'displayBlock',
  component: _DisplayBlock["default"]
}, // 用户个人信息
{
  path: '/u/:id',
  meta: {
    title: '用户中心'
  },
  name: 'user_information',
  component: _UserInformation["default"]
}, // 专题信息，只能下拉加载
{
  path: '/topic',
  meta: {
    title: '主题广场'
  },
  name: 'topic',
  component: _Users["default"]
}, {
  path: '/users',
  meta: {
    title: '用户广场'
  },
  name: 'users',
  component: _Topic["default"]
}, {
  path: '/settings',
  name: 'settings',
  redirect: '/settings/account',
  children: [{
    path: 'draft',
    component: _Draft["default"]
  }, {
    path: 'account',
    component: _Account["default"]
  }, {
    path: 'trash',
    component: _Trash["default"]
  }, {
    path: 'email',
    component: _Email["default"]
  }, {
    path: 'password',
    component: _Password["default"]
  }, {
    path: 'preference',
    component: _Preference["default"]
  }],
  meta: {
    title: '设置'
  },
  component: _Settings["default"]
}, {
  path: '/logout',
  name: 'logout'
}];
var router = new _vueRouter["default"]({
  routes: routes
}); // 路由导航守卫

router.beforeEach(function (to, from, next) {
  // to 将要访问的路径
  // from 从那个路径跳过来
  // next 是一个函数，表示放行，可以添加参数表示强制跳转的路径
  // 设置跳转页的标题
  if (to.meta.title) {
    document.title = to.meta.title;
  } // 如果是访问登陆页面或者注册页面或者退出，那么直接跳转


  if (to.name === 'login' || to.name === 'register') {
    return next();
  } // 如果sessionStorage不存在内容，那么就需要用户进行登陆


  if (!sessionStorage.getItem('token')) {
    _elementUi.Message.error('请先进行登陆!');

    return next('/login');
  }

  if (to.name === 'logout') {
    _store["default"].dispatch('LogOut').then(function () {
      _elementUi.Message.success('用户注销成功');

      next({
        path: '/login'
      });
    })["catch"](function (error) {
      return Promise.reject(error);
    });
  } // 如果用户的信息为空，则向后端发起请求获取用户信息


  if (_store["default"].getters.rolesList.length === 0) {
    _store["default"].dispatch('GetInfo').then(function (res) {
      console.log('asdasdasdsadasd');
      console.log(_store["default"].getters.rolesList.length);
      next();
    })["catch"](function (err) {
      // 如果请求失败，则自动注销并返回到登录页面
      _store["default"].dispatch('LogOut').then(function () {
        _elementUi.Message.error(err || 'Verification failed, please login again');

        next({
          path: '/login'
        });
      });
    });
  }

  next();
});
var _default = router;
exports["default"] = _default;