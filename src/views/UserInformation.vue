<template>
  <div id="user">
    <el-container
      style="width: 1200px;box-shadow: 0 1px 3px rgba(26,26,26,.1);margin-top: 10px; background-color: white; margin-left: 20%;"
    >
      <div v-wechat-title="$route.meta.title=user.userName"></div>
      <!-- 使用户信息行与文章内容同列，并且位置不随着窗口变化而变化 -->
      <el-main>
        <el-row>
          <el-col :span="1">
            <v-avatar :rounded="false" style="height: 160px; width: 160px">
              <img :src="user.avatar" :alt="user.username" />
            </v-avatar>
          </el-col>
          <el-col :span="3" style="min-width: 300px;margin-left: 120px;margin-top: 30px">
            <el-link
              :underline="false"
              style="color: #606266; font-weight: 600; font-family: Helvetica Neue; font-size: 26px"
            >{{user.userName}}</el-link>
            <br />
            <el-link
              :underline="false"
              style="color: #606266; cursor: default;font-family: Helvetica Neue; font-size: 18px"
            >{{user.aboutMe}}</el-link>
          </el-col>
        </el-row>
      </el-main>

      <el-footer style="height: 100%">
        <el-row>
          <!-- <el-col :span="10" :offset="4">
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          <p>asdasdasdasdasd</p>
          </el-col>-->
          <!-- absolute. 生成绝对定位的元素 -->
          <div style="position: absolute;right: 0 ;bottom: 5px;">
            <el-col :span="1" :offset="6">
              <el-button type="primary" icon="el-icon-plus">关注他</el-button>
            </el-col>
            <el-col :span="1" style="margin-left: 100px">
              <el-button type="info" icon="el-icon-chat-dot-round">发私信</el-button>
            </el-col>
          </div>
        </el-row>
      </el-footer>
    </el-container>

    <el-container style="width: 1200px;margin-left: 20%;height: 500px;margin-top: 20px; ">
      <el-container style="box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);">
        <el-header class="el-block-header" style="height: 20px">header</el-header>
        <el-divider></el-divider>
        <el-main class="el-block-main">main</el-main>
      </el-container>
      <el-aside width="200px">aside</el-aside>
    </el-container>
  </div>
</template>

<script>
import { getUserSummaryInfo } from '@/api/login'

export default {
  data () {
    return {
      user: {
        userId: '',
        userName: '',
        aboutMe: '',
        avatar: ''
      }
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.loading = true
      getUserSummaryInfo(this.$route.params.id).then(response => {
        this.user.userName = response.data.data.userName
        this.user.userId = response.data.data.userId
        this.user.aboutMe = response.data.data.aboutMe || '这个人很懒什么都没留下~'
        this.user.avatar = response.data.data.avatarHash
      })
    }
  }
}
</script>

<style scoped>
.el-block-header {
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-block-main {
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-aside {
  margin-left: 10px;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  color: #333;
  text-align: center;
  line-height: 200px;
}
</style>
