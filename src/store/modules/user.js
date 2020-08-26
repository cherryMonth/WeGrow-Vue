import { login, logout, getInfo } from '@/api/login'
import { setToken, removeToken } from '@/utils/auth'
import { updateInfo } from '@/api/user'

const user = {
  // 用户的个人信息
  state: {
    userId: '',
    username: '',
    token: '',
    avatarHash: '',
    rolesList: '',
    permissionList: '',
    email: '',
    aboutMe: ''
  },
  // vuex 只能通过mutations修改属性值
  mutations: {
    changeUserName (state, username) {
      state.username = username
    },
    changeUserId (state, userId) {
      state.userId = userId
    },
    changeToken (state, token) {
      state.token = token
    },
    changeAvatarHash (state, avatarHash) {
      state.avatarHash = avatarHash
    },
    changeRolesList (state, rolesList) {
      state.rolesList = rolesList
    },
    changePermissionList (state, permissionList) {
      state.permissionList = permissionList
    },
    changeEmail (state, email) {
      state.email = email
    },
    changeAboutMe (state, aboutMe) {
      state.aboutMe = aboutMe
    },
    clear (state) {
      state.username = ''
      state.token = ''
      state.userId = ''
      state.avatarHash = ''
      state.rolesList = []
      state.permissionList = []
      state.email = ''
      state.aboutMe = ''
    }
  },
  // 向store注册的监听函数，前端可以使用dispath把信息输入到用户定义的请求函数中
  actions: {
    // userInfo为前端传输过来的Form信息
    Login ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          const tokenStr = data.data.tokenHead + ' ' + data.data.token
          setToken(tokenStr)
          commit('changeToken', tokenStr)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    Update ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        updateInfo(userInfo).then(response => {
          const data = response.data
          const tokenStr = data.data.tokenHead + ' ' + data.data.token
          setToken(tokenStr)
          commit('changeToken', tokenStr)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('clear')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data.data
          if (data.RolesList && data.RolesList.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('changeRolesList', data.RolesList)
          } else {
            reject(response)
          }
          commit('changeUserName', data.UserName)
          commit('changeAboutMe', data.AboutMe)
          commit('changeAvatarHash', data.AvatarHash)
          commit('changeUserId', data.UserId)
          commit('changePermissionList', data.PermissionList)
          commit('changeEmail', data.Email)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
