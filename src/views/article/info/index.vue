<template>
  <div class="container main-container passageDetail-video">
    <img v-if="loginTime" src="../../../assets/detailPic.png" alt="" style="width: 100%">
    <div class="view welcome-view" v-if="!loginTime">
      <div class="welcome-context">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
            <div class="article-header border-radius-4">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-if="artic_info.parent_category_name">{{artic_info.parent_category_name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="artic_info.category_name">{{artic_info.category_name}}</el-breadcrumb-item>
              </el-breadcrumb>
              <h4 class="h4 passage-h4">
                <img src="../../../assets/examine/draft.png" v-if="artic_info.status===2">
                {{artic_info.title}}
                <div class="text-center" v-if="artic_info.status===-2||artic_info.status===-1" :class="[artic_info.status===-2?'passage-reject':artic_info.status===-1?'passage-checkPending':'']">
                  <img :src="artic_info.review_src">
                  <p class="text-overflow-2 mt-5" v-if="artic_info.status===-2">{{artic_info.reason}}</p>
                </div>
              </h4>
              <div class="label-box">
                <span v-for="(item,index) in label" :key="index">{{item.label_name}}</span>
              </div>
              <div class="clearfix author">
                <div class="text-aaa float-left">
                  <span class="user-face" @click="open(artic_info)" style="cursor: pointer"><img  class="img-circle" :src="artic_info.head_url?artic_info.head_url:admin_url" width="48" height="48" :alt="artic_info.account"></span>
                  <span class="name" @click="open(artic_info)" style="cursor: pointer">{{artic_info.account}}</span>
                  <span class="date">{{artic_info.created_time}}</span>
                  <span class="look"><i class="el-icon-view"></i>{{artic_info.read_number}}</span>
                </div>
                <div class="text-aaa float-left">
                </div>
              </div>
            </div>
            <div class="article-main border-radius-4"  id='article-main' style="margin-bottom: 0px">
            </div>
            <div class="collect clearfix">
              <div class="pull-left rewarded-list">
                <ul>
                  <li class="rewarded-li" v-for="(item,index) in rewardList" :key="index" @click="goToHim(item.rewarder_id)">
                    <p class="rewarded-face"><img :src="item.head_url?item.head_url:admin_url" alt="头像"></p>
                    <p class="rewarded-number">赏{{item.amount}}金币</p>
                  </li>
                  <li v-if="rewardNumber>5" @click="getAllreward">
                    <p class="rewarded-face"><img :src="rewardUrl" alt=""></p>
                    <p class="rewarded-number">共{{rewardNumber}}人打赏</p>
                  </li>
                </ul>
              </div>
              <div class="pull-right">
                <span class="cancal_collected rewarded" @click="rewardShow = true"><i class="fa"><img src="../../../assets/icon/icon-reward-money.png" alt=""></i>打赏</span>
                <el-tooltip class="item" effect="dark" content="收藏" placement="top" v-if="!artic_info.collect_status">
                  <span class="collected" @click="collect({article_id:article_id,collect_status:2})"><i class="fa fa-star" aria-hidden="true"></i>收藏</span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="取消" placement="top" v-if="artic_info.collect_status">
                  <span class="cancal_collected" @click="collect({article_id:article_id,collect_status:1})"><i class="fa fa-star" aria-hidden="true"></i>已收藏</span>
                </el-tooltip>
                <el-popover
                  popper-class="jubao-popover"
                  placement="bottom"
                  trigger="click"
                >
                  <div @click="reportShow=true" class="jubao-img"><img src="../../../assets/infojubao.png" alt="" class="ml-10"><span class="ml-10">举报</span></div>
                  <i class="el-icon-more el-icon-jubao"  slot="reference"></i>
                </el-popover>
              </div>
            </div>
            <iframe class="iframe895" :src="routerUrl1" width="100%" scrolling="no" frameborder="0" style="margin: 0 auto 15px auto"></iframe>
            <div class="reply-main border-radius-4">
              <div class="reply-item-con" id="comment">
                <template>
                  <comment v-bind:comments="commentData" v-bind:article_id="article_id"  v-bind:can_forbid_comment="can_forbid_comment"  v-bind:can_delete_comment="can_delete_comment" @getData="getComentsList"></comment>
                </template>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6" v-if="listData.length>0">
            <iframe class="iframe285" :src="routerUrl2" width="100%" scrolling="no" frameborder="0"></iframe>
            <div class="related-main border-radius-4">
              <div class="related-title">
                <h2 class="text-primary"><img src="../../../assets/icon/icon-related.png" alt="" style="margin-right: 5px;margin-top: -2px">相关推荐</h2>
              </div>
              <div class="news-box related-box">
                <ul>
                  <li class="news-list" v-for="(item,index) in listData" :key="index">
                    <router-link :to="path+item.article_id+'&&from=list'">{{item.title}}</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="!loginTime">
      <div class="admin_operate" v-if="hasShow||permissionButton.can_delete_comment||permissionButton.can_review">
        <p class="admin_operate_p">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
              <div class="laylout_comment">
                <div>
                  <span @click="reviewShow = true" class="operator_icon" v-if="permissionButton.can_review"><i class="el-icon-warning-outline"></i>审核文章</span>
                  <el-dropdown trigger="click" placement="top-start" :hide-on-click="false">
                    <span class="el-dropdown-link">
                       <span> <i class="el-icon-setting"></i> 设置</span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="permissionButton.can_hide_article"> <el-checkbox v-model="hide_checked"  @change="hideStatus(article_id,hide_checked)">设为隐藏状态</el-checkbox><i class="icon-question" @click="hiddenExplain"></i></el-dropdown-item>
                      <el-dropdown-item v-if="permissionButton.can_set_article_top"><span @click="topShow = true"  class="operator_icon"><i class="el-icon-download"></i>置顶文章</span></el-dropdown-item>
                      <router-link :to="`/articleEditor?article_id=${this.$route.query.article_id}`" v-if="hasShow"><el-dropdown-item><span class="operator_icon"><i class="el-icon-edit-outline"></i>修改文章</span></el-dropdown-item></router-link>
                      <el-dropdown-item><span @click="dialogDelete = true"  class="operator_icon"  v-if="permissionButton.can_delete_article||hasShow"><i class="el-icon-circle-close"></i>删除文章</span></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div @click="commentPostion">
                  <span>{{total}}条评论</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </p>
      </div>
    </div>
    <!--查看大图-->
    <div class="el-image-viewer__wrapper passageDetail" v-if="checkImg" style="z-index: 2000;">
      <div class="el-image-viewer__mask"></div>
      <span class="el-image-viewer__btn el-image-viewer__close" @click="checkImg=false">
        <i class="el-icon-circle-close"></i>
      </span>
      <span class="el-image-viewer__btn el-image-viewer__prev" v-if="images_viewer.length>1" @click="prev"><i class="el-icon-arrow-left"></i></span>
      <span class="el-image-viewer__btn el-image-viewer__next" v-if="images_viewer.length>1" @click="next"><i class="el-icon-arrow-right"></i></span>
      <div class="loading-div">
        <div class="el-image-viewer__canvas">
          <img :src="item.original_url" v-if="current_img_key==item.index" class="el-image-viewer__img" v-for="(item,index) in images_viewer"  :key="index" style="transform: scale(1) rotate(0deg); margin-left: 0px; margin-top: 0px; max-height: 100%; max-width: 100%;">
        </div>
        <p class="img-page">{{current_img_index+1}} / {{images_viewer.length}}</p>
      </div>
    </div>
    <!---->
    <el-dialog
      class="comment_delete"
      title="删除文章"
      align="center"
      :visible.sync="dialogDelete">
      <span>确定删除该文章吗？删除后文章及评论内容都一起删除，且不可恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogDelete = false">关闭</el-button>
        <el-button type="text" @click="updateText({article_id:article_id})">确 定</el-button>
      </span>
    </el-dialog>
    <!--安全验证-->
    <el-dialog
      class="safe_dialog"
      align="center"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="goBack"
      :visible.sync="safe_dialog">
      <div class="mb-15"><img :src="picImg" alt="图片验证码"  @click="getPic()"></div>
      <el-form :model="ruleSafeForm" :rules="ruleSafe" ref="ruleSafeForm"  label-width="0" class="demo-ruleForm clearfix" @submit.native.prevent>
        <div class="yanz">
          <el-form-item  prop="captcha" class="picYz">
            <el-input placeholder="请输入验证码"   v-model="ruleSafeForm.captcha" @keyup.enter.native="goVerify('ruleSafeForm')"></el-input>
          </el-form-item>
        </div>
        <div class="primary">
          <el-button type="primary" @click="goVerify('ruleSafeForm')" :disabled="!ruleSafeForm.captcha">验证</el-button>
        </div>
      </el-form>
    </el-dialog>
    <diglog-components :scene="text_tips" :modal-show.sync="modalShow" :needBack="needBack"></diglog-components>
    <review_article :modalReviewShow.sync="reviewShow"  :article-id="this.$route.query.article_id"></review_article>
    <report_article :modalReportShow.sync="reportShow"  :article-id="this.$route.query.article_id" :articleTitle="artic_info.title"></report_article>
    <hidden_detail :modalHiddenShow.sync="hiddenShow" ></hidden_detail>
    <download_video :modalDownloadShow.sync="downloadShow"  :score="videoScore" :videoId="videoId"></download_video>
    <grade_diglog :scene="scene" :modalGradeShow.sync="modalGradeShow" :gradeNeedBack="gradeNeedBack"></grade_diglog>
    <top-diglog :modalTopShow.sync="topShow" :articleId="article_id" :topNum="artic_info.top_position"></top-diglog>
    <reward-article :modalRewardShow.sync="rewardShow" :articleId="this.$route.query.article_id"></reward-article>
    <coin-warn :modalCoinWarnShow.sync="coinWarnShow" :allCoinNum="coin_num" :rewardNum="reward_num"></coin-warn>
    <el-dialog class="reward-record-dialog" :title="`打赏记录（共${rewardNumber}条打赏）`" :visible.sync="rewardRecordVisible">
      <div class="reward-record-box">
        <ul>
          <li class="clearfix" v-for="(item,index) in rewardRecordList" :key="index">
            <span class="pull-left reward-face-name" >
              <img :src="item.head_url?item.head_url:admin_url" alt="头像" width="48" height="48" @click="goToHim(item.rewarder_id)">
              打赏{{item.amount}}金币
            </span>
            <span class="pull-right reward-record-time">
                {{item.rewarded_at}}
            </span>
          </li>
        </ul>
      </div>
      <div class="box-pagination">
        <el-pagination
          background
          @size-change="handleSizeChangeRecord"
          @current-change="handleCurrentChangeRecord"
          :current-page="currentPage2"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="size2"
          :total="total2"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import comment from '../../../components/comment'
import globalPopup from '../../../components/popup'
import diglogComponents from '../../../components/diglogComponents'
import reviewArticle from '../../../components/review_article'
import reportArticle from '../../../components/reportArticle'
import hiddenDetail from '../../../components/hiddenDetail'
import downloadVideo from '../../../components/downloadVideo'
import gradeDiglog from '../../../components/gradeDiglog'
import isTopDiglog from '../../../components/isTopDiglog'
import rewardArticle from '../../../components/rewardArticle'
import coinWarn from '../../../components/coinWarn'
import store from '../../../store/index'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
export default {
  name: 'ArticleInfo',
  components: {
    'comment': comment,
    'global-popup': globalPopup,
    'diglog-components': diglogComponents,
    'review_article': reviewArticle,
    'report_article': reportArticle,
    'hidden_detail': hiddenDetail,
    'download_video': downloadVideo,
    'grade_diglog': gradeDiglog,
    'top-diglog': isTopDiglog,
    'reward-article': rewardArticle,
    'coin-warn': coinWarn
  },
  inject: ['reload'],
  data () {
    return {
      routerUrl1: '',
      routerUrl2: '',
      text_tips: '',
      scene: '',
      modalGradeShow: false,
      gradeNeedBack: true,
      checkImg: false,
      hide_checked: false,
      current_img_key: '',
      current_img_index: 0,
      images_viewer: [],
      resultArr: [],
      safe_dialog: false,
      loginTime: false,
      modalShow: false,
      reviewShow: false,
      reportShow: false,
      rewardShow: false,
      rewardStatus: false,
      permissionButton: {},
      can_delete_comment: false,
      can_forbid_comment: false,
      hiddenShow: false,
      topShow: false,
      downloadShow: false,
      videoScore: 0,
      videoId: null,
      needBack: true,
      hlsArray: [],
      label_name: {},
      ruleSafeForm: {},
      picImg: require('../../../assets/person-face03.png'),
      ruleSafe: {
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      dialogDelete: false,
      path: '/article/info?article_id=',
      path2: '#/otherUserInfo?account_id=',
      admin_url: require('../../../../static/images/toux.png'),
      hasShow: false,
      article_id: '',
      artic_info: {},
      label: [],
      search: '',
      total: 0,
      showSearch: false,
      commentData: [],
      listData: [],
      rewardList: [],
      rewardNumber: 0,
      rewardUrl: require('../../../assets/icon/icon-more-reward.png'),
      rewardRecordVisible: false,
      rewardRecordList: [],
      coinWarnShow: false,
      coin_num: 0,
      reward_num: 0,
      total2: 0,
      size2: 5,
      currentPage2: 1
    }
  },
  mounted () {
    let _this = this
    this.$nextTick(function () {
      setTimeout(function () {
        var videos = document.getElementsByTagName('video')
        for (var i = videos.length - 1; i >= 0; i--) {
          (function () {
            var p = i
            videos[p].addEventListener('play', function () {
              pauseAll(p)
            })
          })()
        }
        function pauseAll (index) {
          for (var j = videos.length - 1; j >= 0; j--) {
            if (j !== index)videos[j].pause()
          }
        }
      }, 1000)
      setTimeout(function () {
        var audios = document.getElementsByTagName('audio')
        for (var i = audios.length - 1; i >= 0; i--) {
          (function () {
            var p = i
            audios[p].addEventListener('play', function () {
              pauseAll(p)
            })
          })()
        }
        function pauseAll (index) {
          for (var j = audios.length - 1; j >= 0; j--) {
            if (j !== index) {
              audios[j].pause()
              $(audios[j]).parent().find('.audioPlayer').eq(0).get(0).src = require('../../../assets/audio/icon-pause.png')
            }
          }
        }
      }, 1000)
      setTimeout(function () {
        $('#article-main').delegate('.passageDetail_img', 'click', function () {
          _this.checkImg = true
          // 到时候得添加原图  这里暂时得用这个
          _this.current_img_key = $(this).attr('data-index')
          if (_this.images_viewer.length > 1) {
            for (let c = 0; c < _this.images_viewer.length; c++) {
              if (_this.images_viewer[c].index === _this.current_img_key) {
                _this.current_img_index = c
                break
              }
            }
          }
        })
        $('#article-main').delegate('.zm_video', 'click', function () {
          _this.$toast('视频转码中,稍后请刷新页面重试....', 2000, 'common')
        })
        if (document.body.clientWidth < 992) {
          $('#article-main').delegate('.vjs-icon-download', 'touchstart', function () {
            var videoId = $(this).closest('.video-js').find('video').attr('data-videoId')
            _this.video_download({action: 'download_video', resources_id: videoId})
          })
        } else {
          $('#article-main').delegate('.vjs-icon-download', 'click', function () {
            var videoId = $(this).closest('.video-js').find('video').attr('data-videoId')
            _this.video_download({action: 'download_video', resources_id: videoId, article_id: _this.$route.query.article_id})
          })
        }
      }, 500)
      if (this.$route.query.scroll_id === 'comment') {
        setTimeout(function () {
          try {
            document.getElementById('comment').scrollIntoView()
          } catch (error) {
          }
        }, 500)
      }
      this.scoreJudgement({action: 'read_article', resources_id: this.$route.query.article_id})
    })
    this.getNewestReward(this.$route.query.article_id, {size: 6})
  },
  watch: {
    $route (to, from) {
      let _this = this
      this.$nextTick(function () {
        setTimeout(function () {
          var videos = document.getElementsByTagName('video')
          for (var i = videos.length - 1; i >= 0; i--) {
            (function () {
              var p = i
              videos[p].addEventListener('play', function () {
                pauseAll(p)
              })
            })()
          }
          function pauseAll (index) {
            for (var j = videos.length - 1; j >= 0; j--) {
              if (j !== index)videos[j].pause()
            }
          }
        }, 1000)
        setTimeout(function () {
          var audios = document.getElementsByTagName('audio')
          for (var i = audios.length - 1; i >= 0; i--) {
            (function () {
              var p = i
              audios[p].addEventListener('play', function () {
                pauseAll(p)
              })
            })()
          }
          function pauseAll (index) {
            for (var j = audios.length - 1; j >= 0; j--) {
              if (j !== index) audios[j].pause()
            }
          }
        }, 1000)
        setTimeout(function () {
          $('#article-main').delegate('.passageDetail_img', 'click', function () {
            _this.checkImg = true
            // 到时候得添加原图  这里暂时得用这个
            _this.current_img_key = $(this).attr('data-index')
            if (_this.images_viewer.length > 1) {
              for (let c = 0; c < _this.images_viewer.length; c++) {
                if (_this.images_viewer[c].index === _this.current_img_key) {
                  _this.current_img_index = c
                  break
                }
              }
            }
          })
          $('#article-main').delegate('.zm_video', 'click', function () {
            _this.$toast('视频转码中,稍后请刷新页面重试....', 2000, 'common')
          })
          if (document.body.clientWidth < 992) {
            $('#article-main').delegate('.vjs-icon-download', 'touchstart', function () {
              var videoId = $(this).closest('.video-js').find('video').attr('data-videoId')
              _this.video_download({action: 'download_video', resources_id: videoId})
            })
          } else {
            $('#article-main').delegate('.vjs-icon-download', 'click', function () {
              var videoId = $(this).closest('.video-js').find('video').attr('data-videoId')
              _this.video_download({action: 'download_video', resources_id: videoId, article_id: _this.$route.query.article_id})
            })
          }
        }, 500)
        if (this.$route.query.scroll_id === 'comment') {
          setTimeout(function () {
            try {
              document.getElementById('comment').scrollIntoView()
            } catch (error) {
            }
          }, 500)
        }
        if (this.hlsArray.length > 0) {
          this.hlsArray.forEach(item => {
            item.dispose()
          })
          this.hlsArray = []
        }
        this.scoreJudgement({action: 'read_article', resources_id: this.$route.query.article_id})
      })
    },
    loginTimeOut (val) {
      if (val) {
        this.loginTime = true
      }
    },
    loginStyle (val) {
      if (val) {
        this.hasShow = false
      }
    }
  },
  computed: {
    loginStyle () {
      return this.$store.state.login_status
    },
    loginTimeOut () {
      return this.$store.state.timeOut
    }
  },
  beforeDestroy () {
    if (this.hlsArray.length > 0) {
      this.hlsArray.forEach(item => {
        item.dispose()
      })
    }
  },
  created () {
    this.routerUrl1 = window.location.protocol + '//' + window.location.host + '/html5/activityPage/pc_articleInfo.html'
    this.routerUrl2 = window.location.protocol + '//' + window.location.host + '/html5/activityPage/pc_articleInfo_right.html'
    this.article_id = this.$route.query.article_id
  },
  methods: {
    open (info) {
      window.open(this.path2 + info.account_id, '_blank')
    },
    hiddenExplain () {
      this.hiddenShow = true
    },
    next () {
      if (this.current_img_index === (this.images_viewer.length - 1)) {
        this.$toast('亲，已经没有图片了', 2000, 'warning')
      } else {
        this.current_img_index = this.current_img_index + 1
        this.current_img_key = this.images_viewer[this.current_img_index].index
      }
    },
    prev () {
      if (this.current_img_index === 0) {
        this.$toast('亲，已经没有图片了', 2000, 'warning')
      } else {
        this.current_img_index = this.current_img_index - 1
        this.current_img_key = this.images_viewer[this.current_img_index].index
      }
    },
    goVerify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.http.articleCaptcha(this.ruleSafeForm).then(res => {
            if (res.status === 0) {
              this.reload()
            } else {
              this.ruleSafeForm.captcha = ''
              this.getPic()
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        } else {
          return false
        }
      })
    },
    goBack () {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') !== -1 || userAgent.indexOf('Chrome') !== -1) {
        this.$router.push({path: '/home'})
        window.close()
      } else {
        window.opener = null
        window.open('', '_self')
        window.close()
      }
    },
    getPic () {
      // 参数还得修改
      this.http
        .detailCaptcha({captcha_type: 'article', width: 600, height: 600})
        .then(res => {
          if (res.status === 0) {
            this.picImg = res.data.captcha_base64
            this.ruleSafeForm.captcha_id = res.data.captcha_id
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    collect (params) {
      this.http.collectOperate(params).then(res => {
        if (res.status === 0) {
          if (params.collect_status === 1) {
            this.artic_info.collect_status = false
          } else if (params.collect_status === 2) {
            this.artic_info.collect_status = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    video_download (params) {
      this.http.getScoreJudgement(params).then(res => {
        if (res.status === 0) {
          if (res.data.is_satisfy) {
            if (this.Cookies.get('downloadVideoTips')) {
              this.video_download_judgement(params.resources_id, {article_id: this.$route.query.article_id})
            } else {
              this.downloadShow = true
              this.videoScore = res.data.limit_score
              this.videoId = params.resources_id
            }
          } else {
            this.video_download_judgement(params.resources_id, {article_id: this.$route.query.article_id})
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    scoreJudgement (params) {
      this.http.getScoreJudgement(params).then(res => {
        if (res.status === 0) {
          // 判断根据接口判断时候存在，积分是否足够
          if (res.data.is_satisfy && res.data.resource_status === 0) {
            if (!this.Cookies.get('info')) {
              store.commit('flagLogin', true)
              store.commit('flagTime', true)
            } else {
              if (this.Cookies.get('info')) {
                if (JSON.parse(this.Cookies.get('info')).is_moderator) {
                  this.permission_judgement()
                }
              }
              this.passageDetail({article_id: this.$route.query.article_id})
              this.getComentsList({article_id: this.$route.query.article_id})
            }
          } else if (!res.data.is_satisfy && res.data.resource_status !== 0) {
            this.$router.push('/nopassage')
          } else if (!res.data.is_satisfy && res.data.resource_status === 0) {
            if (res.data.grade) {
              // 等级不够
              this.modalGradeShow = true
              this.modalShow = true
              let grade = res.data.grade === 1 ? 'LV1'
                : res.data.grade === 2 ? 'LV2'
                  : res.data.grade === 3 ? 'LV3'
                    : res.data.grade === 4 ? 'LV4'
                      : res.data.grade === 5 ? 'LV5'
                        : res.data.grade === 6 ? 'LV6'
                          : res.data.grade === 7 ? 'LV7'
                            : res.data.grade === 8 ? 'LV8'
                              : res.data.grade === 9 ? '黄金1'
                                : res.data.grade === 10 ? '黄金2'
                                  : res.data.grade === 11 ? '黄金3'
                                    : res.data.grade === 12 ? '铂金1'
                                      : res.data.grade === 13 ? '铂金2'
                                        : res.data.grade === 14 ? '铂金3'
                                          : res.data.grade === 15 ? '钻石1'
                                            : res.data.grade === 16 ? '钻石2'
                                              : res.data.grade === 17 ? '钻石3'
                                                : res.data.grade === 18 ? '皇冠' : ''

              this.scene = `很抱歉,您的等级太低,不能阅读了！！<br /> <span style="color: red">${grade} </span>或以上会员才能阅读该文章`
            }
            if (res.data.read_limit_score) {
              this.modalGradeShow = true
              this.modalShow = true
              this.scene = `很抱歉,您的等级太低,不能阅读了！！<br /> <span style="color: red">>=${res.data.read_limit_score} </span>积分的会员才能阅读该文章`
            }
            if (res.data.limit_score) {
              this.text_tips = ` 阅读该文章需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再阅读`
              this.modalShow = true
            }
            store.commit('flagTime', true)
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    video_download_judgement (id, params) {
      this.http.videoJudement(id, params).then(res => {
        if (res.status === 0) {
          if (res.data.is_satisfy) {
            this.downloadVideoStream(res.data.video_url)
          } else {
            this.text_tips = ` 下载该视频需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再下载`
            this.modalShow = true
            this.needBack = false
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    downloadVideoStream (url) {
      if (this.system() === 'iPhone' || this.system() === 'isMac') {
        window.location.href = url
      } else {
        window.open(url, '_blank')
      }
    },
    system () {
      var u = navigator.userAgent
      console.log(navigator.userAgent)
      if (u.indexOf('Android') > -1) {
        return 'Android'
      } else if (u.indexOf('iPhone') > -1) {
        return 'iPhone'
      } else if (u.indexOf('Windows Phone') > -1) {
        return 'windows'
      } else if (/macintosh|mac os x/i.test(u)) {
        return 'isMac'
      }
    },
    permission_judgement () {
      this.http.permissionJudgement({article_id: this.$route.query.article_id}).then(res => {
        if (res.status === 0) {
          this.permissionButton = res.data
          this.can_delete_comment = res.data.can_delete_comment
          this.can_forbid_comment = res.data.can_forbid_comment
          if (res.data.can_hide_article === 1) {
            this.hide_checked = false
          } else if (res.data.can_hide_article === 2) {
            this.hide_checked = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    updateText (params) {
      this.http.deleteArticle(params).then(res => {
        if (res.status === 0) {
          this.$router.push('/home')
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    transTime (value) {
      let time = ''
      let h = parseInt(value / 3600)
      value %= 3600
      let m = parseInt(value / 60)
      let s = parseInt(value % 60)
      if (h > 0) {
        time = this.formatTime(h + ':' + m + ':' + s)
      } else {
        time = this.formatTime(m + ':' + s)
      }

      return time
    },
    formatTime (value) {
      let time = ''
      let s = value.split(':')
      let i = 0
      for (; i < s.length - 1; i++) {
        time += s[i].length === 1 ? ('0' + s[i]) : s[i]
        time += ':'
      }
      time += s[i].length === 1 ? ('0' + s[i]) : s[i]

      return time
    },
    audioEnded (audio) {
      $(audio).parent().find('.progressBar').eq(0).get(0).style.width = 0
      $(audio).parent().find('.progressDot').eq(0).get(0).style.left = 0
      $(audio).parent().find('.audioCurTime').eq(0).get(0).innerText = this.transTime(0)
      $(audio).parent().find('.audioPlayer').eq(0).get(0).src = require('../../../assets/audio/icon-pause.png')
    },
    dragProgressDotEvent (audio) {
      let _this = this
      let dot = $(audio).parent().find('.progressDot').eq(0).get(0)
      let progressBarBg = $(audio).parent().find('.progressBarBg').eq(0).get(0)

      let position = {
        oriOffestLeft: 0, // 移动开始时进度条的点距离进度条的偏移值
        oriX: 0, // 移动开始时的x坐标
        maxLeft: 0, // 向左最大可拖动距离
        maxRight: 0 // 向右最大可拖动距离
      }
      let flag = false // 标记是否拖动开始

      // 鼠标按下时
      dot.addEventListener('mousedown', down, false)
      dot.addEventListener('touchstart', down, false)

      // 开始拖动
      document.addEventListener('mousemove', move, false)
      document.addEventListener('touchmove', move, false)

      // 拖动结束
      document.addEventListener('mouseup', end, false)
      document.addEventListener('touchend', end, false)

      function down (event) {
        if (!audio.paused || audio.currentTime !== 0) { // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
          flag = true

          position.oriOffestLeft = dot.offsetLeft
          position.oriX = event.touches ? event.touches[0].clientX : event.clientX // 要同时适配mousedown和touchstart事件
          position.maxLeft = position.oriOffestLeft // 向左最大可拖动距离
          position.maxRight = progressBarBg.offsetWidth - position.oriOffestLeft // 向右最大可拖动距离

          // 禁止默认事件（避免鼠标拖拽进度点的时候选中文字）
          if (event && event.preventDefault) {
            event.preventDefault()
          } else {
            event.returnValue = false
          }

          // 禁止事件冒泡
          if (event && event.stopPropagation) {
            event.stopPropagation()
          } else {
            window.event.cancelBubble = true
          }
        }
      }

      function move (event) {
        if (flag) {
          var clientX = event.touches ? event.touches[0].clientX : event.clientX // 要同时适配mousemove和touchmove事件
          var length = clientX - position.oriX
          if (length > position.maxRight) {
            length = position.maxRight
          } else if (length < -position.maxLeft) {
            length = -position.maxLeft
          }
          var pgsWidth = parseFloat(window.getComputedStyle(progressBarBg, null).width.replace('px', ''))
          var rate = (position.oriOffestLeft + length) / pgsWidth
          audio.currentTime = audio.duration * rate
          _this.updateProgress(audio)
        }
      }

      function end () {
        flag = false
      }
    },
    updateProgress (audio) {
      var value = audio.currentTime / audio.duration
      $(audio).parent().find('.progressBar').eq(0).get(0).style.width = value * 100 + '%'
      $(audio).parent().find('.progressDot').eq(0).get(0).style.left = value * 100 + '%'
      $(audio).parent().find('.audioCurTime').eq(0).get(0).innerText = this.transTime(audio.currentTime)
    },
    initAudioEvent (audio) {
      let _this = this
      let audioPlayer = $(audio).parent().find('.audioPlayer').eq(0).get(0)
      let audioTotalTime = $(audio).parent().find('.audioTotalTime').eq(0).get(0)
      let progressBarBg = $(audio).parent().find('.progressBarBg').eq(0).get(0)
      audio.load()
      audio.oncanplay = function () {
        audioTotalTime.innerText = _this.transTime(audio.duration)
      }
      // 监听音频播放时间并更新进度条
      audio.addEventListener('timeupdate', function () {
        _this.updateProgress(audio)
      }, false)

      // 监听播放完成事件
      audio.addEventListener('ended', function () {
        _this.audioEnded(audio)
      }, false)

      // 点击播放/暂停图片时，控制音乐的播放与暂停
      audioPlayer.addEventListener('click', function () {
        // 改变播放/暂停图片
        if (audio.paused) {
          // 开始播放当前点击的音频
          audio.play()
          audioPlayer.src = require('../../../assets/audio/icon-play.png')
        } else {
          audio.pause()
          audioPlayer.src = require('../../../assets/audio/icon-pause.png')
        }
      }, false)
      progressBarBg.addEventListener('mousedown', function (event) {
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        if (!audio.paused || audio.currentTime !== 0) {
          var pgsWidth = parseFloat(window.getComputedStyle(progressBarBg, null).width.replace('px', ''))
          var rate = event.offsetX / pgsWidth
          audio.currentTime = audio.duration * rate
          _this.updateProgress(audio)
        }
      }, false)

      // 拖动进度点调节进度
      _this.dragProgressDotEvent(audio)
    },
    passageDetail (params) {
      this.images_viewer = []
      this.http.passageInfo(params).then(res => {
        if (res.status === 0) {
          document.title = res.data.article_info.title + '-' + window.GlodConfig.title
          window.sessionStorage.setItem('category_info_id', res.data.article_info.category_id)
          res.data.article_info.created_time = this.formatToBeforeTime(res.data.article_info.created_time)
          if (res.data.article_info.content) {
            if (res.data.article_info.videos.length > 0 || res.data.article_info.images.length > 0 || res.data.article_info.audios.length > 0) {
              let videos = res.data.article_info.videos
              let images = res.data.article_info.images
              let audios = res.data.article_info.audios
              let regAudio = /<audio [^>]*src=['"]([^'"]+)[^>]*>/gi
              let regVideo = /<video [^>]*src=['"]([^'"]+)[^>]*>/gi
              let regImg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi
              res.data.article_info.content = res.data.article_info.content.replace(regImg, function (match, capture, index) {
                return ` <img  class="passageDetail_img" src="${capture}" data-index="${index}" style="object-fit: contain;">`
              })
              res.data.article_info.content = res.data.article_info.content.replace(regVideo, function (match, capture) {
                let id = Math.random().toString(36).substr(4)
                return `   <video
                id="myVideo-${id}"
                class="video-js vjs-big-play-centered vjs-tech"
                playsinline
                webkit-playsinline
                x5-video-player-type="h5"
                controls
                preload="auto"
                height="400"
                poster=""
                data-VideoId=""
                >
                  <source src="${capture}">
                  </video>`
              })
              res.data.article_info.content = res.data.article_info.content.replace(regAudio, function (match, capture) {
                let audioIco = require('../../../assets/audio/icon-pause.png')
                return `  <div class="audio-box"> <div class="audio-wrapper clearfix"><audio><source src="${capture}"></audio><div class="audio-left"> <img class="audioPlayer" src="${audioIco}"></div><div class="audio-right pull-left"><p class="text-overflow-1 audio_fileName"></p><div class="progress-bar-bg progressBarBg"><span class="progressDot"></span><div class="progress-bar progressBar"></div></div></div><div class="audio-time pull-right"><span class="audio-length-current audioCurTime" id="audioCurTime">00:00</span><span>/</span><span class="audio-length-total audioTotalTime">00:00</span></div></div></div>`
              })
              let dom = $(res.data.article_info.content)
              let videosDom = dom.find('video')
              let imageDom = dom.find('.passageDetail_img')
              let audioDom = dom.find('audio')
              images.forEach((item, key) => {
                item.index = imageDom.eq(key).attr('data-index')
              })
              this.images_viewer = images
              videos.forEach((item, index) => {
                let poster = item.cover && item.cover.length > 0 ? item.cover[0].url : item.screen_shot && item.screen_shot.length > 0 ? item.screen_shot[0].url : ''
                if (res.data.article_info.status === -1 || res.data.article_info.status === -2 || res.data.article_info.status === 2) { // 待审核 草稿 审核驳回(播放原视频)
                  videosDom.eq(index).find('source').eq(0).attr('type', 'video/mp4')
                  videosDom.eq(index).attr('poster', poster)
                  videosDom.eq(index).attr('data-VideoId', item.video.id)
                } else {
                  if (item.status === 1) {
                    videosDom.eq(index).find('source').eq(0).attr('type', 'application/x-mpegURL')
                    videosDom.eq(index).attr('poster', poster)
                    videosDom.eq(index).attr('data-VideoId', item.video.id)
                  } else {
                    let bofang = require('../../../assets/video3.png')
                    videosDom.eq(index).replaceWith(`<span class="zm_span"><video  width="100%" poster="${poster}"></video><img src="${bofang}"  class="zm_video"></span>`)
                  }
                }
              })
              audios.forEach((item, index) => {
                audioDom.eq(index).parent().find('.audio_fileName').eq(0).text(item.name)
              })
              $('#article-main').html(dom)
              let videosContols = document.getElementsByTagName('video')
              for (let i = 0; i < videosContols.length; i++) {
                var video = videosContols[i]
                if (video.className.indexOf('video-js') > -1) {
                  let videoPlayer = Video(video.id)
                  let downloadBtn = videoPlayer.controlBar.addChild('button')
                  downloadBtn.addClass('vjs-icon-download')
                  this.hlsArray.push(videoPlayer)
                }
              }

              let audioContols = document.getElementsByTagName('audio')
              for (let j = 0; j < audioContols.length; j++) {
                var audio = audioContols[j]
                this.initAudioEvent(audio)
              }
            } else {
              res.data.article_info.content = '<div>' + res.data.article_info.content + '</div>'
              let dom = $(res.data.article_info.content)
              $('#article-main').html(dom)
            }
          }
          res.data.article_info.review_src = res.data.article_info.status === -1 ? require('../../../assets/examine/checkPending_big.png') : res.data.article_info.status === -2 ? require('../../../assets/examine/reject_big.png') : ''
          this.artic_info = res.data.article_info
          this.label = res.data.article_info.label
          this.account_id = res.data.article_info.account_id
          let accountId = this.Cookies.get('info') ? JSON.parse(this.Cookies.get('info')).account_id : null
          if (accountId === this.account_id) {
            this.hasShow = true
          } else {
            this.hasShow = false
          }
          this.getArticleLists({ category_id: res.data.article_info.category_id, article_id: this.$route.query.article_id })
          if (res.data.article_info.limit_score > 0) {
            this.$toast('阅读文章扣' + res.data.article_info.limit_score + '积分', 2000, 'common')
          }
        } else if (res.status === 2995) {
          store.commit('flagTime', true)
          this.getPic()
          this.safe_dialog = true
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getArticleLists (params) {
      this.http.recomendLists(params).then(res => {
        if (res.status === 0) {
          if (res.data.articles_info && res.data.articles_info.length > 0) {
            this.listData = res.data.articles_info
          } else {
            this.listData = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    hideStatus (id, params) {
      let state = params ? -4 : 1
      this.http.passageHidden(id, {status: state}).then(res => {
        if (res.status === 0) {
          if (state === -4) {
            this.$toast('已设置隐藏', 2000, 'common')
          } else if (state === 1) {
            this.$toast('已取消隐藏', 2000, 'common')
          }
        } else {
          if (state === -4) {
            this.hide_checked = false
          } else if (state === 1) {
            this.hide_checked = true
          }
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getComentsList (params) {
      this.http.passageCommentLists(params).then(res => {
        if (res.status === 0) {
          this.total = res.data.total_number
          if (res.data.article_comments) {
            res.data.article_comments.forEach(item => {
              item.total_number = res.data.total_number
              item.first_number = res.data.first_number
              item.showSub = true
              item.time = this.formatToBeforeTime(item.time)
              item.srcList = item.image_url ? item.image_url.map(c => c.original_url) : []
              if (item.reply) {
                item.reply.forEach(item1 => {
                  item1.time = this.formatToBeforeTime(item1.time / 1000000000)
                  item1.srcList = item1.image_url ? item1.image_url.map(c => c.original_url) : []
                })
              }
            })
            this.commentData = res.data.article_comments
          } else {
            this.commentData = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    commentPostion () {
      document.getElementById('comment').scrollIntoView()
    },
    getNewestReward (id, params) {
      this.http.rewardArticleList(id, params).then(res => {
        if (res.status === 0) {
          if (res.data.reward_list && res.data.reward_list.length > 0) {
            this.rewardNumber = res.data.total_num
            if (res.data.reward_list.length > 5) {
              this.rewardList = res.data.reward_list.slice(0, 5)
            } else {
              this.rewardList = res.data.reward_list
            }
          } else {
            this.rewardList = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getRewardLists (id, params) {
      this.http.rewardArticleList(id, params).then(res => {
        if (res.status === 0) {
          if (res.data.reward_list && res.data.reward_list.length > 0) {
            this.total2 = res.data.total_num
            res.data.reward_list.forEach(item => {
              item.rewarded_at = this.getTime(item.rewarded_at)
            })
            this.rewardRecordList = res.data.reward_list
          } else {
            this.rewardRecordList = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getAllreward () {
      this.rewardRecordVisible = true
      this.size2 = 5
      this.currentPage2 = 1
      this.getRewardLists(this.$route.query.article_id, {size: this.size2})
    },
    goToHim (id) {
      let routeData = this.$router.resolve({path: '/otherUserInfo?account_id=' + id})
      window.open(routeData.href, '_blank')
    },
    handleSizeChangeRecord (val) {
      this.size2 = val
      this.currentPage2 = 1
      this.getRewardLists(this.$route.query.article_id, {size: this.size2})
    },
    handleCurrentChangeRecord (val) {
      this.currentPage2 = val
      this.getRewardLists(this.$route.query.article_id, {size: this.size2, start: (Number(val) - 1) * this.size2})
    }
  }
}
</script>
<style scoped>
  @import "../../../styles/article-info.css";
  .passage-h4{
    position: relative;
  }
  .icon-question{
    display: inline-block;
    background: url("../../../assets/help.png") no-repeat;
    width:16px;
    height: 16px;
    margin-left:10px;
    vertical-align:sub;
    background-size: 100% 100%;
  }
  .icon-question:hover{
    display: inline-block;
    background: url("../../../assets/help_primary_hover.png") no-repeat;
    width:16px;
    height: 16px;
    background-size: 100% 100%;
    vertical-align:sub;
  }
  .passage-checkPending{
    position: absolute;
    top: -20px;
    right: 0px;
  }
  .jubao-img{
    cursor: pointer;
  }
  .passage-reject{
    max-width: 200px;
    position: absolute;
    top: -38px;
    right: 0px;
  }
  .passage-reject p{
    color:#f25979;
    font-size: 16px;
  }
  .demo-ruleForm{
    display: -ms-flexbox;
    display: flex;
    padding: 0 20px;
  }
  .demo-ruleForm .yanz{
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    display: -ms-flexbox;
    display: flex;
    min-width: 0;
  }
  .demo-ruleForm .primary{
    width: 32%;
    margin-left: 15px;
  }
  .iframe285{
    height: 200px;
    margin-bottom: 15px;
  }
  .operator_icon .el-icon-download{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg);
    -moz-transform:rotate(180deg);
    -webkit-transform:rotate(180deg);
    -o-transform:rotate(180deg);
  }
  .rewarded-list ul li{
    cursor: pointer;
    float: left;
    margin-right: 15px;
  }
  .rewarded-list .rewarded-face,.rewarded-list .rewarded-number{
    text-align: center;
    margin-bottom: 5px;
  }
  .rewarded-list .rewarded-face{
    line-height: 40px;
  }
  .rewarded-list .rewarded-face img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 auto;
  }
  .rewarded-list .rewarded-number{
    color: #9FADC2;
    font-size: 12px;
  }
  .rewarded{
    margin-right: 30px;
  }
  .rewarded img{
    vertical-align: top;
  }
  .reward-record-dialog .reward-record-box ul li{
    line-height: 48px;
    padding: 20px 0;
    border-bottom: 1px solid #dddddd;
    font-size: 18px;
    color: #333333;
  }
  .reward-record-dialog .reward-face-name img{
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    cursor: pointer;
  }
  @media only screen and (max-width: 768px) {
    .welcome-context .collect{
      padding: 15px 15px;
    }
    .rewarded-list{
      margin-bottom: 15px;
    }
    .rewarded-list ul li{
      margin-right: 10px;
    }
    .admin_operate_p .operator_icon{
      margin-right:15px;
    }
    .passage-checkPending img{
      width: 90px;
    }
    .passage-reject{
      top: -20px;
      max-width: 120px;
    }
    .passage-reject img{.icon-question
    width: 90px;
    }
    .iframe895{
      height: 63px;
    }
    .iframe285{
      height: 260px;
    }
    .rewarded-list ul li.rewarded-li:nth-child(5),.rewarded-list ul li.rewarded-li:nth-child(4){
      display: none;
    }
  }
  @media only screen and (max-width: 920px){
    .rewarded-list ul li.rewarded-li:nth-child(5){
      display: none;
    }
  }
  @media only screen and (max-width: 830px){
    .rewarded-list ul li.rewarded-li:nth-child(5),.rewarded-list ul li.rewarded-li:nth-child(4){
      display: none;
    }
  }
  @media only screen and (min-width: 1200px) {
    .demo-ruleForm .primary .el-button{
      padding: 19px 20px;
      font-size: 20px;
    }
  }
</style>
<style>
  .select-screen .el-input__inner{
    border: none;
  }
  .passageDetail  .el-image-viewer__close {
    color: #fff;
    top: 80px;
  }
  .welcome-context .collect{
    text-align: right;
    background-color: #fff;
    margin-bottom: 20px;
    padding:20px 40px;
  }
  .welcome-context .collect .cancal_collected{
    display: inline-block;
    color: #fff;
    background-color:#ff9933;
    padding:10px 20px;
    cursor: pointer;
    border-radius: 18px;
  }
  .welcome-context .collect .collected{
    display: inline-block;
    color: #fff;
    background-color:#cccccc;
    padding:10px 20px;
    cursor: pointer;
    border-radius: 18px;
  }
  .article-main p{
    word-break: break-all;
  }
  .article-main video{
    outline: none;
    width: 100%;
    background-color: #000;
  }
  .article-main img{
    display: block;
    margin: 0 auto;
    max-width: 100%;
    width: auto;
    height: auto;
    cursor: zoom-in;
    image-orientation: from-image;
    position: relative;
  }
  .article-main audio{
    width: 100%;
    outline: none;
  }
  .jubao-popover{
    min-width: 100px;
    padding: 10px 12px;
  }
  .admin_operate{
    width: 100%;
    background-color: #fff;
    padding: 20px 20px;
    position: fixed;
    left: 0;
    bottom: 0;
    margin: 0px;
  }
  .admin_operate_p{
    max-width: 1200px;
    margin: 0 auto;
    cursor: pointer;
  }
  .admin_operate_p span{
    color: #409EFF;
    cursor: pointer;
  }
  .admin_operate_p .operator_icon{
    margin-right:80px;
  }
  .admin_operate_p .laylout_comment{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
  }
  .el-breadcrumb__inner,.el-breadcrumb__item:last-child .el-breadcrumb__inner{
    color: #999999;
  }
  .comment_delete .el-dialog{
    max-width: 480px;
    border-radius: 4px;
  }
  .safe_dialog .el-dialog{
    max-width: 600px;
    border-radius: 5px;
    padding: 0;
    overflow: hidden;
  }
  .safe_dialog .el-dialog__header{
    padding: 0;
  }
  .safe_dialog .el-dialog__body{
    padding: 0;
  }
  .safe_dialog img{
    width: 100%;
  }
  .safe_dialog .yanz{
    overflow: hidden;
  }
  .safe_dialog .el-dialog__footer{
    text-align: center;
    border-radius:12px;
  }
  .safe_dialog .el-button{
    border-radius: 4px;
  }
  .safe_dialog .el-input__inner{
    text-align: center;
    border-radius: 4px;
  }
  .safe_dialog .el-form-item__error{
    left: 50%;
    margin-left: -38px;
  }
  .safe_dialog  .primary button{
    width: 100%;
    max-width: 280px;
  }
  .safe_dialog .picYz{
    width: 100%;
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
  .zm_span{
    display: inline-block;
    width: 100%;
    position: relative;
  }
  .el-icon-jubao{
    cursor: pointer;
    margin-left: 20px;
    font-size:20px;
    color: rgba(198,206,209,1);
  }
  .zm_span .zm_video{
    position: absolute;
    width:62px;
    height:62px;
    left:50%;
    top:50%;
    margin-left: -31px;
    margin-top: -31px;
    -webkit-transition:all 1s ease ;
    -moz-transition:all 1s ease ;
    -o-transition:all 1s ease ;
    transition:all 1s ease;
    cursor: pointer;
  }
  @media only screen and (min-width: 1200px) {
    .safe_dialog .el-input__inner{
      height: 60px;
      line-height: 60px;
      font-size: 20px;
    }
    .safe_dialog .el-form-item__error{
      font-size: 18px;
    }
  }
  .passageDetail-video .video-js{
    width: 100%;
  }
  .passageDetail-video .video-js .vjs-big-play-button,.no-change-big-play-button{
    font-size: 2.5em;
    line-height: 2.3em;
    height: 2.5em;
    width: 2.5em;
    -webkit-border-radius: 2.5em;
    -moz-border-radius: 2.5em;
    border-radius: 2.5em;
    background-color: #73859f;
    background-color: rgba(115,133,159,.5);
    border-width: 0.15em;
    margin-top: -1.25em;
    margin-left: -1.75em;
  }
  /* 中间的播放箭头 */
  .passageDetail-video .vjs-big-play-button .vjs-icon-placeholder {
    font-size: 1.63em;
  }
  /* 加载圆圈 */
  .passageDetail-video .vjs-loading-spinner {
    font-size: 2.5em;
    width: 2em;
    height: 2em;
    border-radius: 1em;
    margin-top: -1em;
    margin-left: -1.5em;
  }
  .passageDetail-video .vjs-paused .vjs-big-play-button, .vjs-paused.vjs-has-started .vjs-big-play-button {
    display: block;
  }
  .passageDetail-video .video-js.vjs-playing .vjs-tech {
    pointer-events: auto;
  }
  .passageDetail-video .video-js .vjs-icon-download:before {
    display: inline-block;
    width: 45%;
    height: 45%;
    content: "";
    background: url("../../../assets/downVideo.png") no-repeat;
    background-position:center;
    cursor: pointer;
  }
  .passageDetail-video .vjs-fullscreen-control{
    font-size: 13px;
    margin-top: -4px!important;
  }
  .audio-box{
    padding: 0px 10px 5px 10px;
    background-color: #F5F5F5;
  }
  .audio-wrapper {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    overflow: hidden;
  }

  .audio-left {
    float: left;
    text-align: center;
    height: 100%;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 50px;
    height: 70px;
    overflow: hidden;
    margin-right: 20px;
  }

  .audio-left img {
    width: 40px;
    position: relative;
    top: 19px;
    margin: 0;
    display: initial;   /* 解除与app的样式冲突 */
    cursor: pointer;
  }

  .audio-right {
    float: left;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    min-width: 0;
  }

  .audio-right p {
    font-size: 15px;
    height: 35%;
    margin: 8px 0;
    /* 歌曲名称只显示在一行，超出部分显示为省略号 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 243px;   /* 要适配小屏幕手机，所以最大宽度先设小一点，后面js根据屏幕大小重新设置 */
  }

  .progress-bar-bg {
    background-color: #d4e1eb;
    position: relative;
    height: 4px;
    cursor: pointer;
    margin: 3px 0px;
  }

  .progress-bar {
    background-color: #9fadc2;
    width: 0;
    height: 4px;
  }

  .progress-bar-bg span {
    content: " ";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    background-color: #9fadc2;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -5px;
    margin-left: -5px;
    cursor: pointer;
  }

  .audio-time {
    font-size: 14px;
    color: #9fadc2;
    font-weight: 700;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    text-align: center;
    width: 90px;
    height: 70px;
    line-height: 108px;
    overflow: hidden;
    margin-left: 20px;
  }

  .audio-length-total {
    float: right;
    font-size: 12px;
  }

  .audio-length-current {
    float: left;
    font-size: 12px;
  }
  .reward-record-dialog .el-dialog{
    max-width: 620px;
  }
  .reward-record-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .reward-record-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .reward-record-dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
</style>
