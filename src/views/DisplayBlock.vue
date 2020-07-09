<template>
  <el-container id="editor" class="editor-preview" :center="true">
    <div v-wechat-title="$route.meta.title=block.title"></div>
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
  </el-container>
</template>

<script>
import { getBlock } from '@/api/block'

export default {
  data () {
    return {
      block: {
        title: '',
        topicId: '',
        status: '1', // 默认是直接发布状态
        blockContent: ''
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
        if (response.data.code === 200) {
          this.block.title = response.data.data.title
          this.block.blockContent = response.data.data.blockContent
          this.block.topicId = response.data.data.topicId
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
</style>
