<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <div class="user-info-head clearfix mt-30">
          <div class="avatar-uploader">
            <div class="upload">
              <img :src="imageUrl?imageUrl:useradimg" class="avatar">
            </div>
          </div>
          <div class="set-info-other">
            <div class="info-p clearfix">
              <div class="float-left">
                <span class="name">{{formLabelAlign.name}}</span>
                <a :href="explain_guide" target="_blank"><img :src="gradeImg" alt="等级" class="trade-img"></a>
              </div>
              <div class="follow-btn float-right" :class="[account_info.is_follow?'followed':'']">
                <el-button   v-if="is_moderator" @click="forbidVisible_action(account_info)" class="edit-btn-big">禁止评论</el-button>
                <el-button   v-if="is_moderator" @click="forbidVisible_action(account_info)" class="edit-btn-small" size="small" style="margin: 0px">禁止评论</el-button>
                <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!account_info.is_follow">
                  <el-button type="primary"  class="edit-btn-big" plain @click="attentionsAction({attention_id:account_info.account_id,is_follow:true})">+ 关注</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="account_info.is_follow">
                  <el-button type="primary" class="edit-btn-big" @click="attentionsAction({attention_id:account_info.account_id,is_follow:false})">已关注</el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!account_info.is_follow">
                  <el-button type="primary" size="small" class="edit-btn-small" plain @click="attentionsAction({attention_id:account_info.account_id,is_follow:true})">+ 关注</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="account_info.is_follow">
                  <el-button type="primary" size="small" class="edit-btn-small" @click="attentionsAction({attention_id:account_info.account_id,is_follow:false})">已关注</el-button>
                </el-tooltip>
              </div>

            </div>
            <p>
              <span class="text-999">{{account_info.career}}</span>
              <span v-if="account_info.career" class="line text-999 ml-10 mr-10">|</span>
              <span class="text-999">{{account_info.trade}}</span>
              <span v-if="account_info.trade" class="line text-999 ml-10 mr-10">|</span>
              <span class="text-999">{{account_info.home_address}}</span>
            </p>
            <p><span class="text-999">{{account_info.personal_profile}}</span></p>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <div class="user-info-content border-radius-4">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane name="one">
                  <span slot="label">文章({{listDataNumber}})</span>
                  <div v-if="listData.length>0" class="news-box useinfo-box">
                    <ul>
                      <a href="javascript:void(0)" v-for="(item,index) in listData" :key="index">
                        <li @click="openArtice(item)">
                          <div class="news-list-box">
                            <div class="news-list clearfix">
                              <div class="pull-left news-list-text" style="position: relative">
                                <h2><img src="../../assets/examine/draft.png" alt="" v-if="item.status===2"> {{item.title}}</h2>
                                <p class="label-name">
                                  <span v-if="item1.label_name.length>0" v-for="(item1,index1) in item.label" :key="index1" class="label_style">{{item1.label_name}}</span>
                                </p>
                                <p class="text-overflow-2">{{item.content}}</p>
                                <div class="clearfix author text-aaa">
                                  <div class="name-date pull-left clearfix">
                                    <span class="date">{{item.created_time}}</span>
                                  </div>
                                  <span class="look"><i class="el-icon-view"></i>{{item.read_number!=0?item.read_number:''}}</span>
                                  <span class="comment"><i class="el-icon-chat-dot-round"></i>{{item.comment_number!=0?item.comment_number:''}}</span>
                                  <!--<span class="thumbs-up"><i class="fa"><img src="../../assets/index/fa-thumbs-up.png" alt=""></i>{{item.admire_number!=0?item.admire_number:''}}</span>-->
                                </div>
                                <p class="text-overflow-1 reject_p " v-if="item.status === -2">驳回原因:{{item.reason}}</p>
                                <div class="examine-status text-center">
                                  <img :src="item.review_src" v-if="item.status === -1||item.status === -2">
                                </div>
                              </div>
                              <div class="pull-right news-list-img" v-if="item.cover_url">
                                <div style="height: 100%">
                                  <el-image
                                    class="fm_img"
                                    :src="item.cover_url"
                                    fit="contain"
                                    lazy>
                                  </el-image>
                                  <img src="../../assets/video.png" class="video_img" v-if="item.cover_type==='video'">
                                </div>
                              </div>
                            </div>
                            <div class="clearfix phone-author text-aaa">
                              <div class="name-date pull-left clearfix">
                                <span class="date">{{item.created_time}}</span>
                              </div>
                              <div class="look-comment pull-right clearfix">
                                <span class="look"><i class="el-icon-view"></i>{{item.read_number!=0?item.read_number:''}}</span>
                                <span class="comment"><i class="el-icon-chat-dot-round"></i>{{item.comment_number!=0?item.comment_number:''}}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      </a>
                    </ul>
                  </div>
                  <div v-if="listData.length===0&&res_flag.article"  class="no-passage">
                    <p><img src="../../../static/images/wenzhangliebiao.png" width="57" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你文章列表空空的哦！</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="two">
                  <span slot="label">评论({{commentsNumber}})</span>
                  <div v-if="commentsData.length > 0" class="comment-box">
                    <ul>
                      <li v-for="(item,index) in commentsData" :key="index">
                        <el-row :gutter="20">

                          <a href="javascript:void(0)">
                            <el-col :xs="19" :sm="19" :md="22" :lg="22" :xl="22" @click.native="open(2,item)">
                              <p>
                      <span class="text-666 mr-35">
                        <span></span>
                        <span v-if="item.commented_id != 0">回复了</span>
                        <span v-if="item.commented_id === 0">评论了文章</span>
                        {{ item.commented_id === item.author_id ? item.author_name : ''}}
                        {{ item.commented_id != 0 ? item.commented_name : ''}} <span class="text-orange" v-if="item.commented_id === item.author_id">(作者)</span>
                       <span v-if="item.commented_id != 0">在</span><span class="text-orange">《{{item.title}}》</span> <span v-if="item.commented_id != 0">的评论</span>
                      </span>
                                <span class="text-aaa">{{item.time}}</span>
                              </p>
                              <p>{{item.content}}</p>
                              <div class="comment-img-box clearfix">
                                <div v-for="(item1,index1) in item.image_url" :key="index1" class="pull-left item-img"><img :src="item1.url" width="150" height="100" alt=""></div>
                              </div>
                              <div class="other-reply" v-if="item.respond_content">
                                <span v-if="item.commented_id != 0">{{item.commented_name}}<span v-if="item.commented_id === item.author_id">(作者)</span>: {{item.respond_content}}</span>
                                <span v-else>{{item.author_name}}: {{item.respond_content}}</span>
                              </div>
                            </el-col>
                          </a>
                        </el-row>
                      </li>
                    </ul>
                  </div>
                  <div v-if="commentsData.length===0&&res_flag.comment" class="no-passage">
                    <p><img src="../../../static/images/pinglun.png" width="50" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你的评论列表空空的哦!</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="three">
                  <span slot="label">收藏({{collectNumber}})</span>
                  <div v-if="collectData.length>0" class="news-box useinfo-box">
                    <ul>
                      <li v-for="(item,index) in collectData" :key="index">
                        <el-row :gutter="20">
                          <a href="javascript:void(0)">
                            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" @click.native="open(1,item)">
                              <div class="news-list-box">
                                <div class="news-list clearfix">
                                  <div class="pull-left news-list-text">
                                    <h2>{{item.title}}</h2>
                                    <div class="clearfix author text-aaa">
                                      <div class="name-date pull-left clearfix">
                                        <img src="../../assets/collect.png" alt="" class="float-left collect_icon">  <span class="date">{{item.create_time}}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="clearfix phone-author text-aaa">
                                  <div class="name-date pull-left clearfix">
                                    <img src="../../assets/collect.png" alt="" class="float-left collect_icon"> <span class="date">{{item.create_time}}</span>
                                  </div>
                                </div>
                              </div>
                            </el-col>
                          </a>
                        </el-row>
                      </li>
                    </ul>
                  </div>
                  <div  v-if="collectData.length===0&&res_flag.collect" class="no-passage">
                    <p><img src="../../../static/images/wenzhangliebiao.png" width="57" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你的收藏列表空空的哦！</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="four">
                  <span slot="label">关注({{attentionsNumber}})</span>
                  <div class="follow-box" v-if="attentionsData.length>0">
                    <ul>
                      <a href="javascript:void(0)" v-for="(item,index) in attentionsData" :key="index">
                      <li>
                        <div class="follow-list clearfix">
                          <div class="follow-list-img" @click="open(3,item)"><img :src="item.head_url?item.head_url:useradimg" width="80" height="80" alt=""></div>
                          <div class="follow-list-text" @click="open(3,item)">
                            <h2>{{item.account_name}}<img :src="item.gradeImg" alt="等级" class="trade-img"></h2>
                            <p class="text-999 mb-5 text-overflow-1">{{item.personal_profile}}</p>
                            <div class="clearfix achievement-item">
                              <span>文章 {{item.article_num}}</span>
                              <span>阅读 {{item.readed_num}}</span>
                              <span>收藏 {{item.collected_num}}</span>
                            </div>
                          </div>
                          <div class="follow-btn follow-btn-pc" :class="[item.is_follow?'followed':'']">
                            <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!item.is_follow">
                              <el-button type="primary" plain  @click="getAttentionsAction({attention_id:item.account_id,is_follow:true},'attentions')">+ 关注</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="item.is_follow">
                              <el-button type="primary" @click="getAttentionsAction({attention_id:item.account_id,is_follow:false},'attentions')">已关注</el-button>
                            </el-tooltip>
                          </div>
                          <div class="follow-btn follow-btn-phone" :class="[item.is_follow?'followed':'']">
                            <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!item.is_follow">
                              <el-button type="primary" plain size="small" @click="getAttentionsAction({attention_id:item.account_id,is_follow:true},'attentions')">+ 关注</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="item.is_follow">
                              <el-button type="primary" size="small" @click="getAttentionsAction({attention_id:item.account_id,is_follow:false},'attentions')">已关注</el-button>
                            </el-tooltip>
                          </div>
                        </div>
                      </li>
                      </a>
                    </ul>
                  </div>
                  <div  v-if="attentionsData.length===0&&res_flag.attentions" class="no-passage">
                    <p><img src="../../../static/images/wenzhangliebiao.png" width="57" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你的关注列表空空的哦！</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="five">
                  <span slot="label">粉丝({{fansNumber}})</span>
                  <div class="follow-box" v-if="fansData.length>0">
                    <ul>
                      <a href="javascript:void(0)" v-for="(item,index) in fansData" :key="index">
                      <li>
                        <div class="follow-list clearfix">
                          <div class="follow-list-img" @click="open(3,item)"><img :src="item.head_url?item.head_url:useradimg" width="80" height="80" alt=""></div>
                          <div class="follow-list-text" @click="open(3,item)">
                            <h2>{{item.account_name}}<img :src="item.gradeImg" alt="等级" class="trade-img"></h2>
                            <p class="text-999 mb-5 text-overflow-1">{{item.personal_profile}}</p>
                            <div class="clearfix achievement-item">
                              <span>文章 {{item.article_num}}</span>
                              <span>阅读 {{item.readed_num}}</span>
                              <span>收藏 {{item.collected_num}}</span>
                            </div>
                          </div>
                          <div class="follow-btn follow-btn-pc" :class="[item.is_follow?'followed':'']">
                            <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!item.is_follow">
                              <el-button type="primary" plain  @click="getAttentionsAction({attention_id:item.account_id,is_follow:true},'fans')">+ 关注</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="item.is_follow">
                              <el-button type="primary" @click="getAttentionsAction({attention_id:item.account_id,is_follow:false},'fans')">已关注</el-button>
                            </el-tooltip>
                          </div>
                          <div class="follow-btn follow-btn-phone" :class="[item.is_follow?'followed':'']">
                            <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!item.is_follow">
                              <el-button type="primary" plain size="small" @click="getAttentionsAction({attention_id:item.account_id,is_follow:true},'fans')">+ 关注</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="item.is_follow">
                              <el-button type="primary" size="small" @click="getAttentionsAction({attention_id:item.account_id,is_follow:false},'fans')">已关注</el-button>
                            </el-tooltip>
                          </div>
                        </div>
                      </li>
                      </a>
                    </ul>
                  </div>
                  <div  v-if="fansData.length===0&&res_flag.fans" class="no-passage">
                    <p><img src="../../../static/images/wenzhangliebiao.png" width="57" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你的粉丝列表空空的哦！</p>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div class="home-el-pagination" v-if="show_pagination">
                <el-pagination
                  background
                  :current-page.sync="currentPage"
                  :page-size="size"
                  layout="total, prev, pager, next, jumper"
                  @current-change="handleCurrentChange"
                  :total="total">
                </el-pagination>
              </div>
              <div class="home-el-pagination-phone" v-if="show_pagination">
                <el-pagination
                  background
                  :current-page.sync="currentPage"
                  :page-size="size"
                  :pager-count="pagerCount"
                  layout="prev, pager, next"
                  @current-change="handleCurrentChange"
                  :total="total">
                </el-pagination>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="user-info-item border-radius-4">
              <ul>
                <li class="clearfix">
                  <span class="strong fs-18 text-333 user-text"><img src="../../assets/icon/icon-on-achievement.png" width="17" height="18" alt="" class="mr-10">个人成就</span>
                </li>
                <li class="clearfix">
                  <span class="trade-name strong fs-18">文章被阅读：</span><span class="text-999 strong fs-18">{{account_info.readed_num}}</span>
                </li>
                <li class="clearfix">
                  <span class="trade-name strong fs-18">文章被收藏：</span><span class="text-999 strong fs-18">{{account_info.collected_num}}</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <forbid-comments :modalForbidShow.sync="forbidVisible" :account_id="commentId" :commentator_categorys="categorys" :account_name="accountName"></forbid-comments>
  </div>
</template>

<script>
import globalPopup from '../../components/popup'
import forbidComments from '../../components/forbid_comments'
export default {
  name: 'otherUserInfo',
  components: {
    'global-popup': globalPopup,
    'forbid-comments': forbidComments
  },
  data () {
    return {
      res_flag: {article: false, comment: false, collect: false, fans: false, attentions: false},
      commentId: null,
      accountName: '',
      categorys: [],
      forbidVisible: false,
      currentPage: 1,
      total: 0,
      account_id: null,
      pagerCount: 5,
      show_pagination: false,
      is_moderator: false,
      emailStatus: '',
      useradimg: require('../../../static/images/toux.png'),
      gradeImg: '',
      path: '#/article/info?article_id=',
      path1: '#/article/info?scroll_id=comment&&article_id=',
      path2: '#/otherUserInfo?account_id=',
      defaultPassage: 1,
      asset: {},
      size: 20,
      start: 1,
      imageUrl: '',
      olderName: '',
      formLabelAlign: {
        name: ''
      },
      account_info: {},
      ruleForm: {
        email: '',
        withdraw_url: '',
        coin_amount: '',
        captcha: '',
        captcha_id: '',
        note: ''
      },
      activeName: 'one',
      listData: [],
      commentsData: [],
      collectData: [],
      attentionsData: [],
      fansData: [],
      listDataNumber: 0,
      commentsNumber: 0,
      collectNumber: 0,
      attentionsNumber: 0,
      fansNumber: 0,
      explain_guide: ''
    }
  },
  computed: {
  },
  inject: ['reload'],
  created () {
    if (this.Cookies.get('info')) {
      if (JSON.parse(this.Cookies.get('info')).is_moderator) {
        this.is_moderator = true
      } else {
        this.is_moderator = false
      }
    }
  },
  mounted () {
    this.explain_guide = this.http.explainGuideLink(1)
    if (this.$route.query.account_id) {
      this.userInfo({account_id: this.$route.query.account_id})
      this.getArticleList({size: this.size, account_id: this.$route.query.account_id, status: this.defaultPassage})
    } else {
      this.$toast('参数错误', 2000, 'error')
    }
  },
  methods: {
    open (type, item) {
      if (type === 1) {
        window.open(this.path + item.article_id, '_blank')
      } else if (type === 2) {
        window.open(this.path1 + item.article_id + '&&scroll_id=comment', '_blank')
      } else if (type === 3) {
        window.open(this.path2 + item.account_id, '_blank')
      }
    },
    openArtice (item) {
      window.open(this.path + item.id, '_blank')
    },
    forbidVisible_action (v) {
      this.forbidVisible = true
      this.commentId = v.account_id
      this.accountName = v.account
      this.http.hasForbid({uid: v.account_id}).then(res => {
        if (res.status === 0) {
          if (res.data.forbid_categorys) {
            this.has_forbid_categorys(res.data.forbid_categorys)
          } else {
            this.no_forbid_categorys()
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    has_forbid_categorys (v) {
      this.http.moderatorCategorys().then(res => {
        if (res.status === 0) {
          if (res.data.categorys) {
            if (v) {
              v.forEach(item1 => {
                if (item1.category_id === 0) {
                  res.data.categorys.forEach(item => {
                    if (item1.position_id === item.category_id) {
                      item.isIndeterminate = false
                      item.checkAll = false
                      item.checkedCategorys = item1.sub_category.map(c => c.category_id)
                    }
                  })
                } else {
                  res.data.categorys.forEach(item => {
                    if (item1.category_id === item.category_id) {
                      item.isIndeterminate = false
                      item.checkAll = true
                      item.checkedCategorys = item1.sub_category ? item1.sub_category.map(c => c.category_id) : []
                    }
                  })
                }
              })
            }
            res.data.categorys.forEach(item => {
              if (!item.checkedCategorys) {
                item.isIndeterminate = false
                item.checkAll = false
                item.checkedCategorys = []
              }
            })
            this.categorys = res.data.categorys
          } else {
            this.categorys = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    no_forbid_categorys () {
      this.http.moderatorCategorys().then(res => {
        if (res.status === 0) {
          if (res.data.categorys) {
            res.data.categorys.forEach(item => {
              item.isIndeterminate = false
              item.checkAll = false
              item.checkedCategorys = []
            })
            this.categorys = res.data.categorys
          } else {
            this.categorys = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    userInfo (params) {
      this.http
        .userInfo(params).then(res => {
          if (res.status === 0) {
            this.account_info = res.data.account_info
            document.title = res.data.account_info.account + '的主页-' + window.GlodConfig.title
            this.account_id = res.data.account_info.account_id
            this.imageUrl = res.data.account_info.head_url
            this.olderName = res.data.account_info.account
            this.formLabelAlign.name = res.data.account_info.account
            this.emailStatus = res.data.account_info.email_status
            this.ruleForm.email = res.data.account_info.email
            this.asset = res.data.asset
            this.listDataNumber = res.data.asset.article_num
            this.commentsNumber = res.data.asset.comment_num
            this.collectNumber = res.data.asset.collect_num
            this.attentionsNumber = res.data.asset.attention_num
            this.fansNumber = res.data.asset.fan_num
            this.gradeImg = res.data.asset.grade === 1 ? require('../../assets/invitaton/rank-1.png') : res.data.asset.grade === 2 ? require('../../assets/invitaton/rank-2.png') : res.data.asset.grade === 3 ? require('../../assets/invitaton/rank-3.png')
              : res.data.asset.grade === 4 ? require('../../assets/invitaton/rank-4.png') : res.data.asset.grade === 5 ? require('../../assets/invitaton/rank-5.png') : res.data.asset.grade === 6 ? require('../../assets/invitaton/rank-6.png') : res.data.asset.grade === 7 ? require('../../assets/invitaton/rank-7.png') : res.data.asset.grade === 8 ? require('../../assets/invitaton/rank-8.png') : res.data.asset.grade === 9 ? require('../../assets/invitaton/rank-9.png')
                : res.data.asset.grade === 10 ? require('../../assets/invitaton/rank-10.png') : res.data.asset.grade === 11 ? require('../../assets/invitaton/rank-11.png') : res.data.asset.grade === 12 ? require('../../assets/invitaton/rank-12.png') : res.data.asset.grade === 13 ? require('../../assets/invitaton/rank-13.png') : res.data.asset.grade === 14 ? require('../../assets/invitaton/rank-14.png')
                  : res.data.asset.grade === 15 ? require('../../assets/invitaton/rank-15.png') : res.data.asset.grade === 16 ? require('../../assets/invitaton/rank-16.png') : res.data.asset.grade === 17 ? require('../../assets/invitaton/rank-17.png') : res.data.asset.grade === 18 ? require('../../assets/invitaton/rank-18.png') : ''
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getArticleList (params) {
      this.res_flag.article = false
      this.http
        .userInfoArticleLists(params).then(res => {
          this.total = res.data.total_num
          if (res.status === 0) {
            this.res_flag.article = true
            this.listDataNumber = res.data.total_num
            this.total = this.listDataNumber
            if (res.data.articles_info) {
              res.data.articles_info.forEach(item => {
                item.created_time = this.getTime(item.created_time)
                item.review_src = item.status === -1 ? require('../../assets/examine/checkPending.png') : item.status === -2 ? require('../../assets/examine/reject.png') : ''
              })
              this.listData = res.data.articles_info
            } else {
              this.listData = []
            }
            if (this.listData.length === 0 && this.res_flag.article) {
              this.show_pagination = false
            } else {
              this.show_pagination = true
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getCommentsList (params) {
      this.res_flag.comment = false
      this.http
        .userInfoCommentsLists(params).then(res => {
          if (res.status === 0) {
            this.res_flag.comment = true
            this.commentsNumber = res.data.total_num
            this.total = this.commentsNumber
            if (res.data.comment_info) {
              res.data.comment_info.forEach(item => {
                item.time = this.getTime(item.time)
              })
              this.commentsData = res.data.comment_info
            } else {
              this.commentsData = []
            }
            if (this.commentsData.length === 0 && this.res_flag.comment) {
              this.show_pagination = false
            } else {
              this.show_pagination = true
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getCollectList (params) {
      this.res_flag.collect = false
      this.http.collectList(params).then(res => {
        if (res.status === 0) {
          this.res_flag.collect = true
          this.collectNumber = res.data.total_num
          this.total = this.collectNumber
          if (res.data.collects) {
            res.data.collects.forEach(item => {
              item.create_time = this.getTime(item.create_time)
            })
            this.collectData = res.data.collects
          } else {
            this.collectData = []
          }
          if (this.collectData.length === 0 && this.res_flag.collect) {
            this.show_pagination = false
          } else {
            this.show_pagination = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getAttentionsAction (params, type) {
      this.http.attentionsAction(params).then(res => {
        if (res.status === 0) {
          if (type === 'attentions') {
            let pageCount = Math.ceil(this.total / this.size)
            if (pageCount > 1 && pageCount === this.start) {
              if (this.attentionsData.length === 1) {
                this.start = this.start - 1
                this.getAttentionsList({size: this.size, start: (this.start - 1) * this.size, account_id: this.account_id})
              } else {
                this.getAttentionsList({size: this.size, start: (this.start - 1) * this.size, account_id: this.account_id})
              }
            } else {
              this.getAttentionsList({size: this.size, start: (this.start - 1) * this.size, account_id: this.account_id})
            }
          } else {
            this.spliceFans(params)
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    attentionsAction (params) {
      this.http.attentionsAction(params).then(res => {
        if (res.status === 0) {
          this.userInfo({account_id: this.$route.query.account_id})
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    spliceFans (params) {
      this.fansData.forEach((item) => {
        if (params.attention_id === item.account_id) {
          item.is_follow = !item.is_follow
        }
      })
    },
    getAttentionsList (params) {
      this.res_flag.attentions = false
      this.http.attentionsList(params).then(res => {
        if (res.status === 0) {
          this.res_flag.attentions = true
          this.attentionsNumber = res.data.total_num
          this.total = this.attentionsNumber
          if (res.data.account_follower_infos) {
            res.data.account_follower_infos.forEach(item => {
              item.gradeImg = item.grade === 1 ? require('../../assets/invitaton/rank-1.png') : item.grade === 2 ? require('../../assets/invitaton/rank-2.png') : item.grade === 3 ? require('../../assets/invitaton/rank-3.png')
                : item.grade === 4 ? require('../../assets/invitaton/rank-4.png') : item.grade === 5 ? require('../../assets/invitaton/rank-5.png') : item.grade === 6 ? require('../../assets/invitaton/rank-6.png') : item.grade === 7 ? require('../../assets/invitaton/rank-7.png') : item.grade === 8 ? require('../../assets/invitaton/rank-8.png') : item.grade === 9 ? require('../../assets/invitaton/rank-9.png')
                  : item.grade === 10 ? require('../../assets/invitaton/rank-10.png') : item.grade === 11 ? require('../../assets/invitaton/rank-11.png') : item.grade === 12 ? require('../../assets/invitaton/rank-12.png') : item.grade === 13 ? require('../../assets/invitaton/rank-13.png') : item.grade === 14 ? require('../../assets/invitaton/rank-14.png')
                    : item.grade === 15 ? require('../../assets/invitaton/rank-15.png') : item.grade === 16 ? require('../../assets/invitaton/rank-16.png') : item.grade === 17 ? require('../../assets/invitaton/rank-17.png') : item.grade === 18 ? require('../../assets/invitaton/rank-18.png') : ''
            })
            this.attentionsData = res.data.account_follower_infos
          } else {
            this.attentionsData = []
          }
          if (this.attentionsData.length === 0 && this.res_flag.attentions) {
            this.show_pagination = false
          } else {
            this.show_pagination = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getFansList (params) {
      this.res_flag.fans = false
      this.http.fansList(params).then(res => {
        if (res.status === 0) {
          this.res_flag.fans = true
          this.fansNumber = res.data.total_num
          this.total = this.fansNumber
          if (res.data.account_follower_infos) {
            res.data.account_follower_infos.forEach(item => {
              item.gradeImg = item.grade === 1 ? require('../../assets/invitaton/rank-1.png') : item.grade === 2 ? require('../../assets/invitaton/rank-2.png') : item.grade === 3 ? require('../../assets/invitaton/rank-3.png')
                : item.grade === 4 ? require('../../assets/invitaton/rank-4.png') : item.grade === 5 ? require('../../assets/invitaton/rank-5.png') : item.grade === 6 ? require('../../assets/invitaton/rank-6.png') : item.grade === 7 ? require('../../assets/invitaton/rank-7.png') : item.grade === 8 ? require('../../assets/invitaton/rank-8.png') : item.grade === 9 ? require('../../assets/invitaton/rank-9.png')
                  : item.grade === 10 ? require('../../assets/invitaton/rank-10.png') : item.grade === 11 ? require('../../assets/invitaton/rank-11.png') : item.grade === 12 ? require('../../assets/invitaton/rank-12.png') : item.grade === 13 ? require('../../assets/invitaton/rank-13.png') : item.grade === 14 ? require('../../assets/invitaton/rank-14.png')
                    : item.grade === 15 ? require('../../assets/invitaton/rank-15.png') : item.grade === 16 ? require('../../assets/invitaton/rank-16.png') : item.grade === 17 ? require('../../assets/invitaton/rank-17.png') : item.grade === 18 ? require('../../assets/invitaton/rank-18.png') : ''
            })
            this.fansData = res.data.account_follower_infos
          } else {
            this.fansData = []
          }
          if (this.fansData.length === 0 && this.res_flag.fans) {
            this.show_pagination = false
          } else {
            this.show_pagination = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    handleClick () {
      this.currentPage = 1
      this.show_pagination = false
      this.start = 1
      if (this.activeName === 'one') {
        this.getArticleList({size: this.size, account_id: this.account_id, status: this.defaultPassage})
      } else if (this.activeName === 'two') {
        this.getCommentsList({size: this.size, account_id: this.account_id})
      } else if (this.activeName === 'three') {
        this.getCollectList({size: this.size, account_id: this.account_id})
      } else if (this.activeName === 'four') {
        this.getAttentionsList({size: this.size, account_id: this.account_id})
      } else if (this.activeName === 'five') {
        this.getFansList({size: this.size, account_id: this.account_id})
      }
    },
    handleCurrentChange (val) {
      document.documentElement.scrollTop = 0
      this.start = val
      if (this.activeName === 'one') {
        this.getArticleList({start: (val - 1) * this.size, size: this.size, account_id: this.account_id, status: this.defaultPassage})
      } else if (this.activeName === 'two') {
        this.getCommentsList({start: (val - 1) * this.size, size: this.size, account_id: this.account_id})
      } else if (this.activeName === 'three') {
        this.getCollectList({start: (val - 1) * this.size, size: this.size, account_id: this.account_id})
      } else if (this.activeName === 'four') {
        this.getAttentionsList({start: (val - 1) * this.size, size: this.size, account_id: this.account_id})
      } else if (this.activeName === 'five') {
        this.getFansList({start: (val - 1) * this.size, size: this.size, account_id: this.account_id})
      }
    }
  }
}
</script>

<style scoped>
  @import "../../styles/home.css";
  .main-container>.view{
    width: 100%;
  }
  .examine-status{
    position:absolute;
    left: 50%;
  }
  .reject_p{
    width: 100%;
    padding-top: 10px ;
    margin-bottom: 0px;
    color: #f25979 !important;
  }
  .demo-ruleForm{
    max-width: 500px;
    margin: 0 auto;
  }
  .max-mout .tmount{
    line-height: 20px;
    color: #999999;
  }
  .notice{
    margin-bottom: 30px;
  }
  .notice .tmount{
    line-height: 20px;
    color: #999999;
  }
  .loginButton{
    width: 100%
  }
  .sure-ruleForm{
    max-width: 500px;
    margin: 0 auto;
    margin-bottom: 50px;
  }
  .no-news-list{
    text-align: center;
    color: #666666;
    height: 60px;
    border-bottom: none!important;
  }
  .no-comments-list{
    text-align: center;
    color: #666666;
    border-bottom: none!important;
  }
  .user-info-head{
    min-height: 100px;
    padding: 12px 12px 12px 160px;
    background: #ffffff;
    position: relative;
    margin-bottom: 20px;
  }
  .user-info-head .avatar-uploader{
    border-radius: 5px;
    overflow: hidden;
    position: absolute;
    left: 20px;
    top: -25px;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    -webkit-transition-property: color;
    transition-property: color;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
  }
  .user-info-head .avatar-uploader .upload {
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    padding: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #ffffff;
  }
  .user-info-head .avatar-uploader .upload:hover {
    border-color: #409EFF;
  }
  .collect_icon{
    margin-top: 4px;
    margin-right: 10px;
  }
  .user-info-head .avatar {
    width: 110px;
    height: 110px;
    display: block;
  }
  .yz-email .el-dialog__footer .el-button{
    width: 50%;
    float: left;
    border-right: 1px solid #e5e5e5;
    padding: 22px 20px;
    position: relative;
    border-radius: 0;
  }
  .yz-email .el-button+.el-button{
    margin-left: 0;
  }
  .edit-btn-small{
    display: none;
  }
  @media only screen and (max-width: 768px){
    .user-info-head .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
    .examine-status{
      right: 0px;
    }
    .examine-status img{
      width: 70px;
    }
    .user-info-head .avatar-uploader{
      top: -20px;
      left: 12px;
    }
    .edit-btn-small{
      display: inline-block;
      margin-right: 10px;
    }
    .edit-btn-big{
      display: none;
    }
    .user-info-head .avatar-uploader:hover .cover-box{
      width: 80px;
      height: 80px;
      left: 5px;
      top: 5px;
      padding: 14px 0px;
    }
    .user-info-head{
      margin-top: 20px;
      padding: 2px 0 15px 105px;
    }
    .trade_style{

    }
    .trade_number{
      font-size: 13px!important;
    }

  }
  .user-info-head .avatar:before{
    content: " 修改头像 ";
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #2098D1;
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transition-property: transform;
    transition-property: transform;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
  }
  .user-info-head .avatar-uploader .cover-box{
    position: absolute;
    width: 110px;
    height: 110px;
    left:5px;
    top: 5px;
    background: rgba(0,0,0,0.4);
    color: #ffffff;
    font-size: 16px;
    padding:25px 0;
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transition-property: transform;
    transition-property: transform;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
  }
  .user-info-head .avatar-uploader:hover .cover-box{
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  .edit-btn{
    line-height: 40px;
    padding: 0 10px;
  }
  .edit-btn span{
    cursor: pointer;
  }
  .user-info-content{
    background: #ffffff;
    padding: 20px 20px 0px 20px;
  }
  .user-info-content .no-passage{
    margin-top: 0;
    padding: 50px 0;
  }
  .comment-box ul li{
    padding: 25px 10px;
  }
  .text-orange{
    color: #f3842b;
  }
  .mr-35{
    margin-right: 35px;
  }
  .comment-box ul li{
    border-bottom: 1px solid #e5e5e5;
  }
  .comment-img-box .item-img{
    width: 150px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .comment-img-box .item-img img{
    min-height: 100%;
    min-width: 100%;
  }
  .other-reply{
    display: inline-block;
    padding: 10px 15px;
    border-radius: 4px;
    background: #f5f5f5;
    position: relative;
    margin-top: 10px;
    color: #666;
  }
  .other-reply:before{
    position: absolute;
    left: 50px;
    top: -8px;
    content: "";
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #f5f5f5;
  }
  .trade_style{
    display: inline-block;
    vertical-align: middle;
    padding: 0 15px;
    font-size: 13px!important;
    cursor: pointer;
    color: #999999;
  }
  .trade_number{
    display: inline-block;
    color:#cc9966;
    font-size: 14px;
    vertical-align: middle;
  }
  .trade_img{
    vertical-align: middle;
    width: auto;
    height: auto;
  }
  .comment-delete-icon{
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    background: #f1f3f7;
    font-size: 24px;
    color: #9fadc2;
    cursor: pointer;
  }
  .comment-delete-icon i{
    margin-right:0;
  }
  .exchange-btn2 .el-button{
    background-color: #c59b56;
    color: #ffffff;
    border: 1px solid #c59b56;
    margin-left: 10px;
  }
  .exchange-btn2 .el-button:hover,.exchange-btn2 .el-button:focus{
    background-color: #c59649;
  }
  .exchange-btn .el-button{
    color: #c59b56;
    border: 1px solid #c59b56;
    margin-left: 10px;
  }
  .exchange-btn .el-button:hover,.exchange-btn .el-button:focus{
    background-color: #c59649;
    color: #ffffff;
  }
  .user-info-item{
    background: #ffffff;
    margin-bottom: 20px;
  }
  .user-info-item ul li{
    padding: 12px 15px;
    border-bottom: 1px solid #f7f7f7;
    line-height: 32px;
  }
  .user-info-item .trade-name{
    margin-right: 10px;
    color: #999999;
  }
  .user-info-item .trade-number{
    color: #cc9966;
  }
  .follow-box{
    background: #ffffff;
  }
  .follow-box ul li{
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
  .follow-btn-phone{
    display:none!important;
  }
  @media only screen and (max-width: 768px){
    .user-info-head .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
    .follow-list-img{
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
    .follow-list-img img{
      width: 100%;
      height: 100%;
    }
    .follow-btn-phone{
      display: block !important;
    }
    .follow-btn-pc{
      display: none!important;
    }
    .follow-box ul li{
      padding: 20px 0;
    }
    .follow-list-text h2{
      font-size: 15px;
      display: inline-block;
      width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;
      white-space: nowrap;
    }
    .follow-list-text h2 .trade-img{
      display: none;
    }
    .examine-status{
      right: 0px;
    }
    .examine-status img{
      width: 70px;
    }
    .user-info-head .avatar-uploader{
      top: -20px;
      left:6px;
    }
    .set-info-other .name{
      font-size: 15px;
      display: inline-block;
      width: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;
      white-space: nowrap;
    }
    .user-info-head{
      margin-top: 20px;
      padding: 10px 0 15px 105px;
    }
    .comment-img-box .item-img{
      margin-right: 6px;
      margin-bottom: 6px;
      width: 46%;
    }
    .news-box li{
      padding: 10px 10px;
    }
  }
</style>
<style>
  .withdrawal-dialog .el-dialog{
    max-width: 800px;
  }
  .sure-dialog .el-dialog{
    max-width: 660px;
  }
  .withdrawal-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .sure-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .withdrawal-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .sure-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .withdrawal-dialog .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }
  .sure-dialog .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }
  .sure-dialog .el-form-item{
    margin-bottom: 10px;
  }
  .sure-dialog .el-form-item__label{
    color: #999999;
  }
  .set-info-other .el-input__inner{
    border-color: transparent;
    background: #ffffff;
    font-weight: 700;
  }
  .set-info-other .el-form-item{
    margin-bottom: 0px;
  }
  .set-info-other .info-p{
    line-height: 32px;
  }
  .set-info-other .name{
    font-size: 20px;
    margin-right: 15px;
  }
  .set-info-other .trade-img {
    margin-bottom: 5px;
    width: auto;
    height: auto;
  }
  .home-el-pagination{
    padding: 20px;
  }
  .home-el-pagination-phone {
    padding: 20px 0;
    display: none;
  }
  @media only screen and (max-width: 768px){
    .set-info-other .el-input__inner{
      width: 110px;
      height: 30px;
      display: block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .set-info-other .el-button+.el-button{
      margin-left: 0;
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
    .set-info-other .el-form-item__content{
      height: 30px;
      line-height: 30px;
    }
    .exchange-btn .el-button--small,.exchange-btn2 .el-button--small{
      padding: 6px 15px
    }
  }
  .inputBackround .el-input__inner{
    border-color: #eeeeee;
    background: #f7f7f7;
  }
  .comment_delete .el-dialog{
    max-width: 480px;
    border-radius: 4px;
  }
  .comment_delete .el-dialog__footer{
    height: 40px;
    background: #ffffff;
    padding: 0;
  }
  .comment_delete .el-dialog__footer .el-button{
    width: 50%;
    border: none;
    float: left;
    border-left: 1px solid #e5e5e5;
    border-radius: 0;
    position: relative;
  }
  .comment_delete .el-button+.el-button{
    margin-left: 0;
  }
  .comment_delete .el-dialog__body{
    border-bottom: 1px solid #e5e5e5;
    font-size: 16px;
  }
  .user-info-content .el-tabs__header{
    margin-bottom: 0px;
  }
  .yz-email .el-dialog{
    max-width: 480px;
    border-radius: 5px;
    overflow: hidden;
  }
  .yz-email .el-dialog__footer{
    padding: 0;
    border-top: 1px solid #e5e5e5;
  }
  .passage-status-select {
    border-bottom: 1px solid rgba(238,238,238,1);
  }
  .passage-status-select .el-input__inner{
    border: none;
    height: 60px;
    font-weight: bold;
    color: rgba(102,102,102,1);
    line-height: 60px;
  }
  .passage-status-select .el-select{
    width: 102px;
  }
</style>
