import Vue from 'vue'

// 在不允许多次import 同一组件，会报错
import { Button, Form, FormItem, Input, Message, Header, Main, Footer, Container, Row, Col } from 'element-ui'

// 组件注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Container)
Vue.use(Row)
Vue.use(Col)

// 把message挂载到prototype上
Vue.prototype.$message = Message
