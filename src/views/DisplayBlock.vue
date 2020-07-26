<template>
  <el-container id="editor" class="editor-preview" :center="true">
    <div v-wechat-title="$route.meta.title=block.title"></div>
    <el-main class="main-container">
      <el-row v-if="block.blockImage">
        <el-col :span="1" :offset="6">
          <div class="demo-image__lazy">
            <el-image :src="block.blockImage" lazy class="el-block-image"></el-image>
          </div>
        </el-col>
      </el-row>
      <h1
        :class="{'el-user-image-profile': block.blockImage, 'el-user-profile': !block.blockImage}"
      >{{block.title}}</h1>
      <!-- 使用户信息行与文章内容同列，并且位置不随着窗口变化而变化 -->
      <el-row>
        <el-col :span="1" :offset="6">
          <v-avatar rounded="false">
            <img :src="user.avatar" :alt="user.username" />
          </v-avatar>
        </el-col>
        <el-col :span="1" style="min-width: 200px;">
          <el-link
            :underline="false"
            style="color: #606266; font-weight: 600; float: left"
          >{{user.userName}}</el-link>
          <br />
          <el-link
            :underline="false"
            style="color: #606266; cursor: default; float: left"
          >{{user.aboutMe}}</el-link>
        </el-col>
        <el-col :span="1" style="margin-left: 460px">
          <el-button type="primary">关注他</el-button>
        </el-col>
      </el-row>
      <mavon-editor
        class="editor"
        :value="block.blockContent"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :boxShadowStyle="boxShadowStyle()"
        :box-shadow="true"
        :scrollStyle="true"
        :ishljs="true"
      />
    </el-main>
  </el-container>
</template>

<script>
import { getUserBlock } from '@/api/block'
import { getUserSummaryInfo } from '@/api/login'

export default {
  data () {
    return {
      block: {
        title: '',
        topicId: '',
        status: '1', // 默认是直接发布状态
        blockContent: '',
        blockImage: ''
      },
      user: {
        userId: '',
        userName: '',
        aboutMe: '',
        avatar: ''
      }
    }
  },
  methods: {
    boxShadowStyle () {
      return 'rgba(0, 0, 0)'
    }
  },
  mounted () {
    if (this.$route) {
      this.loading = true
      getUserBlock(this.$route.params.id).then(response => {
        console.log(response.data.data)
        if (response.data.code === 200) {
          this.block.title = response.data.data.title
          this.block.blockContent = response.data.data.blockContent
          this.block.topicId = response.data.data.topicId
          this.block.userId = response.data.data.userId
          this.block.blockImage = response.data.data.blockImage
          getUserSummaryInfo(this.block.userId).then(response => {
            this.user.userName = response.data.data.userName
            this.user.aboutMe = response.data.data.aboutMe || '这个人很懒什么都没留下~'
            this.user.avatar = response.data.data.avatarHash
          })
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.editor-preview {
  padding: 0 20px;
  margin-top: 1%;
  z-index: 0;
  position: relative;
}

.editor {
  min-height: 60vh;
  width: 800px;
  left: 25%; // box向右偏移50%
}

.el-main {
  color: #333;
  padding: 0;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-block-image {
  width: 800px;
  height: 500px;
}

.el-user-profile {
  margin-top: 20px;
  margin-left: 25%;
  text-align: left;
  margin-bottom: 10px;
}

.el-user-image-profile {
  margin-left: 25%;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
