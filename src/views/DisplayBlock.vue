<template>
  <el-container id="editor" class="editor-preview" :center="true">
    <div v-wechat-title="$route.meta.title=block.title"></div>
    <el-main class="main-container">
      <el-row v-if="block.blockImage">
        <el-col :span="1" :offset="6">
          <div class="demo-image__lazy">
            <el-image :src="block.blockImage" lazy class="el-block-image"></el-image>
          </div>
        </el-col>
      </el-row>
      <h1
        :class="{'el-user-image-profile': block.blockImage, 'el-user-profile': !block.blockImage}"
      >{{block.title}}</h1>
      <!-- 使用户信息行与文章内容同列，并且位置不随着窗口变化而变化 -->
      <el-row>
        <el-col :span="1" :offset="6">
          <v-avatar rounded="false">
            <img :src="user.avatar" :alt="user.username" />
          </v-avatar>
        </el-col>
        <el-col :span="1" style="min-width: 200px;">
          <el-link
            :underline="false"
            style="color: #606266; font-weight: 600; float: left"
          >{{user.userName}}</el-link>
          <br />
          <el-link
            :underline="false"
            style="color: #606266; cursor: default; float: left"
          >{{user.aboutMe}}</el-link>
        </el-col>
        <el-col :span="1" style="margin-left: 460px">
          <el-button type="primary">+关注他</el-button>
        </el-col>
      </el-row>
      <mavon-editor
        class="editor"
        :value="block.blockContent"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :boxShadowStyle="boxShadowStyle()"
        :box-shadow="true"
        :scrollStyle="true"
        :ishljs="true"
      />
    </el-main>
    <el-footer style="width: 860px">
      <el-row>
        <el-col :offset="10">
          <div id="emoji">
            <a-avatar
              slot="avatar"
              :src="$store.getters.avatarHash"
              :alt="$store.getters.username"
            />
            <el-row>
              <el-col :span="18">
                <v-textarea
                  v-model="commentParams.content"
                  label="在此分享您的想法吧~"
                  :auto-grow="true"
                  :full-width="true"
                  counter
                  required
                  :solo="true"
                  :rules="rules"
                  :rows="1"
                ></v-textarea>
              </el-col>
              <el-col style="margin-top: 20px; margin-left: 10px" :span="1">
                <v-icon
                  large
                  :title="emoji ? '点击关闭表情栏' : '点击开启表情栏'"
                  @click="emoji = !emoji"
                  :style="{ color: emoji ? '#409EFF' : '' }"
                >sentiment_satisfied_alt</v-icon>
              </el-col>
              <el-col style="margin-top: 15px;" :span="3" :offset="1">
                <v-btn large color="#409EFF" style="color: white" @click="handleSubmit">发布</v-btn>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="emoji">
        <el-col :offset="10">
          <VEmojiPicker @select="selectEmoji" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="10">
          <a-list
            class="comment-list"
            :header="`${commentList.length} replies`"
            item-layout="horizontal"
            :data-source="commentList"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a-comment :author="item.userName" :avatar="item.avatarHash">
                <p slot="content">{{ item.content }}</p>
                <a-tooltip
                  slot="datetime"
                  :title="moment(item.createTime,'YYYY-MM-DD HH:mm:ss').fromNow()"
                >
                  <span>{{ moment(item.createTime,'YYYY-MM-DD HH:mm:ss').fromNow() }}</span>
                </a-tooltip>

                <el-row style="min-width: 800px">
                  <el-col
                    :span="2"
                    v-if="item.id !=  commentParams.commentId || commentParams.commentType != 'comment'"
                  >
                    <span
                      class="el-icon-chat-dot-round comment-list"
                      @click="setReplyId(item.id, item.userId, 'comment')"
                    >回复</span>
                  </el-col>
                  <el-col :span="3" v-else>
                    <span class="el-icon-chat-dot-round comment-list" @click="unsetReplyId()">取消回复</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="el-icon-caret-top comment-list">点赞</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="el-icon-caret-bottom comment-list">踩</span>
                  </el-col>
                </el-row>

                <el-row
                  :gutter="25"
                  :key="item.id"
                  v-if="item.id ===  commentParams.commentId && commentParams.commentType === 'comment'"
                  style="min-width: 600px"
                >
                  <el-col :span="18">
                    <v-textarea
                      label="在此分享您的想法吧~"
                      v-model="commentParams.replyContent"
                      :auto-grow="true"
                      :full-width="true"
                      counter
                      :solo="true"
                      :rules="reply_rules"
                      :rows="1"
                    ></v-textarea>
                  </el-col>
                  <el-col style="margin-top: 20px; margin-left: 10px" :span="1">
                    <v-icon
                      large
                      :title="reply_emoji ? '点击关闭表情栏' : '点击开启表情栏'"
                      @click="reply_emoji = !reply_emoji"
                      :style="{ color: reply_emoji ? '#409EFF' : '' }"
                    >sentiment_satisfied_alt</v-icon>
                  </el-col>
                  <el-col style="margin-top: 15px;" :span="3" :offset="1">
                    <v-btn large color="#409EFF" style="color: white" @click="handleReplySubmit">发布</v-btn>
                  </el-col>
                  <el-col v-if="reply_emoji">
                    <VEmojiPicker @select="selectReplyEmoji" />
                  </el-col>
                </el-row>

                <div
                  :key="reply.id"
                  v-for="reply in item.reply"
                  style="padding: 16px 0;border-top: 1px solid #e8e8e8;"
                >
                  <div>
                    <a-avatar :src="reply.replyAvatarHash" :alt="user.userName" />
                    <a>{{reply.replyName}}</a>
                    回复
                    <a-avatar :src="reply.userAvatarHash" :alt="reply.replyName" />
                    <a>{{reply.userName}}</a>
                    <a-tooltip
                      slot="datetime"
                      :title="moment(reply.createTime,'YYYY-MM-DD HH:mm:ss').fromNow()"
                    >
                      <span
                        class="ant-comment-content-author-time comment-time"
                      >{{ moment(reply.createTime,'YYYY-MM-DD HH:mm:ss').fromNow() }}</span>
                    </a-tooltip>
                    <p style="margin-left: 35px">{{ reply.replyContent }}</p>

                    <el-row style="min-width: 800px;margin-left: 35px">
                      <el-col
                        :span="2"
                        v-if="reply.id !=  repliedId || commentParams.commentType != 'reply'"
                      >
                        <span
                          class="el-icon-chat-dot-round comment-list"
                          @click="setRepliedId(reply.id, item.id, reply.userId, 'reply')"
                        >回复</span>
                      </el-col>
                      <el-col :span="3" v-else>
                        <span
                          class="el-icon-chat-dot-round comment-list"
                          @click="unsetRepliedId()"
                        >取消回复</span>
                      </el-col>
                      <el-col :span="2">
                        <span class="el-icon-caret-top comment-list">点赞</span>
                      </el-col>
                      <el-col :span="2">
                        <span class="el-icon-caret-bottom comment-list">踩</span>
                      </el-col>
                    </el-row>

                    <el-row
                      :gutter="25"
                      :key="reply.id"
                      v-if="reply.id ===  repliedId && commentParams.commentType === 'reply'"
                      style="min-width: 600px;margin-left: 25px"
                    >
                      <el-col :span="18">
                        <v-textarea
                          label="在此分享您的想法吧~"
                          v-model="commentParams.replyContent"
                          :auto-grow="true"
                          :full-width="true"
                          counter
                          :solo="true"
                          :rules="reply_rules"
                          :rows="1"
                        ></v-textarea>
                      </el-col>
                      <el-col style="margin-top: 20px; margin-left: 10px" :span="1">
                        <v-icon
                          large
                          :title="reply_emoji ? '点击关闭表情栏' : '点击开启表情栏'"
                          @click="reply_emoji = !reply_emoji"
                          :style="{ color: reply_emoji ? '#409EFF' : '' }"
                        >sentiment_satisfied_alt</v-icon>
                      </el-col>
                      <el-col style="margin-top: 15px;" :span="3" :offset="1">
                        <v-btn
                          large
                          color="#409EFF"
                          style="color: white"
                          @click="handleReplySubmit"
                        >发布</v-btn>
                      </el-col>
                      <el-col v-if="reply_emoji">
                        <VEmojiPicker @select="selectReplyEmoji" />
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </a-comment>
            </a-list-item>
          </a-list>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="12">
          <div class="text-center">
            <v-container>
              <v-row justify="center">
                <v-col cols="8">
                  <v-container class="max-width">
                    <v-pagination
                      v-model="comment.pageNum"
                      class="my-4"
                      :length="comment.pagePaginationNum"
                      @input="getCommentPagination"
                    ></v-pagination>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import { getUserBlock } from '@/api/block'
import { getUserSummaryInfo } from '@/api/login'
import { getCommentList, createComment, createReplyComment } from '@/api/comment'
import moment from 'moment'
import VEmojiPicker from 'v-emoji-picker'

moment.locale('zh-cn')
export default {
  components: {
    VEmojiPicker
  },
  data () {
    return {
      emoji: false,
      repliedId: '',
      rules: [result => this.commentParams.content.length <= 140 || 'Max 140 characters'],
      reply_rules: [result => this.commentParams.replyContent.length <= 140 || 'Max 140 characters'],
      reply_emoji: false,
      // 记录评论的属性信息
      comment: {
        targetType: 'block',
        targetId: this.$route.params.id,
        pageNum: 1,
        pageSize: 5,
        pagePaginationNum: 0
      },
      // 提交的评论参数
      commentParams: {
        content: '',
        replyContent: '',
        targetType: 'block',
        pageSize: 5,
        targetId: this.$route.params.id,
        commentId: '',
        userId: '',
        commentType: ''
      },
      commentList: [
      ],
      block: {
        title: '',
        topicId: '',
        status: '1', // 默认是直接发布状态
        blockContent: '',
        blockImage: ''
      },
      user: {
        userId: '',
        userName: '',
        aboutMe: '',
        avatar: ''
      }
    }
  },
  methods: {
    boxShadowStyle () {
      return 'rgba(0, 0, 0)'
    },
    moment,
    getCommentPagination () {
      getCommentList(this.comment).then(response => {
        this.commentList = response.data.data.commentList
        this.comment.pagePaginationNum = response.data.data.pagePaginationNum
      })
    },
    handleSubmit () {
      if (this.commentParams.content.length === 0 || this.commentParams.content.length > 140) {
        this.$notify({
          message: '评论内容长度不符合要求哦~',
          type: 'warning',
          duration: 3000
        })
        return
      }
      createComment(this.commentParams).then(response => {
        if (response.data.code === 200) {
          this.$notify({
            message: '添加评论成功',
            type: 'success',
            duration: 3000
          })
          this.emoji = false
          this.commentParams.content = ''
          this.comment.pageNum = response.data.data
          getCommentList(this.comment).then(response => {
            this.commentList = response.data.data.commentList
            this.comment.pagePaginationNum = response.data.data.pagePaginationNum
          })
        }
      })
    },
    handleReplySubmit () {
      if (this.commentParams.replyContent.length === 0 || this.commentParams.replyContent.length > 140) {
        this.$notify({
          message: '回复内容不符合要求哦~',
          type: 'warning',
          duration: 3000
        })
        return
      }
      createReplyComment(this.commentParams).then(response => {
        if (response.data.code === 200) {
          this.$notify({
            message: '回复评论成功',
            type: 'success',
            duration: 3000
          })
          this.unsetReplyId()
          this.comment.pageNum = response.data.data
          getCommentList(this.comment).then(response => {
            this.commentList = response.data.data.commentList
            this.comment.pagePaginationNum = response.data.data.pagePaginationNum
          })
        }
      })
    },
    selectEmoji (emoji) {
      this.commentParams.content += emoji.data
    },
    selectReplyEmoji (emoji) {
      this.commentParams.replyContent += emoji.data
    },
    setReplyId (id, userId, type) {
      this.commentParams.commentId = id
      this.emoji = false
      this.commentParams.userId = userId
      this.commentParams.commentType = type
      this.commentParams.replyContent = ''
    },
    setRepliedId (id, commentId, userId, type) {
      this.repliedId = id
      this.setReplyId(commentId, userId, type)
    },
    unsetRepliedId () {
      this.repliedId = ''
      this.unsetReplyId()
    },
    unsetReplyId () {
      this.commentParams.commentId = ''
      this.emoji = false
      this.repliedId = ''
      this.commentParams.commentType = ''
      this.commentParams.replyContent = ''
    }
  },
  mounted () {
    moment.locale()
    if (this.$route) {
      this.loading = true
      getUserBlock(this.$route.params.id).then(response => {
        if (response.data.code === 200) {
          this.block.title = response.data.data.title
          this.block.blockContent = response.data.data.blockContent
          this.block.topicId = response.data.data.topicId
          this.block.userId = response.data.data.userId
          this.block.blockImage = response.data.data.blockImage
          getUserSummaryInfo(this.block.userId).then(response => {
            this.user.userName = response.data.data.userName
            this.user.aboutMe = response.data.data.aboutMe || '这个人很懒什么都没留下~'
            this.user.avatar = response.data.data.avatarHash
          })
          getCommentList(this.comment).then(response => {
            this.commentList = response.data.data.commentList
            this.comment.pagePaginationNum = response.data.data.pagePaginationNum
          })
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.editor-preview {
  padding: 0 20px;
  margin-top: 1%;
  z-index: 0;
  position: relative;
}

.editor {
  min-height: 10vh;
  width: 800px;
  left: 25%; // box向右偏移50%
}

.el-main {
  color: #333;
  padding: 0;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-block-image {
  width: 800px;
  height: 500px;
}

.el-user-profile {
  margin-top: 20px;
  margin-left: 25%;
  text-align: left;
  margin-bottom: 10px;
}

.el-user-image-profile {
  margin-left: 25%;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
}

.comment-time {
  padding-right: 8px;
  padding-left: 8px;
  font-size: 12px;
  line-height: 18px;
}

.comment-list {
  font-size: 16px;
}
</style>
