<template>
  <div>
    <el-container style="width: 1200px;margin: auto;margin-top: 20px;height: 100%">
      <el-aside width="200px">
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
            <v-divider v-else-if="item.divider" :key="i" dark class="el-divider"></v-divider>
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
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { heading: '账号与密码' },
        { icon: 'account_circle', text: '修改用户信息', route: '/settings/account', color: 'blue darken-2' },
        { divider: true },
        { icon: 'vpn_key', text: '修改密码', route: '/settings/password', color: 'yellow darken-2' },
        { divider: true },
        { icon: 'email', text: '修改邮箱', route: '/settings/email', color: 'red darken-2' },
        { divider: true },
        { heading: '历史数据' },
        { icon: 'drafts', text: '草稿箱', route: '/settings/draft', color: 'green darken-2' },
        { divider: true },
        { icon: 'delete_forever', text: '垃圾篓', route: '/settings/trash', color: 'purple darken-2' },
        { divider: true },
        { heading: '其他' },
        { icon: 'brightness_high', text: '偏好设置', route: '/settings/preference', color: 'garnet darken-2' },
        { divider: true }
      ]
    }
  }
}
</script>

<style lang='less' scoped>
.el-aside {
  top: 0;
  margin-left: 10px;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  color: #333;
  overflow: hidden;
}

.el-divider {
  border-color: rgba(0, 0, 0, 0.12);
  margin: 8px 0;
  display: block;
  max-width: 100%;
  height: 0;
  max-height: 0;
  border-width: thin 0 0;
}
</style>
