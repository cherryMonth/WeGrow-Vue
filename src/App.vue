<template>
  <div id="app">
    <link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet" />
    <v-app id="keep">
      <Navbar />
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'App',
  components: { Navbar },
  data () {
    // 向子组件传值，默认是用户未登录
    return {
    }
  }
}
</script>
