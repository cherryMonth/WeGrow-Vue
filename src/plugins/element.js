import Vue from 'vue'

// 在不允许多次import 同一组件，会报错
import { Button, Form, FormItem, Input } from 'element-ui'

// 组件注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
