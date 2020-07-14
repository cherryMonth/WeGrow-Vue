<template>
  <el-container id="editor" class="editor-preview" :center="true">
    <div v-wechat-title="$route.meta.title=block.title"></div>
    <el-main>
      <h1>{{block.title}}</h1>
      <el-row type="flex">
        <el-col :span="1" style="margin-left : 10%">
          <v-avatar rounded="false">
            <img :src="user.avatar" :alt="user.username" />
          </v-avatar>
        </el-col>
        <el-col :span="1" style="margin-left: 3%; min-width: 200px;">
          <el-link  :underline='false' style="color: #606266; font-weight: 600; float: left">{{user.userName}}</el-link>
          <br>
           <el-link  :underline='false' style="color: #606266; cursor: default; float: left">{{user.aboutMe}}</el-link>
        </el-col>
        <el-col :span="15" :offset="8">
          <el-button type="primary">关注他</el-button>
        </el-col>
      </el-row>
      <el-row type="flex">
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
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { getBlock } from '@/api/block'
import { getUserSummaryInfo } from '@/api/login'

export default {
  data () {
    return {
      block: {
        title: '',
        topicId: '',
        status: '1', // 默认是直接发布状态
        blockContent: ''
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
      getBlock(this.$route.params.id).then(response => {
        console.log(response.data.data)
        if (response.data.code === 200) {
          this.block.title = response.data.data.title
          this.block.blockContent = response.data.data.blockContent
          this.block.topicId = response.data.data.topicId
          this.block.userId = response.data.data.userId
          getUserSummaryInfo(this.block.userId).then(response => {
            this.user.userName = response.data.data.userName
            this.user.aboutMe = response.data.data.aboutMe || '这个人很懒什么都没留下~'
            this.user.avatar = response.data.data.avatarHash
            console.log(this.user)
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
  width: 690px;
  left: 50%; // box向右偏移50%
  transform: translate(-50%); // 然后要减去自身的50%才能让中心居中
}

.el-main {
  color: #333;
  margin-top: 50px;
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
</style>
