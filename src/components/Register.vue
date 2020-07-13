<template>
  <div class="register_container">
    <div class="register_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单区域 -->
      <!-- 数据绑定, ref即为该表单的引用，可以再script区域对表单进行操作 -->
      <el-form
        label-width="0px"
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerFormRules"
        class="register_form"
      >
        <div class="normal-title">
          <router-link class="sign" :to="{name: 'login'}">登陆</router-link>
          <router-link class="register" :to="{name: 'register'}">注册</router-link>
        </div>
        <el-form-item prop="email">
          <!-- 绑定数据对象到属性 -->
          <!-- el-input的属性不能以空格结尾 -->
          <!-- 双向绑定到对象属性 -->
          <el-input v-model="registerForm.email" prefix-icon="el-icon-message" placeholder="用户邮箱"></el-input>
        </el-form-item>
        <!-- 用户名，校验需要将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
        <el-form-item prop="username">
          <!-- 绑定数据对象到属性 -->
          <!-- el-input的属性不能以空格结尾 -->
          <!-- 双向绑定到对象属性 -->
          <el-input v-model="registerForm.username" prefix-icon="el-icon-user" placeholder="用户昵称"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="registerForm.password" prefix-icon="el-icon-lock" placeholder="用户密码"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="registerForm.checkPass" autocomplete="off" placeholder="请重复输入用户密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            class="avatar-uploader"
            accept="image/jpeg, image/gif, image/png"
            action="#"
            :http-request="httpRequest"
            :before-upload="beforeAvatarUpload"
            :on-remove="removeAvatar"
          >
            <img v-if="registerForm.avatarHash" :src="registerForm.avatarHash" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="tns">
          <el-button type="primary" @click="register" :loading="loading">注册</el-button>
          <el-button type="info" @click="resetRegisterForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { createUser } from '@/api/login'

export default {
  data () {
    return {
      // 这是登陆表单的数据对象
      registerForm: {
        email: '',
        username: '',
        aboutMe: '',
        avatarHash: '',
        password: '',
        checkPass: ''
      },
      registerFormRules: {
        username: [
          // trigger blur触发方式为失去焦点 change为数据改变
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        checkPass: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.registerForm.password) {
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
    getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        let fileResult = ''
        reader.readAsDataURL(file)
        // 开始转
        reader.onload = function () {
          fileResult = reader.result
        }
        // 转 失败
        reader.onerror = function (error) {
          reject(error)
        }
        // 转 结束  咱就 resolve 出去
        reader.onloadend = function () {
          resolve(fileResult)
        }
      })
    },
    httpRequest (data) {
      this.getBase64(data.file).then(resBase64 => {
        this.registerForm.avatarHash = 'data:image/jpeg;base64,' + resBase64.split(',')[1]
      })
    },
    removeAvatar () {
      this.registerForm.avatarHash = ''
    },
    beforeAvatarUpload (file) {
      const isLegitimate = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLegitimate) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLegitimate && isLt2M
    },
    resetRegisterForm () {
      // #refs为vue的引用句柄，然后获取我们定义的表单并运行element ui的重置功能
      // $refs 用来调用element ui已经实现的组件方法
      this.$refs.registerFormRef.resetFields()
      this.$refs.upload.clearFiles()
      this.registerForm.avatarHash = ''
    },
    register () {
      // 表单预验证，如果验证成功发起登陆请求
      // 指定方法为异步方法，需要await进行修饰
      this.$refs.registerFormRef.validate(valid => {
        if (valid) {
          // 由于返回的信息只有data有效，所以直接可以从返回结果中获取data属性并指定其引用为res
          // 用户登陆成功之后需要把token保存到sessionStorage中
          // 1.1 除了登陆窗口，其他的API都需要登陆才能访问
          // 1.2 token只应在当前网页打开期间生效
          // 把vuex数据持久化到sessionStorage
          this.loading = true
          createUser(JSON.stringify(this.registerForm)).then(() => {
            this.loading = false
            this.$message.success('用户创建成功')
            this.$router.push({ name: 'login' })
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
<!-- scoped 只在当前页面生效 -->
<!-- less语法需要less-loader插件  -->
<style lang='less' scoped>
.register_container {
  height: 100%;
}
.register_box {
  width: 450px;
  min-height: 650px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 0 10px #ddd;
  border: 1px solid #eee; // 给图标box加边框
  // postiton 是自由移动
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee; // 给图标box加边框
    padding: 10px; // logo距离边框10px
    box-shadow: 0 0 10px #ddd; // 把图标与box边框的间距调成阴影，间距也为10px，颜色为#ddd
    border-radius: 50%; // 把box变圆滑
    position: absolute; // 把box的位置设置为自由移动
    left: 50%; // box向右偏移50%
    transform: translate(-50%, -50%); // 然后要减去自身的50%才能让中心居中
    background-color: #fff; // 设置背景色
    img {
      border-radius: 50%; // 把图标也变圆滑
      background-color: #eee; // 图标加背景色
      widows: 100%;
      height: 100%;
    }
  }
}

.register_form {
  margin-top: 20%;
  bottom: 0; // 距离底部为0
  width: 100%; // 宽度占满div
  padding: 0 20px;
  box-sizing: border-box; // 也就是说，如果你将一个元素的width设为100px，那么这100px会包含它的border和padding，内容区的实际宽度是width减去(border + padding)的值。如果不加的话会导致表单宽度溢出
}

.tns {
  display: flex; // 弹性分布
  justify-content: flex-end; // 右部对其
}

.sign {
  font-size: 30px;
  color: #969696;
  padding: 10px;
  text-decoration: none;
}

.register {
  margin-left: 20%;
  font-size: 30px;
  padding: 10px;
  text-decoration: none;
  border-bottom: 2px solid #ea6f5a;
  color: #ea6f5a;
}

.normal-title {
  margin-left: 20%;
  width: 100%;
  box-sizing: border-box;
}

.form-title {
  margin-top: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.form-item-label {
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
</style>
