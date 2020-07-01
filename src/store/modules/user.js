const user = {
  state: {
    username: '',
    token: '',
    avatarHash: '',
    rolesList: '',
    permissionList: '',
    email: '',
    aboutMe: ''
  },
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
    }
  }
}

export default user
