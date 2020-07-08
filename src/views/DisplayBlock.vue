<template>
  <div id="editor" style="padding: 0 20px; margin-top: 1%; z-index: 0">
    <div v-wechat-title="$route.meta.title=block.title"></div>
    <mavon-editor
      class="md"
      :value="block.blockContent"
      :subfield="false"
      :defaultOpen="'preview'"
      :toolbarsFlag="false"
      :editable="false"
      :scrollStyle="true"
      :ishljs="true"
      style="min-height: 80vh;position: relative;z-index: 0"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      block: {
        title: 'asdasd',
        topicId: '4',
        status: '1', // 默认是直接发布状态
        blockContent: 'asdasdasdasd'
      }
    }
  }
}
</script>
