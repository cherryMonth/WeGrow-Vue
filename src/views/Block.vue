<template>
  <div class="div-editor">
    <div v-wechat-title="$route.meta.title=block.title"></div>
    <el-form label-width="0px" ref="block" :model="block" :rules="blockRules" v-loading="loading">
      <!-- 设置组件的相对高度，可以动态的占满空间 -->
      <el-row :gutter="20" class="editor-title">
        <el-col :span="10" align="middle">
          <el-form-item prop="title">
            <v-text-field label="请输入题目（最多30字）" single-line v-model="block.title"></v-text-field>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="topicId">
            <el-popover placement="top" v-model="visible">
              <el-select v-model="block.topicId" placeholder="请选择">
                <el-option
                  v-for="item in block.topicList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button
                type="primary"
                slot="reference"
                icon="el-icon-s-promotion"
                style="font-size: 15px"
              ></el-button>
            </el-popover>
          </el-form-item>
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

export default {
  data () {
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        this.$notify({
          message: '题目不能为空',
          type: 'warning',
          duration: 3000
        })
        return false
      } else if (value.length > 30) {
        this.$notify({
          message: '题目的长度不能超过30个字符',
          type: 'warning',
          duration: 3000
        })
        return false
      } else {
        callback()
      }
    }
    const validateContent = (rule, value, callback) => {
      if (value === '') {
        this.$notify({
          message: '内容不能为空',
          type: 'warning',
          duration: 3000
        })
        return false
      } else {
        callback()
      }
    }
    const validateTopicId = (rule, value, callback) => {
      if (value === '' || !value) {
        this.$notify({
          message: '专题不能为空',
          type: 'warning',
          duration: 3000
        })
        return false
      } else {
        console.log(value)
        callback()
      }
    }
    return {
      block: {
        title: '',
        topicId: '',
        status: '1', // 默认是直接发布状态
        blockContent: '',
        topicList: []
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
      visible: false
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.loading = true
      getBlock(this.$route.query.id).then(response => {
        if (response.data.code === 200) {
          this.block.title = response.data.data.title
          this.block.blockContent = response.data.data.blockContent
          this.block.topicId = response.data.data.topicId
        }
        this.loading = false
      })
    }
  },
  methods: {
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
          this.block.status = 1
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
  width: 60%;
  left: 50%; // box向右偏移50%
  transform: translate(-50%); // 然后要减去自身的50%才能让中心居中
}

.editor-title {
  padding: 20px;
}
</style>
