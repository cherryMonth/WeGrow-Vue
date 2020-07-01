import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import getters from '@/store/getters'

Vue.use(Vuex)

user.getters = getters

const store = new Vuex.Store(
  user
)

export default store
