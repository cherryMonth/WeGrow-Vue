const getters = {
  username: state => state.user.username,
  token: state => state.user.token,
  avatarHash: state => state.user.avatar,
  rolesList: state => state.user.name,
  permissionList: state => state.user.roles,
  email: state => state.permission.addRouters,
  AboutMe: state => state.permission.routers
}
export default getters
