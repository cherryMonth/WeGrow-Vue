<template>
  <div>
    <!-- 导航栏 -->
    <!-- 工具栏标题label -->
    <v-app-bar app clipped-left color="light">
      <!-- 添加左侧抽屉菜单栏 点击加载 -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5">
        We
        <span class="font-weight-light">Grow</span>
      </span>
      <v-text-field solo-inverted rounded hide-details label="Search" prepend-inner-icon="search"></v-text-field>
      <!-- 当退出按钮向右浮动 -->
      <v-spacer></v-spacer>
      <!-- 登出按钮 设置按钮形状为圆滑 并设置背景颜色 -->
      <template>
        <v-btn rounded @click="logout" v-if="$store.getters.token">
          <span>Sign Out</span>
          <v-icon right>exit_to_app</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <!-- 如果遍历到一级标题，那么绘制一个一级标题 -->
          <v-row v-if="item.heading" :key="i" align="center">
            <!-- 绘制一级标题的Label以及对应的按钮 -->
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
          </v-row>
          <!-- 当遍历到分割线时，绘制分割线 -->
          <v-divider v-else-if="item.divider" :key="i" dark class="my-4"></v-divider>
          <!-- 如果只是普通的菜单栏，那么绘制菜单项 -->
          <v-list-item v-else :key="i" router :to="item.route">
            <v-list-item-action>
              <v-icon large :color="item.color">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    // 默认抽屉菜单不加载，当点击时表达式为真，开始加载
    drawer: false,
    items: [
      { icon: 'lightbulb_outline', text: 'Home', route: '/', color: 'orange darken-2' },
      { divider: true },
      { heading: 'Public' },
      { icon: 'dialpad', text: 'Topic', route: '/user_information', color: 'purple darken-2' },
      { icon: 'people', text: 'Users', route: '/create_block', color: 'blue darken-2' },
      { divider: true },
      { icon: 'help', text: 'Help', color: 'green darken-2' }
    ]
  }),
  methods: {
    logout () {
      this.$store.commit('clear')
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
