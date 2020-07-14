import Vue from 'vue'

// 在不允许多次import 同一组件，会报错
import { Button, Form, FormItem, Input, Message, Header, Main, Footer, Container, Row, Col, Upload, Table, Loading, Notification, Select, Option } from 'element-ui'

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
Vue.use(Upload)
Vue.use(Table)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading.directive)
Vue.component(Notification.name, Notification)

// 把message挂载到prototype上
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
