<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <div class="set-news-box border-radius-4">
          <div class="head-title clearfix">
            <span class="pull-left">通知</span>
            <span class="pull-right news-setting" @click="seting">设置</span>
            <span class="pull-right all-readed" @click="allReaded">全部标记为已读</span>
          </div>
          <div class="set-news-info">
              <ul>
                <li class="clearfix" v-for="(item,index) in notify_info" :key="index" v-if="notify_info.length>0">
                  <div class="float-left news-img">
                    <el-badge :is-dot="!item.is_read" class="new_icon_note" v-if="item.remind_type==='审核通知'"> <img src="../../assets/news.png" alt="消息"></el-badge>
                    <el-badge :is-dot="!item.is_read" class="new_icon_note" v-if="item.remind_type==='评论通知'"> <img :src="item.avatar_url" alt="头像" width="60" height="60" style="border-radius: 30px" ></el-badge>
                    <el-badge :is-dot="!item.is_read" class="new_icon_note" v-if="item.remind_type==='举报通知'"> <img src="../../assets/jubao.png" alt="举报" width="60" height="60" style="border-radius: 30px"></el-badge>
                    <el-badge :is-dot="!item.is_read" class="new_icon_note" v-if="item.remind_type==='分类删除通知'"> <img src="../../assets/shanchu.png" alt="删除"></el-badge>
                  </div>
                  <div class="float-left news-content">
                     <div>
                       <span class="news-title" v-if="item.remind_type==='审核通知' || item.remind_type==='举报通知' || item.remind_type==='分类删除通知'">{{item.remind_type}}</span>
                       <span class="news-title sender-name" style="cursor: pointer;" v-else @click="goToHim(item.sender,item.notify_id)">{{item.sender_name}}</span>
                       <span class="news-time">{{item.time}}</span>
                     </div>
                     <div class="news-details" v-html="item.content"></div>
                  </div>
                </li>
              </ul>
              <div class="no_passage"  v-if="notify_info.length===0&&res_flag">
              <p><img src="../../assets/news_note.png"></p>
              <p class="fs-16 text-999">暂无通知</p>
            </div>
              <div class="box-pagination" v-if="total>20">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 30]"
                :page-size="size"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <news-seting :modalNewsSetingShow.sync="newsDiglog" :news_seting="newsSetingData"></news-seting>
    <el-dialog class="news-details-dialog" title="举报详情" :visible.sync="accusationVisible">
      <div class="accusation-content p-20">
        <div class="clearfix">
          <div class="float-left left-postion">被举报文章:</div>
          <router-link class="float-left ml-10 title" :to="`/article/info?article_id=${reportInfo.article_id}`">《{{reportInfo.title}}》</router-link>
       </div>
       <div class="clearfix mt-10">
         <div class="float-left left-postion">举报内容:</div>
         <div class="float-left ml-20">
           <div class="title">{{reportInfo.type}}</div>
           <div class="content">{{reportInfo.note}}</div>
         </div>
       </div>
       <div class="clearfix mt-10">
         <div class="float-left left-postion">处理结果:</div>
         <div class="float-left ml-20">
           <div class="title">{{reportInfo.result}}</div>
           <div class="content">{{reportInfo.process_reason}}</div>
         </div>
       </div>
       <div class="clearfix mt-10">
         <div class="float-left left-postion ">举报编号:</div>
         <div class="float-left ml-10 title">{{reportInfo.report_id}}</div>
       </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '../../store/index'
import newsSeting from '../../components/news-setting'
export default {
  data () {
    return {
      newsDiglog: false,
      accusationVisible: false,
      total_number: 0,
      res_flag: false,
      more_news: 0,
      start: 0,
      newsSetingData: {},
      notify_info: [],
      reportInfo: {},
      // 页码
      total: 0,
      size: 20,
      currentPage: 1
    }
  },
  components: {
    'news-seting': newsSeting
  },
  inject: ['reload'],
  mounted () {
    this.notificationsList({size: 20})
    let _this = this
    setTimeout(function () {
      _this.$nextTick().then(() => {
        $('.set-news-info').delegate('.sendMessages', 'click', function () {
          if (JSON.parse($(this).attr('data-isRead'))) {
            console.log('已读')
          } else {
            // let remindId = $(this).attr('data-remindId')
            // let notifyIinfo = _this.notify_info
            // _this.socketApi.sendSock({code: 5, data: {remind_id: remindId}})
            // for (let i = 0; i < notifyIinfo.length; i++) {
            //   if (notifyIinfo[i].remind_id === remindId) {
            //     notifyIinfo[i].is_read = !notifyIinfo[i].is_read
            //     $(this).attr('data-isRead', true)
            //     break
            //   }
            // }
          }
          if (JSON.parse($(this).attr('data-isRead'))) {
          } else {
            _this.updateRead({notify_id: $(this).attr('data-notifyId')})
            _this.unreadCount()
          }
          window.open('#/article/info?article_id=' + $(this).attr('data-articleId'), '_blank')
        })
        $('.set-news-info').delegate('.dialogDetail', 'click', function () {
          _this.accusationVisible = true
          _this.reportsDetails($(this).attr('data-reportId'), {})
          if (JSON.parse($(this).attr('data-isRead'))) {
          } else {
            _this.updateRead({notify_id: $(this).attr('data-notifyId')})
            _this.unreadCount()
          }
        })
        $('.set-news-info').delegate('.sender_name_title', 'click', function () {
          if (JSON.parse($(this).attr('data-isRead'))) {
          } else {
            _this.updateRead({notify_id: $(this).attr('data-notifyId')})
            _this.unreadCount()
          }
          window.open('#/otherUserInfo?account_id=' + $(this).attr('data-accountId'), '_blank')
        })
        $('.set-news-info').delegate('.goDetai', 'click', function () {
          if (JSON.parse($(this).attr('data-isRead'))) {
          } else {
            _this.updateRead({notify_id: $(this).attr('data-notifyId')})
            _this.unreadCount()
          }
          window.open('#/accusation?report_id=' + $(this).attr('data-reportNumber'), '_blank')
        })
        $('.set-news-info').delegate('.editArticle', 'click', function () {
          if (JSON.parse($(this).attr('data-isRead'))) {
          } else {
            _this.updateRead({notify_id: $(this).attr('data-notifyId')})
            _this.unreadCount()
          }
          window.open('#/articleEditor?article_id=' + $(this).attr('data-articleId'), '_blank')
        })
      })
    }, 1000)
  },
  methods: {
    updateRead (params) {
      this.http.putReaded(params).then(res => {
        if (res.status === 0) {
          this.notificationsList({size: this.size, start: this.start})
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    notificationsList (params) {
      this.res_flag = false
      this.http.notifications(params).then(res => {
        this.res_flag = true
        if (res.status === 0) {
          this.total = res.data.total_number
          if (res.data.notify_info) {
            res.data.notify_info.forEach(item => {
              item.time = this.getTime(item.time)
              item.avatar_url = item.avatar_url ? item.avatar_url : require('../../../static/images/toux.png')
              item.is_read = item.is_read
              if (item.action === 'article_review') {
                item.content = `<span style="color:#F3842B;cursor: pointer" class="sender_name_title" data-isRead="${item.is_read}" data-accountId="${item.sender}" data-notifyId="${item.notify_id}">${item.sender_name}</span>发布文章 <span style="color:#F3842B;cursor: pointer" class="sendMessages" data-isRead="${item.is_read}"  data-remindId="${item.remind_id}" data-reportId="${item.report_id}" data-articleId="${item.article_id}" data-notifyId="${item.notify_id}">《${item.title}》</span>，去审核吧。`
              } else if (item.action === 'review_pass') {
                item.content = `你的文章<span style="color:#F3842B; cursor: pointer" class="sendMessages" data-isRead="${item.is_read}"  data-remindId="${item.remind_id}" data-reportId="${item.report_id}" data-articleId="${item.article_id}" data-notifyId="${item.notify_id}">《${item.title}》</span>,已通过审核。`
              } else if (item.action === 'review_unpass') {
                item.content = `很抱歉，你的文章<span style="color:#F3842B;cursor: pointer" class="sendMessages" data-isRead="${item.is_read}"  data-remindId="${item.remind_id}" data-reportId="${item.report_id}" data-articleId="${item.article_id}" data-notifyId="${item.notify_id}">《${item.title}》</span>,未通过审核。`
              } else if (item.action === 'article_new_comment') {
                item.content = `评论你的文章 <span style="color:#F3842B;cursor: pointer" class="sendMessages" data-isRead="${item.is_read}"  data-remindId="${item.remind_id}" data-reportId="${item.report_id}" data-articleId="${item.article_id}" data-notifyId="${item.notify_id}">《${item.title}》</span>`
              } else if (item.action === 'comment_new_reply') {
                item.content = `回复你在 <span style="color:#F3842B;cursor: pointer" class="sendMessages" data-isRead="${item.is_read}"  data-remindId="${item.remind_id}" data-reportId="${item.report_id}" data-articleId="${item.article_id}" data-notifyId="${item.notify_id}">《${item.title}》</span>的评论`
              } else if (item.action === 'effective_report_handler') {
                item.content = `你提交的举报已处理！处理结果：有效举报，赠送1000积分；<span class="text-primary dialogDetail" data-isRead="${item.is_read}" style="cursor: pointer" data-reportId="${item.report_id}" data-notifyId="${item.notify_id}">查看详情<span/>`
              } else if (item.action === 'invalid_report_handler') {
                item.content = `你提交的举报已处理！处理结果：无效举报；<span class="text-primary dialogDetail" data-isRead="${item.is_read}" style="cursor: pointer" data-reportId="${item.report_id}" data-notifyId="${item.notify_id}">查看详情<span/>`
              } else if (item.action === 'new_report_handler') {
                item.content = `<span style="color:#F3842B;cursor: pointer"  class="sender_name_title" data-isRead="${item.is_read}" data-accountId="${item.sender}" data-notifyId="${item.notify_id}">${item.sender_name}</span>举报文章 <span style="color:#F3842B;cursor: pointer" class="sendMessages" data-isRead="${item.is_read}"  data-remindId="${item.remind_id}" data-reportId="${item.report_id}" data-articleId="${item.article_id}" data-notifyId="${item.notify_id}">《${item.title}》</span>，请尽快处理！<span class="ml-10 text-primary goDetai" data-isRead="${item.is_read}" style="cursor: pointer" data-reportId="${item.report_id}" data-notifyId="${item.notify_id}" data-reportNumber="${item.report_number}">举报编号：${item.report_number}</span>`
              } else if (item.action === 'delete_category') {
                item.content = `文章 <span style="color:#F3842B;cursor: pointer" class="editArticle" data-isRead="${item.is_read}"  data-remindId="${item.remind_id}" data-reportId="${item.report_id}" data-articleId="${item.article_id}" data-notifyId="${item.notify_id}">《${item.title}》</span>，选择的分类已删除，请重新选择！`
              }
            })
            this.notify_info = res.data.notify_info
          } else {
            this.notify_info = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    reportsDetails (id, params) {
      this.http.reportsDetails(id, params).then(res => {
        if (res.status === 0) {
          this.reportInfo = res.data
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    more () {
      this.start = this.start + 20
      this.notificationsList({size: this.size, start: this.start})
    },
    new_config () {
      this.http.subconfigs().then(res => {
        if (res.status === 0) {
          this.newsSetingData = res.data
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    seting () {
      this.newsDiglog = true
      this.new_config()
    },
    allReaded () {
      this.http.setAllRead().then(res => {
        if (res.status === 0) {
          if (res.data.is_un_read === true) {
            this.$toast('标记成功', 2000, 'common')
            this.notificationsList({size: this.size, start: this.start})
            // this.reload()
            this.unreadCount()
          } else {
            this.$toast('当前没有未读通知', 2000, 'error')
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    goToHim (id, notifyId) {
      this.updateRead({notify_id: notifyId})
      this.unreadCount()
      let routeData = this.$router.resolve({path: '/otherUserInfo?account_id=' + id})
      window.open(routeData.href, '_blank')
    },
    unreadCount () {
      this.http.getUnreadCount().then(res => {
        if (res.status === 0) {
          store.commit('newsCountData', res.data.unread_count)
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.currentPage = 1
      this.notificationsList({size: this.size})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.start = (Number(val) - 1) * this.size
      this.notificationsList({size: this.size, start: this.start})
    }
  }
}
</script>

<style scoped>
  .main-container>.view{
    width: 100%;
  }
  .accusation-content .title{
    color: #242932;
    font-size: 16px;
  }
  .accusation-content .title:hover{
    color: #598CF2;
  }
  .accusation-content .content{
    color: #666666;
    font-size: 14px;
    max-width: 400px;
  }
  .left-postion{
    width: 100px;
    line-height:30px;
    font-size: 16px;
    font-weight:400;
    color:rgba(51,51,51,1);
    text-align: right;
  }
  .no_passage{
    background: #ffffff;
    height: calc(100vh - 150px);
    padding-top: 100px;
    margin-top: 0;
    width: 100%;
    text-align: center;
  }
  .set-news-box{
    background: #ffffff;
    border-radius:10px;
  }
  .set-news-box .head-title{
    padding: 20px 5px;
    font-size: 18px;
    line-height: 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  .set-news-box .head-title span{
    margin: 0 25px;
  }
  .set-news-box .head-title .news-setting,.set-news-box .head-title .all-readed{
    color: #409EFF;
    font-size: 16px;
    cursor: pointer;
  }
  .set-news-info{
   padding: 0 30px 20px 30px;
  }
  .set-news-info .news-title{
      color: #333;
      font-size: 16px;
     font-family:PingFang SC;
      font-weight: bold;
  }
  .set-news-info .news-title.sender-name:hover{
    color: #F3842B;
  }
  .set-news-info .news-time{
     margin-left: 80px;
     font-size:14px;
     font-weight: 500;
     color: #999;
  }
  .set-news-info .news-details{
    margin-top: 12px;
    color: #333;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
  }
  .set-news-info .news-details span{
    color:#F3842B;
  }
  .set-news-info ul li{
    padding: 30px 0px 30px 90px;
    margin: 0px 30px;
    border-bottom: 1px solid #eee;
    position: relative;
  }
  .set-news-info ul li .news-img{
    width: 60px;
    height: 60px;
    position: absolute;
    left: 0px;
    top: 30px;
  }
  .set-news-info ul li:last-of-type{
    border-bottom: none;
  }
  .set-news-info .more-news{
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(159,173,194,1);
    margin-top: 20px;
    cursor: pointer;
  }
  .set-news-info .news-details{
    max-width:1000px;
  }
  @media (max-width: 768px)and (min-width:321px){
    .set-news-info{
      padding:20px 10px;
    }
    .set-news-info .news-img img{
      margin-top: 5px;
      width: 50px;
      height: 50px;
    }
    .set-news-info .news-time{
      margin-left: 20px;
    }
    .set-news-info ul li{
      padding: 20px 0px 20px 70px;
    }
  }
  @media only screen and (max-width: 320px){
    .set-news-info{
      padding:20px 8px;
    }
    .set-news-info .news-img img{
      margin-top: 5px;
      width: 50px;
      height: 50px;
    }
    .set-news-info .news-time{
      margin-left: 10px;
    }
    .set-news-info ul li{
      margin:0px;
    }
  }
</style>
<style>
  .news-details-dialog .el-dialog{
    max-width: 600px;
  }
  .news-details-dialog .el-dialog__body{
    padding: 15px 20px;
  }
  .news-details-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .news-details-dialog .el-dialog__title{
    font-size: 16px;
    color: #ffffff;
  }
  .news-details-dialog .el-dialog__headerbtn .el-dialog__close{
    color: #ffffff;
  }
 .new_icon_note .el-badge__content.is-dot{
   width: 12px;
   height: 12px;
   right: 12px;
   top: 8px;
 }
</style>
