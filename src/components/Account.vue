<template>
  <div id="account">
    <div v-wechat-title="$route.meta.title=title"></div>
    <el-form
      ref="FormRef"
      style="width: 250px;margin: auto;"
      :model="accountForm"
      :rules="FormRules"
      class="passform"
    >
      <el-form-item prop="username">
        <label>个人昵称</label>
        <el-input
          class="username"
          v-model="accountForm.username"
          prefix-icon="el-icon-user-solid"
          :placeholder="this.$store.getters.username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="aboutMe">
        <label>个人签名</label>
        <v-textarea
          v-model="accountForm.aboutMe"
          :auto-grow="true"
          :full-width="true"
          counter
          :rules="rules"
          :rows="1"
        ></v-textarea>
      </el-form-item>
      <el-form-item>
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
          <img v-if="accountForm.avatarHash" :src="accountForm.avatarHash" class="avatar" />
          <i v-else class="el-icon-upload avatar-uploader-icon" style="font-size: 67px"></i>
        </el-upload>
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
import { getBase64, beforeAvatarUpload } from '@/api/image'

export default {
  data () {
    return {
      title: '用户信息',
      // 这是登陆表单的数据对象
      accountForm: {
        username: this.$store.getters.username,
        aboutMe: this.$store.getters.aboutMe,
        avatarHash: this.$store.getters.avatarHash
      },
      rules: [result => this.accountForm.aboutMe.length <= 100 || 'Max 100 characters'],
      FormRules: {
        username: [
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  mounted () {
    // 如果用户的信息为空，则向后端发起请求获取用户信息
    if (this.$store.getters.rolesList.length === 0) {
      this.$store.dispatch('GetInfo').then(res => {
        this.accountForm.username = this.$store.getters.username
        this.accountForm.aboutMe = this.$store.getters.aboutMe
        this.accountForm.avatarHash = this.$store.getters.avatarHash
      }).catch(err => {
        // 如果请求失败，则自动注销并返回到登录页面
        this.$store.dispatch('LogOut').then(() => {
          this.$message.error(err || 'Verification failed, please login again')
        })
      })
    }
  },
  methods: {
    httpRequest (data) {
      getBase64(data.file).then(resBase64 => {
        this.accountForm.avatarHash = 'data:image/jpeg;base64,' + resBase64.split(',')[1]
      })
    },
    removeAvatar () {
      this.accountForm.avatarHash = ''
    },
    beforeAvatarUpload,
    submit () {
      this.$refs.FormRef.validate(valid => {
        if (valid) {
          // 由于返回的信息只有data有效，所以直接可以从返回结果中获取data属性并指定其引用为res
          // 用户登陆成功之后需要把token保存到sessionStorage中
          // 1.1 除了登陆窗口，其他的API都需要登陆才能访问
          // 1.2 token只应在当前网页打开期间生效
          // 把vuex数据持久化到sessionStorage
          this.loading = true
          this.$store.dispatch('Update', this.accountForm).then(() => {
            this.$store.dispatch('GetInfo').then(() => {
              this.$message.success('信息修改成功')
              this.$router.push({ to: '/settings/account' })
            }).catch(err => {
              this.message.error(err || 'Verification failed, please login again')
              this.$router.push({ path: '/login' })
            })
          }).catch(err => {
            this.message.warning(err)
          })
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
  width: 250px;
  height: 250px;
  margin: auto;
}

.username {
  width: 100%;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
  position: absolute; // 把box的位置设置为自由移动
  left: 50%; // box向右偏移50%
  top: 50%;
  transform: translate(-50%, -50%); // 然后要减去自身的50%才能让中心居中
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
