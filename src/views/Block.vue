<template>
  <div class="div-editor">
    <div v-wechat-title="$route.meta.title=block.title"></div>
    <el-form label-width="0px" ref="block" :model="block" :rules="blockRules" v-loading="loading">
      <!-- 设置组件的相对高度，可以动态的占满空间 -->
      <el-form-item style="margin-left: 15px;width: 100%">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          accept="image/jpeg, image/gif, image/png"
          action="#"
          :limit="1"
          :http-request="httpRequest"
          :before-upload="beforeAvatarUpload"
          :on-remove="removeAvatar"
        >
          <img v-if="block.blockImage" :src="block.blockImage" class="avatar" />
          <i v-else class="el-icon-upload avatar-uploader-icon" style="font-size: 67px"></i>
        </el-upload>
      </el-form-item>
      <el-row :gutter="20" class="editor-title">
        <el-col :span="15" align="middle">
          <el-form-item prop="title">
            <v-text-field label="请输入题目（最多30字）" single-line v-model="block.title"></v-text-field>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="2">
          <el-form-item prop="topicId">
            <el-select v-model="block.topicId" placeholder="请选择内容标签" v-loadmore="loadTopic">
              <el-option
                v-for="item in topicPage.topicList"
                :key="item.index"
                :label="item.topicName"
                :value="item.id"
              >{{item.topicName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            @click="submit"
            icon="el-icon-s-promotion"
            style="font-size: 15px"
          ></el-button>
        </el-col>
      </el-row>

      <el-form-item prop="blockContent">
        <div id="editor" style="padding: 0 20px; ">
          <mavon-editor
            ref="mavon"
            @save="$save"
            v-model="block.blockContent"
            style="min-height: 75vh;"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { createBlock, getBlock, updateBlock } from '@/api/block'
import { getTopicList } from '@/api/topic'
import { getBase64, beforeAvatarUpload } from '@/api/image'

export default {
  data () {
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        this.notifyPromise = this.notifyPromise.then(() => {
          this.$notify({
            message: '题目不能为空',
            type: 'warning',
            duration: 3000
          })
        })
        return false
      } else if (value.length > 30) {
        this.notifyPromise = this.notifyPromise.then(() => {
          this.$notify({
            message: '题目的长度不能超过30个字符',
            type: 'warning',
            duration: 3000
          })
        })

        return false
      } else {
        callback()
      }
    }
    const validateContent = (rule, value, callback) => {
      if (value === '') {
        this.notifyPromise = this.notifyPromise.then(() => {
          this.$notify({
            message: '内容不能为空',
            type: 'warning',
            duration: 3000
          })
        })
        return false
      } else {
        callback()
      }
    }
    const validateTopicId = (rule, value, callback) => {
      if (value === '' || !value) {
        this.notifyPromise = this.notifyPromise.then(() => {
          this.$notify({
            message: '专题不能为空',
            type: 'warning',
            duration: 3000
          })
        })

        return false
      } else {
        callback()
      }
    }
    return {
      beforeAvatarUpload,
      block: {
        title: '',
        topicId: '',
        status: '2', // 默认是草稿状态
        blockContent: '',
        blockImage: ''
      },
      blockRules: {
        title: [
          { validator: validateTitle, trigger: 'blur' }
        ],
        blockContent: [
          { validator: validateContent, trigger: 'blur' }
        ],
        topicId: [
          { validator: validateTopicId, trigger: 'blur' }
        ]
      },
      loading: false,
      notifyPromise: Promise.resolve(),
      topicPage: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        totalPage: 0,
        topicList: []
      }
    }
  },
  mounted () {
    this.loadTopic()
    if (this.$route.query.id) {
      this.loading = true
      getBlock(this.$route.query.id).then(response => {
        if (response.data.code === 200) {
          this.block.title = response.data.data.title
          this.block.blockContent = response.data.data.blockContent
          this.block.topicId = response.data.data.topicId
          this.block.blockImage = response.data.data.blockImage
        }
        this.loading = false
      })
    }
  },
  methods: {
    httpRequest (data) {
      getBase64(data.file).then(resBase64 => {
        this.block.blockImage = 'data:image/jpeg;base64,' + resBase64.split(',')[1]
      })
    },
    removeAvatar () {
      this.block.blockImage = ''
    },
    loadTopic () {
      getTopicList({ pageNum: this.topicPage.pageNum, pageSize: this.topicPage.pageSize }).then(response => {
        if (response.data.data.list.length > 0 && response.data.data.totalPage >= this.topicPage.pageNum) {
          this.topicPage.topicList = this.topicPage.topicList.concat(response.data.data.list)
          this.topicPage.total = response.data.data.total
          this.topicPage.totalPage = response.data.data.totalPage
          this.topicPage.pageNum += 1
        }
      })
    },
    save_action_success (response) {
      this.loading = false
      this.$notify({
        message: '创建草稿成功',
        type: 'success',
        duration: 3000
      })
      this.$router.push({ path: '/block', query: { id: response.data.data } })
    },
    submit_action_success (response) {
      this.loading = false
      this.$message({
        message: '发布成功',
        type: 'success'
      })
      this.$router.push({ name: 'displayBlock', params: { id: response.data.data } })
    },
    $save () {
      // 当用户点击保存时设置文章的状态为2，即为草稿状态
      this.loading = true
      // 由于我们在request层已经处理了异常状态，所以不需要加异常处理了
      this.block.status = 2
      // 如果当前页面存在query.id，那么即更新该文章ID对应的文章
      if (this.$route.query.id) {
        updateBlock(JSON.stringify(this.block), this.$route.query.id).then(response => {
          if (response.data.code === 200) {
            this.save_action_success(response)
          }
        })
      } else {
        // 否则创建一篇新文章并返回到草稿页面
        createBlock(JSON.stringify(this.block)).then(response => {
          this.loading = false
          if (response.data.code === 200) {
            this.save_action_success(response)
          }
        })
      }
    },
    submit () {
      this.$refs.block.validate(valid => {
        if (valid) {
          // 当用户提交之后，如果当前是草稿页面，则修改文章状态为1，并重定向到显示页面
          this.block.status = 3
          if (this.$route.query.id) {
            this.loading = true
            updateBlock(JSON.stringify(this.block), this.$route.query.id).then(response => {
              if (response.data.code === 200) {
                this.submit_action_success(response)
              }
            })
          } else {
            createBlock(JSON.stringify(this.block)).then(response => {
              this.loading = false
              if (response.data.code === 200) {
                this.submit_action_success(response)
              }
            })
          }
        }
      }
      )
    }
  }
}
</script>

<style lang='less' scoped>
.div-editor {
  position: relative;
  z-index: 0;
  width: 800px;
  left: 50%; // box向右偏移50%
  transform: translate(-50%); // 然后要减去自身的50%才能让中心居中
}

.editor-title {
  padding: 20px;
}

.infinite-scroll {
  height: 80px;
  overflow-y: auto;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 240px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  position: absolute; // 把box的位置设置为自由移动
  left: 50%; // box向右偏移50%
  top: 50%;
  transform: translate(-50%, -50%); // 然后要减去自身的50%才能让中心居中
}
.avatar {
  width: 800px;
  height: 500px;
  overflow-y: hidden;
}
</style>
