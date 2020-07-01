<template>
    <div class="login_container">
      <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
          <img src="../assets/logo.png" alt />
        </div>
        <!-- 登陆表单区域 -->
        <!-- 数据绑定, ref即为该表单的引用，可以再script区域对表单进行操作 -->
        <el-form
          label-width="0px"
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          class="login_form"
        >
          <!-- 用户名，校验需要将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
          <el-form-item prop="username">
            <!-- 绑定数据对象到属性 -->
            <!-- el-input的属性不能以空格结尾 -->
            <!-- 双向绑定到对象属性 -->
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="tns">
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登陆表单的数据对象
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单
    resetLoginForm () {
      // #refs为vue的引用句柄，然后获取我们定义的表单并运行element ui的重置功能
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 表单预验证，如果验证成功发起登陆请求
      // 指定方法为异步方法，需要await进行修饰
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          // 由于返回的信息只有data有效，所以直接可以从返回结果中获取data属性并指定其引用为res
          const { data: res } = await this.$http.post(
            '/user/login',
            this.loginForm
          )
          if (res.code !== 200) {
            return this.$message.error('用户登陆出错了哦。。。')
          }
          this.$message.success('用户登陆成功')
          // 用户登陆成功之后需要把token保存到sessionStorage中
          // 1.1 除了登陆窗口，其他的API都需要登陆才能访问
          // 1.2 token只应在当前网页打开期间生效
          this.$store.commit('changeToken', res.data.tokenHead + ' ' + res.data.token)

          // 把vuex数据持久化到sessionStorage
          sessionStorage.setItem('store', JSON.stringify(this.$store.state))
          await this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<!-- scoped 只在当前页面生效 -->
<!-- less语法需要less-loader插件  -->
<style lang='less' scoped>
.login_container {
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
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

.login_form {
  position: absolute;
  bottom: 0; // 距离底部为0
  width: 100%; // 宽度占满div
  padding: 0 20px;
  box-sizing: border-box; // 也就是说，如果你将一个元素的width设为100px，那么这100px会包含它的border和padding，内容区的实际宽度是width减去(border + padding)的值。如果不加的话会导致表单宽度溢出
}

.tns {
  display: flex; // 弹性分布
  justify-content: flex-end; // 右部对其
}
</style>
