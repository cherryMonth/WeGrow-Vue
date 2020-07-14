<template>
  <div id="app">
    <!-- <link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/5.13.1/css/all.min.css" rel="stylesheet"> -->
    <v-app id="keep">
      <Navbar />
      <!-- 设置距离nav-bar的距离 -->
      <v-main style="margin-top: 1% ;background-color: #fbfbfb;">
        <router-view></router-view>
      </v-main>
    </v-app>
  </div>
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
#app {
  width: 1000px;
  margin-right: auto;
  margin-left: auto;
}
</style>
