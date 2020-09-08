<template>
  <div id="Draft" style="width: 960px;margin: auto;">
    <el-container>
      <div v-wechat-title="$route.meta.title=title"></div>
      <el-container style="box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);">
        <el-main>
          <div v-for="(item, $index) in targetlist.List" :key="$index">
            <el-row :gutter="10">
              <router-link
                style="text-decoration: none;"
                :to="{name: 'edit_block', query: {id: item.id}}"
              >
                <h1 class="el-block-title">{{item.title}}</h1>
              </router-link>
              <el-col :span="1">
                <v-avatar :rounded="false" class="el-user-vatar">
                  <img :src="$store.getters.avatarHash" :alt="$store.getters.avatarHash" />
                </v-avatar>
              </el-col>
              <el-col :span="1" style="min-width: 350px;text-align: left;margin-left: 20px;">
                <router-link
                  style="text-decoration: none;"
                  class="el-block-username"
                  :to="{name: 'user_information', params: {id: $store.getters.userId}}"
                >{{$store.getters.username}}</router-link>
                <br />
                <el-link
                  :underline="false"
                  class="el-block-info"
                  style=" color: rgb(96, 98, 102);"
                >{{$store.getters.aboutMe}}</el-link>
              </el-col>
            </el-row>
            <el-row style="margin-top: 5px; text-align: left">
              <el-col :span="5" v-if="item.blockImage">
                <el-image :src="item.blockImage" lazy class="el-block-image"></el-image>
              </el-col>
              <el-col
                style="width: word-wrap:break-word;word-break:break-all; "
              >{{item.blockContent}}</el-col>
            </el-row>
            <el-divider class="el-divider"></el-divider>
          </div>
          <el-row>
            <el-col>
              <div class="text-center">
                <v-container>
                  <v-row justify="center">
                    <v-col cols="8">
                      <v-container class="max-width">
                        <v-pagination
                          v-model="targetlist.pageNum"
                          class="my-4"
                          :length="targetlist.totalPage"
                          @input="getBlockPagination"
                        ></v-pagination>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getBlockListByUserIdPagePagination } from '@/api/block'

export default {
  data () {
    return {
      title: '草稿箱',
      loading: false,
      notifyPromise: Promise.resolve(),
      targetlist: {
        pageSize: 5,
        pageNum: 1,
        totalPage: 0,
        List: []
      },
      timeout: null
    }
  },
  mounted () {
    this.infiniteHandler()
    this.getBlockPagination()
  },
  methods: {
    getBlockListByUserIdPagePagination,
    getBlockPagination () {
      getBlockListByUserIdPagePagination({ pageNum: this.targetlist.pageNum, pageSize: this.targetlist.pageSize, status: 2 }).then(response => {
        console.log(response.data.data)
        response.data.data.blockList.forEach(element => {
          if (element.blockContent.length > 200) {
            element.css = true
            element.blockContent = element.blockContent.substr(0, 200) + '...'
          } else {
            element.css = false
          }
        })
        this.targetlist.List = response.data.data.blockList
        console.log(response.data.data)
        this.targetlist.totalPage = response.data.data.pagePaginationNum
        this.loading = false
      })
      console.log(this.targetlist.List)
    },
    infiniteHandler () {
      if (this.$store.getters.rolesList.length === 0) {
        this.$store.dispatch('GetInfo').then(res => {
          this.loading = true
        }).catch(err => {
          // 如果请求失败，则自动注销并返回到登录页面
          this.$store.dispatch('LogOut').then(() => {
            this.$message.error(err || 'Verification failed, please login again')
          })
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
html {
  overflow: hidden;
}

.el-block-header {
  color: #333;
  top: 0;
  text-align: center;
  line-height: 60px;
}

.el-block-main {
  color: #333;
  margin-top: 80px;
  text-align: center;
}

.el-aside {
  position: sticky;
  top: 0;
  margin-left: 10px;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  color: #333;
}

.el-tab {
  float: left;
  font-weight: 600;
}

.el-user-vatar {
  height: 38px;
  width: 38px;
  top: 1px;
}

.el-block-title {
  text-align: left;
  padding: 8px;
  color: black;
  font-weight: 600;
  font-family: Helvetica Neue;
  font-size: 18px;
}

.el-block-username {
  color: #606266;
  font-weight: 600;
  font-family: Helvetica Neue;
  font-size: 15px;
}

.el-block-info {
  cursor: default;
  font-family: Helvetica Neue;
  font-size: 10px;
}

.el-divider {
  border-top: 1px dashed #e8eaec;
  margin: 8px 0;
  background: 0 0;
}

.el-block-image {
  height: 100px;
  border-radius: 5px;
  padding-right: 15px;
}
</style>
