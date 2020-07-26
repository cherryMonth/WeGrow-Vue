<template>
  <!-- <link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/5.13.1/css/all.min.css" rel="stylesheet"> -->
  <v-app id="app">
    <Navbar />
    <!-- 设置距离nav-bar的距离 -->
    <v-main style="margin-top: 1% ;">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'App',
  // vue的钩子，当组件刷新时把vuex数据持久化到sessionStorage中，防止数据丢失
  created () {
    // 在页面加载时读取sessionStorage里的token信息
    if (sessionStorage.getItem('token')) {
      this.$store.commit('changeToken', sessionStorage.getItem('token'))
    }
  },
  components: { Navbar },
  data () {
    // 向子组件传值，默认是用户未登录
    return {
    }
  }
}
</script>

<style lang='less' scoped>
// 设置宽度值，当浏览器窗口的宽度小于数值时，元素不再进行缩放
#app {
  margin-right: auto;
  width: 1500px;
  margin-left: auto;
}
</style>

<!-- 设置全局css, 把背景色调成#fbfbfb -->
<!-- 当子容器的宽度小于给定的宽度时，出现滚轮 -->
<style>
html,
body {
  background-color: #fbfbfb;
  overflow: auto;
}

#app {
  background-color: #fbfbfb;
}
</style>
