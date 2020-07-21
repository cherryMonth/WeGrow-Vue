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

    <el-container style="width: 1200px;margin-left: 20%;margin-top: 20px;height: 100%">
      <el-container style="box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);">
        <el-header class="el-block-header" style="height: 20px">
          <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <!-- <el-tab-pane label="动态" name="first" class="el-tab">ta的动态</el-tab-pane> -->
              <el-tab-pane label="回答" name="second" class="el-tab">ta的回答</el-tab-pane>
              <el-tab-pane label="提问" name="third" class="el-tab">ta的提问</el-tab-pane>
              <el-tab-pane label="文章" name="fourth" class="el-tab">ta的文章</el-tab-pane>
            </el-tabs>
          </template>
        </el-header>
        <el-main>
          <div class="el-block-main">
            <div v-for="(item, $index) in targetlist.List" :key="$index">
              {{item}}
              <el-divider></el-divider>
            </div>
          </div>
        </el-main>
      </el-container>
      <el-aside width="200px" class="el-aside">aside</el-aside>
    </el-container>
  </div>
</template>

<script>
import { getUserSummaryInfo } from '@/api/login'
import { getBlockListByUserId } from '@/api/block'

export default {
  data () {
    return {
      user: {
        userId: '',
        userName: '',
        aboutMe: '',
        avatar: ''
      },
      activeName: 'second',
      loading: false,
      notifyPromise: Promise.resolve(),
      targetlist: {
        pageSize: 5,
        pageNum: 1,
        total: 0,
        totalPage: 0,
        List: []
      },
      timeout: null
    }
  },
  mounted () {
    if (this.$route.params.id) {
      getUserSummaryInfo(this.$route.params.id).then(response => {
        this.user.userName = response.data.data.userName
        this.user.aboutMe = response.data.data.aboutMe || '这个人很懒什么都没留下~'
        this.user.avatar = response.data.data.avatarHash
      })
      this.scroll()
      this.infiniteHandler()
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    infiniteHandler () {
      this.loading = true
      getBlockListByUserId({ userId: this.$route.params.id, pageNum: this.targetlist.pageNum, pageSize: this.targetlist.pageSize }).then(response => {
        if (response.data.data.list.length > 0 && response.data.data.totalPage >= this.targetlist.pageNum) {
          this.targetlist.List = this.targetlist.List.concat(response.data.data.list)
          this.targetlist.total = response.data.data.total
          this.targetlist.totalPage = response.data.data.totalPage
          this.targetlist.pageNum += 1
          this.loading = false
        }
      })
    },
    scroll () {
      const body = document.body
      body.addEventListener('scroll', e => {
        const bottom = document.body.scrollHeight - document.body.scrollTop - document.body.clientHeight
        if (bottom < 1) {
          this.infiniteHandler()
        }
      }, true)
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
  margin-top: 40px;
  text-align: center;
  line-height: 200px;
}

.el-aside {
  position: sticky;
  /* position: -webkit-sticky; */
  top: 0;
  margin-left: 10px;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-tab {
  float: left;
  font-weight: 600;
}
</style>
