<template>
  <div class="container main-container container-hover home-box">
    <div class="view welcome-view">
      <div class="welcome-context">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="16" :md="16" :lg="18" :xl="18" ref="newsBox">
            <div class="news-box" v-show="listData.length>0">
              <div class="news-box-header">
                <p v-for="(item,index) in sortType" :class="[sortIndex===index?'sort_style':'']" :key="index" @click="sortData(item.type,index)">{{item.title}}</p>
              </div>
              <div v-if="topArticlesList.length>0 && isShowTop" class="top-article-box" :class="{'active': isAll}">
                <span class="show-list" v-if="topArticlesList.length>3"  @click="toggleAllTop">展开置顶 <i class="el-icon-arrow-down"></i></span>
                <span class="hide-list"  v-if="isAll&&topArticlesList.length>3" @click="toggleAllTop">收起置顶 <i class="el-icon-arrow-up"></i></span>
                <ul>
                  <li class="text-overflow-1" v-for="(item,index) in topArticlesList" :key="index"><span class="is-top-sign">置顶</span><a @click="goToArticle(item.article_id)">{{item.title}}</a></li>
                </ul>
              </div>
              <ul>
                <li v-for="(item,index) in listData" :key="index">
                  <div class="news-list-box">
                    <div class="news-list clearfix">
                      <div class="pull-left news-list-text">
                        <a  href="javascript:void(0)">
                        <div @click="open(1,item)">
                        <h2>{{item.title}}</h2>
                        <p class="label-name">
                          <span v-if="item.labels.length>0" v-for="(item1,index1) in item.labels" :key="index1" class="label_style">{{item1}}</span>
                        </p>
                        <p class="text-overflow-2" v-if="item.content" v-html="item.content"></p>
                        </div>
                        </a>
                        <div class="clearfix author text-aaa">
                          <div class="name-date pull-left clearfix">
                            <a  href="javascript:void(0)" @click="open(4,item)" :title="`查看${item.author_name}`">
                            <span class="name">{{item.author_name}}</span>
                            </a>
                            <span class="date">{{item.created_time}}</span>
                          </div>
                          <div class="look-comment pull-left clearfix">
                            <span class="look"><i class="el-icon-view"></i>{{item.read_number}}</span>
                            <span class="comment"><i class="el-icon-chat-dot-round"></i>{{item.comment_number}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="pull-right news-list-img" v-if="item.cover_url">
                        <el-image
                          class="fm_img  fm_img_home"
                          :src="item.cover_url"
                          fit="contain"
                          lazy
                         @click.native="viewImage(item.original_url)">
                        </el-image>
                        <img src="../../assets/video.png" class="video_img" v-if="item.cover_type==='video'">
                      </div>
                    </div>
                    <div class="clearfix phone-author text-aaa">
                      <div class="name-date pull-left clearfix">
                        <span class="name">{{item.author_name}}</span>
                        <span class="date">{{item.created_time}}</span>
                      </div>
                      <div class="look-comment pull-right clearfix">
                        <span class="look"><i class="el-icon-view"></i>{{item.read_number}}</span>
                        <span class="comment"><i class="el-icon-chat-dot-round"></i>{{item.comment_number}}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="iframeFlag">
                  <iframe class="iframe895" v-if="index>0&&(index+1)%6===0" :src="routerUrl" width="100%" height="auto" scrolling="no" frameborder="0" style="margin-top: -1px"></iframe>
                  </div>
                </li>
              </ul>
              <div class="home-el-pagination">
                <el-pagination
                  background
                  :current-page.sync="currentPage"
                  :page-size="30"
                  layout="total, prev, pager, next, jumper"
                  @current-change="handleCurrentChange"
                  :total="total">
                </el-pagination>
              </div>
              <div class="home-el-pagination-phone">
                <el-pagination
                  background
                  :current-page.sync="currentPage"
                  :page-size="30"
                  :pager-count="pagerCount"
                  layout="prev, pager, next"
                  @current-change="handleCurrentChange"
                  :total="total">
                </el-pagination>
              </div>
            </div>
            <div class="no-passage" v-show="res_flag&&listData.length==0">
              <p><img src="../../../static/images/fenlei.png" width="46" height="54" alt=""></p>
              <p class="text-999 fs-16">没有相关的文章哦！换个分类试试</p>
            </div>
            <div class="no-passage" style="background-color: rgba(0, 0, 0, 0);"  v-if="listData.length==0&&!res_flag"></div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="6">
            <appQRcode></appQRcode>
            <advertisement v-show="!action_more" @click="choiceData"></advertisement>
            <div v-show="action_more">
              <ul class="rollScreen_list home_ad">
                <li class="rollScreen_once" :class="[(index+1)%3===1?'rollScreen_one':(index+1)%3===2?'rollScreen_two':(index+1)%3===0?'rollScreen_three':'']" v-for="(item,index) in rightAd" :key=index style="height: 80px">
                  <a  target="_blank" :href="item.url" v-if="item.url" class="router-link">
                    <p class="float-left text-overflow-two has_url" :title="item.title" >{{item.title}}</p>
                    <span class="float-right mt-15"><i class="el-icon-arrow-right"></i></span>
                  </a>
                  <p class="text-overflow-two" :title="item.title"  v-else>{{item.title}}</p>
                </li>
              </ul>
            </div>
            <div v-if="rightAd.length>3">
            <p class="text-center text-999 pointer-style" @click="more_ad" v-if="!action_more">更多<i class="fa fa-angle-double-down angle-double-down"></i></p>
            <p class="text-center text-999 pointer-style" @click="goback_ad" v-if="action_more">收起<i class="fa fa-angle-double-up angle-double-down"></i></p>
            </div>
            <div class="rank-box">
              <div class="rank-title clearfix">
                <span class="pull-left">近期评论</span>
              </div>
              <ul>
                <li v-for="(item,index) in articles" :key="index" v-if="articles.length!=0">
                  <a href="javascript:void(0)">
                  <img :src="item.avatar_url?item.avatar_url:comment_tx" alt="评论头像"  class="commentPic" @click="open(3,item)">
                  <div class="comment-content" >
                      <p class="text-overflow-1" @click="open(3,item)">
                        <span>{{item.comment_user}}</span>
                      </p>
                     <p class="text-overflow-1" @click="open(2,item)">{{item.comment}}</p>
                  </div>
                  <div class="comment-title" @click="open(2,item)" >
                       《{{item.title}}》
                  </div>
                  </a>
                </li>
                <li v-if="articles.length==0" class="no_coment">
                  暂无评论
                </li>
              </ul>
            </div>
            <div class="new-box new-box-footer">
              <p>
                <span>关于我们</span>
                <span>联系我们</span>
                <span>建议反馈</span>
              </p>
              <p>
                {{GlodConfig.footNote}}
              </p>
              <p>
                {{GlodConfig.fortheRecord}}
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <notice></notice>
    <view_picture :modalPictureShow.sync="pictureShow" :current_img_src="current_img_src"></view_picture>
  </div>
</template>

<script>
import advertisement from '../../components/advertisement'
import notice from '../../components/notice'
import viewPicture from '../../components/viewPicture'
import appQRcode from '../../components/appQRcode'

export default {
  name: 'home',
  components: {
    'appQRcode': appQRcode,
    'advertisement': advertisement,
    'view_picture': viewPicture,
    'notice': notice
  },
  data () {
    return {
      res_flag: false,
      iframeFlag: true,
      action_more: false,
      pictureShow: false,
      current_img_src: '',
      comment_tx: require('../../../static/images/toux.png'),
      routerUrl: '',
      path: '#/article/info?article_id=',
      path1: '#/article/info?article_id=',
      path2: '#/otherUserInfo?account_id=',
      activeName: 'second',
      rightAd: [],
      sortType: [
        {title: '综合', type: 0},
        {title: '最新', type: 1},
        {title: '最热', type: 2}
      ],
      articles_length: 0,
      sortIndex: 0,
      key_index: 0,
      currentPage: 1,
      pagerCount: 5,
      total: 0,
      formparams: {
        parent_id: -1
      },
      GlodConfig: window.GlodConfig,
      listData: [],
      articles: [],
      topArticlesList: [],
      isAll: false,
      isShowTop: false
    }
  },
  computed: {
  },
  watch: {
    $route (to, from) {
      this.listData = []
      this.key_index = 0
      this.sortIndex = 0
      this.currentPage = 1
      if (JSON.stringify(this.$route.query) === '{}') {
        if (this.formparams.parent_id === -1 && this.formparams.category_id) {
          this.formparams.category_id = 0
        }
        this.formparams.size = 30
        this.getArticleLists(this.formparams.parent_id)
        if (this.formparams.parent_id === -1) {
          this.isShowTop = false
        } else {
          this.isShowTop = true
          this.getTopArticlesList({parent_id: this.formparams.parent_id, category_id: this.formparams.category_id})
        }
      } else {
        if (this.$route.query.parent_id === -1 && this.$route.query.category_id) {
          this.$route.query.category_id = 0
        }
        this.formparams = this.$route.query
        this.formparams.size = 30
        this.getArticleLists(this.formparams)
        if (Number(this.$route.query.parent_id) === -1) {
          this.isShowTop = false
        } else {
          this.isShowTop = true
          this.getTopArticlesList({parent_id: this.formparams.parent_id, category_id: this.formparams.category_id})
        }
      }
    }
  },
  beforeDestroy () {
  },
  mounted () {
    this.recentComment()
    if (JSON.stringify(this.$route.query) === '{}') {
      if (this.formparams.parent_id === -1 && this.formparams.category_id) {
        this.formparams.category_id = 0
      }
      this.formparams.size = 30
      this.getArticleLists(this.formparams)
      if (this.formparams.parent_id === -1) {
        this.isShowTop = false
      } else {
        this.isShowTop = true
        this.getTopArticlesList({parent_id: this.formparams.parent_id, category_id: this.formparams.category_id})
      }
    } else {
      if (this.$route.query.parent_id === -1 && this.$route.query.category_id) {
        this.$route.query.category_id = 0
      }
      this.formparams = this.$route.query
      this.formparams.size = 30
      this.getArticleLists(this.formparams)
      if (Number(this.$route.query.parent_id) === -1) {
        this.isShowTop = false
      } else {
        this.isShowTop = true
        this.getTopArticlesList({parent_id: this.formparams.parent_id, category_id: this.formparams.category_id})
      }
    }
  },
  created () {
    this.routerUrl = window.location.protocol + '//' + window.location.host + '/html5/activityPage/pc_home.html'
  },
  methods: {
    open (type, item) {
      if (type === 1) {
        window.open(this.path + item.id + '&&from=list', '_blank')
      } else if (type === 2) {
        window.open(this.path1 + item.article_id + '&&scroll_id=comment', '_blank')
      } else if (type === 3) {
        window.open(this.path2 + item.account_id, '_blank')
      } else if (type === 4) {
        window.open(this.path2 + item.author_id, '_blank')
      }
    },
    viewImage (params) {
      this.pictureShow = true
      this.current_img_src = params
    },
    sortData (type, index) {
      this.formparams.type = type
      this.sortIndex = index
      this.key_index = 0
      this.currentPage = 1
      delete this.formparams.start
      this.getArticleLists(this.formparams)
      if (type === 0) {
        this.isShowTop = true
      } else {
        this.isShowTop = false
      }
    },
    more_ad () {
      this.action_more = !this.action_more
    },
    goback_ad () {
      this.action_more = !this.action_more
    },
    choiceData (playload) {
      this.rightAd = playload
    },
    handleCurrentChange (val) {
      this.iframeFlag = false
      this.$nextTick(() => (this.iframeFlag = true))
      document.documentElement.scrollTop = 0
      this.formparams.start = (val - 1) * 30
      this.getArticleLists(this.formparams)
    },
    getArticleLists (params) {
      this.res_flag = false
      this.http.articleLists(params).then(res => {
        let _this = this
        this.res_flag = true
        if (res.status === 0) {
          this.total = res.data.total_num
          if (res.data.articles) {
            this.articles_length = res.data.articles.length
            res.data.articles.forEach((item, index) => {
              item.created_time = _this.formatToBeforeTime(item.created_time)
              item.read_number = this.transforNumber(item.read_number)
              item.comment_number = this.transforNumber(item.comment_number)
            })
            this.listData = res.data.articles
          } else {
            this.listData = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    recentComment (params) {
      this.http.commentLists(params).then(res => {
        if (res.status === 0) {
          if (res.data.articles) {
            this.articles = res.data.articles
          } else {
            this.articles = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getTopArticlesList (params) {
      this.http.getTopArticle(params).then(res => {
        if (res.status === 0) {
          if (res.data.articles) {
            this.topArticlesList = res.data.articles
          } else {
            this.topArticlesList = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    goToArticle (id) {
      window.open(this.path + id, '_blank')
    },
    toggleAllTop () {
      this.isAll = !this.isAll
    }
  }
}
</script>

<style scoped>
  @import "../../styles/home.css";
  .no-news-list{
    text-align: center;
    color: #666666;
    height: 60px;
    border-bottom: none!important;
  }
  .news-box-header p.sort_style{
    color: #409EFF;
  }
  .news-box-header{
    overflow: hidden;
    padding: 13px 0px;
    border-bottom: 1px solid #e5e5e5;
  }
  .news-box-header p{
    float: left;
    color: #999;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 0px;
    padding:0px 30px;
    cursor: pointer;
    border-right: 1px solid #e5e5e5;
  }
  .news-box-header p:last-child{
    box-shadow: none;
    border-right: none;
  }
  .news-box-header p:hover{
    color: #409EFF;
  }
  .top-article-box{
    padding: 24px 20px;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
  }
  .top-article-box ul{
    max-height: 116px;
    overflow: hidden;
  }
  .top-article-box.active ul{
    max-height: 10000px;
  }
  .top-article-box .show-list,.top-article-box .hide-list{
    padding: 0px 5px 0px 10px;
    background: #d7e2f6;
    text-align: center;
    color: #598CF2;
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
  }
  .top-article-box ul li{
    margin-bottom: 20px;
  }
  .top-article-box ul li:last-child{
    margin-bottom: 0;
  }
  .top-article-box a{
    font-size: 16px;
    cursor: pointer;
  }
  .top-article-box .is-top-sign{
    background: #2f9b50;
    display: inline-block;
    padding: 0px 10px;
    color: #ffffff;
    border-radius: 22px;
    margin-right: 10px;
    text-align: center;
    font-size: 14px;
    background: -webkit-linear-gradient(0deg, #049384,#92E1BE);
    background: -o-linear-gradient(0deg, #049384, #92E1BE);
    background: -moz-linear-gradient(0deg, #049384, #92E1BE);
    background: linear-gradient(0deg, #049384, #92E1BE);
  }
  .pointer-style{
    cursor: pointer;
  }
  .angle-double-down{
    font-size: 18px;
    display: inline-block;
    margin-left:5px;
    margin-top: -2px;
    vertical-align: middle;
  }
  .no-passage{
    background: #ffffff;
    height: calc(100vh - 150px);
    padding-top: 100px;
    margin-top: 0;
  }
  @media only screen and (max-width: 768px){
    .iframe895{
      height: 63px;
    }
  }
</style>
<style>
  .router-link:active,.router-link:focus,.router-link:hover{
    color: #fff;
  }
  .home_ad{
    width: 100%;
    display: inline-block;
    position:relative;
    overflow: hidden;
  }
  .home-el-pagination{
    padding: 20px;
  }
  .home-el-pagination-phone {
    padding: 20px 0;
    display: none;
  }
  @media only screen and (max-width: 768px) {
    .home_ad{
      padding: 0px 12px;
    }
    .home-el-pagination{
      display: none;
    }
    .home-el-pagination-phone {
      display: block;
      overflow: auto;
    }
    .home-el-pagination-phone div{
      width: 100%;
      text-align: center;
    }
  }
  .home_ad .rollScreen_list{
    transition: 1s linear;
  }
  .home_ad .rollScreen_once{
    padding: 15px 12px;
    margin-bottom: 10px;
  }
  .home_ad .rollScreen_once{
    color: #fff;
    font-size: 15px;
  }
  .home_ad .rollScreen_once .has_url{
    width:90%;
  }
  .home_ad .rollScreen_list_unanim{
    transition: none
  }
  .home_ad .rollScreen_one{
    background: url("../../assets/ad/green2.png");
    background-size: 100% 100%;
  }
  .home_ad .rollScreen_two{
    background: url("../../assets/ad/yellow2.png");
    background-size: 100% 100%;
  }
  .home_ad .rollScreen_three{
    background: url("../../assets/ad/blue2.png");
    background-size: 100% 100%;
  }
  .home_ad .text-overflow-two{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: -moz-box;
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    max-height: 46px;
  }
  .news-list-img .fm_img .el-image-viewer__close{
    color: #fff;
    top: 80px;
  }
  .news-list-img .fm_img_home .el-image__inner{
    cursor:zoom-in;
  }
  .news-list-img .fm_img .el-image-viewer__actions{
    display: none;
  }
</style>
