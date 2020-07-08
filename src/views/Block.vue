<template>
  <el-form label-width="0px" ref="block" :model="block" :rules="blockRules" v-loading="loading">
    <!-- 设置组件的相对高度，可以动态的占满空间 -->
    <el-row :gutter="20" class="editor-title">
      <el-col :span="10" align="middle">
        <el-form-item prop="title">
          <v-text-field label="请输入题目（最多30字）" single-line v-model="block.title"></v-text-field>
          <!-- <el-input v-model="block.title" placeholder="请输入题目..." prefix-icon="el-icon-edit" class="el-input__inner"></el-input> -->
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-button
          type="primary"
          icon="el-icon-s-promotion"
          style="font-size: 15px"
          @click="submit"
        ></el-button>
      </el-col>
    </el-row>

    <el-form-item prop="blockContent">
      <div id="editor" style="padding: 0 20px; ">
        <mavon-editor
          ref="mavon"
          @save="$save"
          v-model="block.blockContent"
          style="min-height: 80vh;"
        />
      </div>
    </el-form-item>
  </el-form>
</template>

<script>

import { createBlock } from '@/api/block'

export default {
  data () {
    return {
      block: {
        title: '',
        topicId: '4',
        status: '1', // 默认是直接发布状态
        blockContent: ''
      },
      blockRules: {
        title: [
          { required: true, message: '请输入题目', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        blockContent: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 1, message: '文章内容不能为空', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    $save () {
      this.loading = true
      // 由于我们在request层已经处理了异常状态，所以不需要加异常处理了
      this.block.status = 2
      createBlock(JSON.stringify(this.block)).then(response => {
        this.loading = false
        if (response.data.code === 200) {
          this.$message({
            message: '添加草稿成功',
            type: 'success'
          })
          this.$router.push({ path: '/block', query: { id: response.data.data } })
        }
      })
    },
    submit () {
      this.$refs.block.validate(valid => {
        if (valid) {
          this.loading = true
          createBlock(JSON.stringify(this.block)).then(response => {
            if (response.data.code === 200) {
              this.$message({
                message: '发布成功',
                type: 'success'
              })
              // 发布成功之后跳转到显示页面
              this.$router.push({ name: 'displayBlock', params: { id: response.data.data } })
            }
            this.loading = false
          })
        }
      }
      )
    }
  }
}
</script>

<style scoped>
.div-editor {
  position: relative;
  z-index: 0;
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
}

.el-input__inner {
  width: 220px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  /*outline: medium;*/
}

.editor-title {
  padding: 20px;
}
</style>
