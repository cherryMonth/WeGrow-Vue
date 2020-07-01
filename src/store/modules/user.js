const user = {
  // 用户的个人信息
  state: {
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
      state.avatarHash = ''
      state.rolesList = ''
      state.permissionList = ''
      state.email = ''
      state.aboutMe = ''
    }
  }
}

export default user
