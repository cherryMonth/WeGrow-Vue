<template>
  <div id="main" class='div-editor'>
      <!-- 设置组件的相对高度，可以动态的占满空间 -->
    <mavon-editor v-model="value" style="min-height: 85vh;" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
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
</style>
