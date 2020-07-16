const getters = {
  username: state => state.user.username,
  token: state => state.user.token,
  avatarHash: state => state.user.avatarHash,
  rolesList: state => state.user.rolesList,
  permissionList: state => state.user.permissionList,
  email: state => state.user.email,
  aboutMe: state => state.user.aboutMe,
  userId: state => state.user.userId
}
export default getters
