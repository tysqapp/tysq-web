<template>
  <el-dialog
    class="newsSeting_dialog"
    title="消息设置"
    :visible.sync="newsSetingVisible"
    width="30%"
    @close="close_forbid"
  >
    <div class="mb-20">
      <div class="newsSeting_first p-20">
        审核通知
      </div>
      <div class="newsSeting_second clearfix">
        <div>我的文章审核通过/驳回:</div>
        <el-checkbox v-model="news_options.article_reviewed_system">系统消息提示</el-checkbox>
        <el-checkbox v-model="news_options.article_reviewed_email">邮件通知</el-checkbox>
      </div>
      <div class="newsSeting_second clearfix" v-if="moderator">
        <div>有新的文章需要我审核:</div>
        <el-checkbox v-model="news_options.article_review_system" >系统消息提示</el-checkbox>
        <el-checkbox v-model="news_options.article_review_email" >邮件通知</el-checkbox>
      </div>
    </div>
    <div class="mb-20">
      <div class="newsSeting_first p-20">
        举报通知
      </div>
      <div class="newsSeting_second clearfix" v-if="moderator">
        <div>有新举报需要我处理:</div>
        <el-checkbox v-model="news_options.report_handler_system">系统消息提示</el-checkbox>
        <el-checkbox v-model="news_options.report_handler_email" >邮件通知</el-checkbox>
      </div>
      <div class="newsSeting_second clearfix">
        <div>我提交的举报已处理:</div>
        <el-checkbox v-model="news_options.report_handled_system">系统消息提示</el-checkbox>
        <el-checkbox style="visibility: hidden">邮件通知</el-checkbox>
      </div>
    </div>
    <div class="mb-20">
      <div class="newsSeting_first p-20">
        评论/回复通知
      </div>
      <div class="newsSeting_second clearfix">
        <div>我发布的文章有新评论:</div>
        <el-checkbox v-model="news_options.new_comment_system">系统消息提示</el-checkbox>
        <el-checkbox style="visibility: hidden">系统消息提示</el-checkbox>
      </div>
      <div class="newsSeting_second clearfix">
        <div>我发布的评论有新回复:</div>
        <el-checkbox v-model="news_options.new_reply_system" >系统消息提示</el-checkbox>
        <el-checkbox style="visibility: hidden">系统消息提示</el-checkbox>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" class="newsSeting_save" @click="save">保存</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'news-setting',
  props: {
    modalNewsSetingShow: Boolean,
    news_seting: Object
  },
  data () {
    return {
      newsSetingVisible: false,
      moderator: false,
      news_options: {}
    }
  },
  mounted () {
    if (this.Cookies.get('info')) {
      if (JSON.parse(this.Cookies.get('info')).is_moderator) {
        this.moderator = true
      } else {
        this.moderator = false
      }
    }
  },
  watch: {
    modalNewsSetingShow (val) {
      if (val) {
        this.newsSetingVisible = val
      } else {
        this.newsSetingVisible = false
      }
    },
    news_seting (val) {
      if (val) {
        this.news_options = val
      }
    }
  },
  methods: {
    close_forbid () {
      this.$emit('update:modalNewsSetingShow', false)
    },
    save () {
      this.http.Updatesubconfigs(this.news_options).then(res => {
        if (res.status === 0) {
          this.$toast('设置成功', 2000, 'common')
          this.$emit('update:modalNewsSetingShow', false)
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    }
  }
}
</script>

<style scoped>
  .newsSeting_first{
    background-color: #EAF0FE;
    font-size:15px;
    font-weight:bold;
    color:rgba(36,41,50,1);
  }
  .newsSeting_second{
    font-size:14px;
    font-weight:400;
    color:rgba(51,51,51,1);
    display: flex;
    justify-content: space-between;
    border: 1px solid #EAF0FE;
    padding: 15px 20px;
    position: relative;
    margin-top: -1px;
  }
  .newsSeting_save{
    background-color: #409eff;
    padding: 10px 40px;
  }
</style>
<style>
  .newsSeting_dialog .el-dialog{
    min-width: 460px;
  }
  .newsSeting_dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .newsSeting_dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .newsSeting_dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .newsSeting_dialog .el-dialog__footer{
    text-align: center;
  }
  .newsSeting_dialog .el-dialog__body{
    padding: 15px 20px 0 20px;
  }
  @media only screen and (max-width: 768px) {
    .newsSeting_dialog .el-dialog{
      min-width: 350px;
    }
  }
</style>
