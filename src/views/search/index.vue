<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <!-- el-main -->
        <div class="search-box search-page">
          <el-input
            placeholder="请输入内容"
            v-model="searchInput"
            @focus="showHistoryList()"
            @keyup.enter.native="onSubmit(searchInput)"
            class="input-with-select" >
            <el-select v-model="select" slot="prepend">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button class="search-btn" slot="append" @click="onSubmit(searchInput)">搜索</el-button>
          </el-input>
          <transition name="el-zoom-in-top">
            <div id="historyBox" class="history-box el-scrollbar" :class="{'active': showActive}" v-if="historyList.length>0">
              <div class="history-title clearfix">
                <span class="pull-left">搜索历史</span>
                <span class="pull-right clear-btn" @click="clearHistory"><i class="el-icon-delete"></i>清空</span>
              </div>
              <ul>
                <li class="history-list clearfix" v-for="(item,index) in historyList" :key="index">
                  <span class="pull-left history-text" @click="copyText(item)">{{item}}</span>
                  <span class="pull-right delete-btn" @click="searchByHistoryKeyWord(item)"><i class="el-icon-close"></i></span>
                </li>
                <li class="text-center text-999 pt-15 pb-15" v-if="historyList.length ===0">暂无搜索历史</li>
              </ul>
            </div>
          </transition>
        </div>
        <div class="search-content" v-if="searchContent">
          <div class="news-box" v-if="selectType === 'title'">
            <ul>
              <li  v-for="(item,index) in listData" :key="index" v-if="listData.length>0">
                <div class="news-list-box">
                  <div class="news-list clearfix">
                    <div class="pull-left news-list-text">
                      <a  href="javascript:void(0)">
                        <div @click="open(1,item)">
                          <h2 v-html="item.title"></h2>
                          <p class="label-name">
                            <span v-if="item.labels.length>0" v-for="(item1,index1) in item.labels" :key="index1" class="label_style">{{item1}}</span>
                          </p>
                        </div>
                      </a>
                      <div class="clearfix author text-aaa">
                        <div class="name-date pull-left clearfix">
                          <a  href="javascript:void(0)" @click="open(3,item)" :title="`查看${item.author_name}`">
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
              </li>
              <li class="no-news-list" v-if="listData.length===0&&res_flag.title">
                <div class="news-list-box">
                  <p><img src="../../../static/images/no-search-result.png" alt=""></p>
                  <p>没有找到与“<span class="text-pink">{{searchInputResult}}</span>”相关文章的内容</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="news-box" v-if="selectType === 'label'">
            <ul>
              <li  v-for="(item,index) in listData" :key="index" v-if="listData.length>0">
                <div class="news-list-box">
                  <div class="news-list clearfix">
                    <div class="pull-left news-list-text">
                      <a  href="javascript:void(0)">
                        <div @click="open(1,item)">
                          <h2>{{item.title}}</h2>
                          <p class="label-name">
                            <span v-if="item.labels.length>0" v-for="(item1,index1) in item.labels" :key="index1" class="label_style" v-html="item1">
                            </span>
                          </p>
                        </div>
                      </a>
                      <div class="clearfix author text-aaa">
                        <div class="name-date pull-left clearfix">
                          <a  href="javascript:void(0)" @click="open(3,item)" :title="`查看${item.author_name}`">
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
              </li>
              <li class="no-news-list" v-if="listData.length===0&&res_flag.label">
                <div class="news-list-box">
                  <p><img src="../../../static/images/no-search-result.png" alt=""></p>
                  <p>没有找到与“<span class="text-pink">{{searchInputResult}}</span>”相关标签的内容</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="follow-box" v-if="selectType === 'user'">
            <ul>
              <li v-for="(item,index) in listData" :key="index" v-if="listData.length>0">
                <div class="follow-list-box">
                  <div class="follow-list clearfix">
                    <div class="follow-list-img"  @click="open(4,item)"><img :src="item.head_url?item.head_url:useradimg" width="80" height="80" alt=""></div>
                    <div class="follow-list-text"  @click="open(4,item)">
                      <h2><span v-html="item.name"></span><img :src="item.gradeImg" alt="等级" class="trade-img"></h2>
                      <p>
                        <span class="text-999">{{item.career}}</span>
                        <span v-if="item.career" class="line text-999 ml-10 mr-10">|</span>
                        <span class="text-999">{{item.trade}}</span>
                        <span v-if="item.trade" class="line text-999 ml-10 mr-10">|</span>
                        <span class="text-999">{{item.home_address}}</span>
                      </p>
                      <p><span class="text-999">{{item.personal_profile}}</span></p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="no-news-list" v-if="listData.length===0&&res_flag.users">
                <div class="follow-list-box">
                  <p><img src="../../../static/images/no-search-result.png" alt=""></p>
                  <p>没有找到与“<span class="text-pink">{{searchInputResult}}</span>”相关用户的内容</p>
                </div>
              </li>
            </ul>
          </div>
          <div style="padding-bottom: 15px" v-if="listData.length>0">
            <div class="box-pagination">
              <el-pagination
                background
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
        <div style="max-width: 895px; margin: 0 auto" v-if="!searchContent || listData.length===0"><iframe class="iframe895" :src="routerUrl" width="100%" height="auto" scrolling="no" frameborder="0" style="margin: 0 auto;"></iframe></div>
        <!-- el-main -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  components: {
  },
  data () {
    return {
      active: false,
      searchContent: false,
      res_flag: {title: false, label: false, users: false},
      routerUrl: '',
      path: '#/article/info?article_id=',
      path1: '#/article/info?article_id=',
      path2: '#/otherUserInfo?account_id=',
      useradimg: require('../../../static/images/toux.png'),
      gradeImg: '',
      showActive: false,
      selectType: 'title',
      searchInput: '',
      searchInputResult: '',
      select: 'title',
      options: [
        {label: '文章', value: 'title'},
        {label: '标签', value: 'label'},
        {label: '用户', value: 'user'}
      ],
      articles_length: 0,
      listData: [],
      fansData: [],
      historyList: [],
      // 页码
      total: 0,
      size: 10,
      currentPage: 1
    }
  },
  directive: {},
  inject: ['reload'],
  computed: {},
  mounted () {
    if (sessionStorage.getItem('historyItems')) {
      let list = JSON.parse(sessionStorage.getItem('historyItems'))
      this.historyList = list
    } else {
      this.historyList = []
    }
    $(function () {
      $(document).bind('click', function (e) {
        var target = $(e.target)
        if (target.closest('.input-with-select .el-input__inner').length === 0) {
          $('.history-box').removeClass('active')
        } else {
          $('.history-box').addClass('active')
        }
      })
    })
  },
  created () {
    this.routerUrl = window.location.protocol + '//' + window.location.host + '/html5/activityPage/pc_search.html'
  },
  methods: {
    showHistoryList () {
      if (this.historyList.length > 0) {
        this.showActive = true
      }
    },
    copyText (text) {
      this.searchInput = text
      this.showActive = false
      this.onSubmit(this.searchInput)
    },
    clearHistory () {
      sessionStorage.removeItem('historyItems')
      this.historyList = []
      this.showActive = false
    },
    searchByHistoryKeyWord (item) {
      this.historyList.splice(this.historyList.indexOf(item), 1)
      sessionStorage.setItem('historyItems', JSON.stringify(this.historyList))
    },
    search (params) {
      this.http.searchResult(params).then(res => {
        let _this = this
        if (res.status === 0) {
          this.total = res.data.count
          if (params.type === 'title') {
            this.selectType = 'title'
            this.res_flag.title = true
            if (res.data.articles) {
              this.articles_length = res.data.articles.length
              res.data.articles.forEach(item => {
                item.created_time = _this.formatToBeforeTime(item.created_time)
                item.read_number = this.transforNumber(item.read_number)
                item.comment_number = this.transforNumber(item.comment_number)
                item.title = item.title.replace(this.searchInput, `<span class="text-pink">${this.searchInput}</span>`)
              })
              this.listData = res.data.articles
            } else {
              this.listData = []
            }
          } else if (params.type === 'label') {
            this.selectType = 'label'
            this.res_flag.label = true
            if (res.data.articles) {
              this.articles_length = res.data.articles.length
              res.data.articles.forEach(item => {
                item.created_time = _this.formatToBeforeTime(item.created_time)
                item.read_number = this.transforNumber(item.read_number)
                item.comment_number = this.transforNumber(item.comment_number)
                if (item.labels && item.labels.length > 0) {
                  for (let i = 0; i < item.labels.length; i++) {
                    if (item.labels[i].indexOf(this.searchInput) > -1 && this.searchInput) {
                      item.labels[i] = item.labels[i].replace(this.searchInput, `<span class="text-pink">${this.searchInput}</span>`)
                    }
                  }
                }
              })
              this.listData = res.data.articles
            } else {
              this.listData = []
            }
          } else if (params.type === 'user') {
            this.selectType = 'user'
            if (res.data.users) {
              this.res_flag.users = true
              res.data.users.forEach(item => {
                item.name = item.name.replace(this.searchInput, `<span class="text-pink">${this.searchInput}</span>`)
                item.gradeImg = item.grade === 1 ? require('../../assets/invitaton/rank-1.png') : item.grade === 2 ? require('../../assets/invitaton/rank-2.png') : item.grade === 3 ? require('../../assets/invitaton/rank-3.png')
                  : item.grade === 4 ? require('../../assets/invitaton/rank-4.png') : item.grade === 5 ? require('../../assets/invitaton/rank-5.png') : item.grade === 6 ? require('../../assets/invitaton/rank-6.png') : item.grade === 7 ? require('../../assets/invitaton/rank-7.png') : item.grade === 8 ? require('../../assets/invitaton/rank-8.png') : item.grade === 9 ? require('../../assets/invitaton/rank-9.png')
                    : item.grade === 10 ? require('../../assets/invitaton/rank-10.png') : item.grade === 11 ? require('../../assets/invitaton/rank-11.png') : item.grade === 12 ? require('../../assets/invitaton/rank-12.png') : item.grade === 13 ? require('../../assets/invitaton/rank-13.png') : item.grade === 14 ? require('../../assets/invitaton/rank-14.png')
                      : item.grade === 15 ? require('../../assets/invitaton/rank-15.png') : item.grade === 16 ? require('../../assets/invitaton/rank-16.png') : item.grade === 17 ? require('../../assets/invitaton/rank-17.png') : item.grade === 18 ? require('../../assets/invitaton/rank-18.png') : ''
              })
              this.listData = res.data.users
            } else {
              this.listData = []
            }
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    onSubmit (value) {
      if (value) {
        this.searchContent = true
        this.showActive = false
        var appendFlag = true
        if (this.historyList !== null && this.historyList !== undefined && this.historyList.length > 0) {
          this.historyList.forEach(function (currentValue, index) {
            if (currentValue === value) {
              appendFlag = false
            }
          })
          // 判断-添加
          if (appendFlag === true) {
            // 长度判断
            if (this.historyList.length >= 10) {
              this.historyList.unshift(value)
              this.historyList.pop()
            } else {
              this.historyList.unshift(value)
            }
            sessionStorage.setItem('historyItems', JSON.stringify(this.historyList))
          }
        } else {
          this.historyList = []
          this.historyList.push(value)
          sessionStorage.setItem('historyItems', JSON.stringify(this.historyList))
        }
        this.search({type: this.select, keyword: this.searchInput})
        this.searchInputResult = this.searchInput
      } else {
        this.$toast('请输入关键词', 2000, 'error')
      }
    },
    open (type, item) {
      if (type === 1) {
        window.open(this.path + item.id + '&&from=list', '_blank')
      } else if (type === 2) {
        window.open(this.path1 + item.article_id + '&&scroll_id=comment', '_blank')
      } else if (type === 3) {
        window.open(this.path2 + item.author_id, '_blank')
      } else if (type === 4) {
        window.open(this.path2 + item.id, '_blank')
      }
    },
    // 页码
    handleSizeChange (val) {
      this.size = val
      this.search({type: this.select, keyword: this.searchInput, size: this.size})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.search({type: this.select, keyword: this.searchInput, size: this.size, start: (val - 1) * this.size})
    }
  }
}
</script>

<style scoped>
  @import "../../styles/home.css";
  .welcome-view {
    width: 100%;
  }
  .search-box{
    max-width: 895px;
    margin: 0 auto;
    margin-bottom: 30px;
    position: relative;
  }
  .el-scrollbar{
    display: none;
    position: relative;
  }
  .el-scrollbar.active{
    display: block;
  }
  .el-scrollbar ul{
    height: 100%;
    max-height: 280px;
    overflow: hidden;
    overflow-y: auto;
  }
  .history-box{
    width: 638px;
    background: #ffffff;
    border-radius: 4px;
    position: absolute;
    left: 120px;
    top: 52px;
    border: 1px solid #DCDFE6;
    z-index: 2;
  }
  .history-box .history-title{
    height: 40px;
    line-height: 40px;
    color: #9FADC2;
    padding: 0px 12px;
  }
  .history-box .history-title .clear-btn{
    cursor: pointer;
  }
  .history-box .history-list{
    height: 40px;
    line-height: 40px;
    color: #999999;
    margin-bottom: 5px;
    padding: 0px 12px;
  }
  .history-box .history-list .history-text{
    min-width: 50%;
    cursor: pointer;
  }
  .history-box .history-list .delete-btn{
    cursor: pointer;
  }
  .history-box .history-list:hover{
    background: #F7F7F7;
  }
  .search-content{
    max-width: 895px;
    margin: 0 auto;
    background: #ffffff;
    margin-bottom: 15px;
  }
  .news-box li.no-news-list{
    text-align: center;
    color: #666666;
    padding: 20px 0;
  }
  .follow-box li.no-news-list{
    text-align: center;
    color: #666666;
    padding: 20px 0;
  }
  .news-box li.no-news-list .news-list-box{
    border-bottom: none;
  }
  .follow-box li.no-news-list .follow-list-box{
    border-bottom: none;
  }
  .follow-box{
    background: #ffffff;
  }
  .follow-box .follow-list-box{
    padding: 20px 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  .follow-box .follow-list{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .follow-list-img{
    flex: 0 0 auto;
    width: 80px;
    height: 80px;
    overflow: hidden;
    margin-right: 20px;
    background-color: #fff;
    border-radius: 4px;
    position: relative;
  }
  .follow-list-img .fm_img{
    width: 100%;
    height: 100%;
  }
  .follow-list-text{
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }
  .follow-list-text h2{
    font-size: 20px;
    margin-top: 0;
    margin-bottom: 5px;
  }
  .follow-list-text h2 img{
    margin-bottom: 3px;
    margin-left: 10px;
  }
  .follow-list-text h2 a{
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .follow-list-text .achievement-item span{
    color: #999999;
    margin-right: 30px;
  }
  .follow-list .follow-btn{
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .follow-btn.followed .el-button--primary{
    background-color: #9fadc2;
    border-color: #9fadc2;
  }
  .follow-btn.followed .el-button--primary{
    background-color: #9fadc2;
    border-color: #9fadc2;
  }
  .follow-btn.followed .el-button--primary:focus, .follow-btn.followed .el-button--primary:hover{
    background-color: #a6b6ce;
    border-color: #a6b6ce;
  }
  .main-container .news-list .label_style.text-pink{
    color: #ff0000;
  }
  .box-pagination{
    padding: 0 20px;
  }
  .main-container .news-list .label_style.activeRed{
    color: #F3842B;
  }
  @media only screen and (max-width: 768px){
    .iframe895{
      height: 63px;
    }
  }
</style>
<style>
  .search-page .el-select .el-input {
    width: 120px;
  }
  .search-page .el-input__inner{
    height: 50px;
    line-height: 50px;
  }
  .search-page .el-select-dropdown__item{
    text-align: center;
  }
  .search-page .input-with-select .el-input-group__prepend {
    background-color: #fff;
    color: #333333;
  }
  .search-page .el-input-group__prepend .el-input__inner{
    text-align: center;
  }
  .search-page .el-input-group__append{
    background: #598CF2;
    color: #ffffff;
  }
  .search-page .el-input-group__append:hover{
    background: #409eff;
  }
  .search-page .el-input-group__append .el-button{
    width: 120px;
    text-align: center;
  }
  .search-page .el-autocomplete{
    line-height: normal;
    display: inline-table;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
</style>
