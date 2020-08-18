<template>
  <div>
    <div v-wechat-title="$route.meta.title=title"></div>
    <el-form
      label-width="0px"
      ref="passFormRef"
      :model="passForm"
      :rules="passFormRules"
      class="passform"
    >
      <el-form-item prop="newPassword">
        <el-input
          type="password"
          v-model="passForm.newPassword"
          prefix-icon="el-icon-lock"
          placeholder="用户密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="reNewPassword">
        <el-input
          type="password"
          v-model="passForm.reNewPassword"
          prefix-icon="el-icon-refresh-right"
          autocomplete="off"
          placeholder="请重复输入用户密码"
        ></el-input>
      </el-form-item>
      <el-form-item class="tns">
        <el-button
          type="default"
          @click="submit"
          :loading="loading"
          style="margin-left: 50%;margin-top: 20px;transform: translate(-50%, -50%);"
        >确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user'

export default {
  data () {
    return {
      title: '修改密码',
      // 这是登陆表单的数据对象
      passForm: {
        newPassword: '',
        reNewPassword: ''
      },
      passFormRules: {
        newPassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        reNewPassword: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.passForm.newPassword) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    submit () {
      this.$refs.passFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          updatePassword(this.passForm).then(() => {
            this.loading = false
            this.$message.success('修改密码成功')
            this.$router.push({ name: 'logout' })
          }).catch(() => {
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
.passform {
  width: 400px;
  margin: auto;
}
</style>
