<!--评论模块-->
<template>
  <div class="container comment_review_pic">
    <div class="my-reply">
      <el-form ref="replyForm" :model="replyForm" class="comment">
        <el-form-item>
          <el-input v-model="replyForm.content" type="textarea"
                    :rows="3"
                    @focus="judgement({action:'comment_article',resources_id:article_id},'inputData')"
                    placeholder="写下你的评论..."></el-input>
         <div v-if="imageArray.length>0" class="img-parent">
            <div class="img-div mr-5" v-for="(item,index) in imageArray" :key="index">
              <el-image  class="showImg"
                         :src="item.url"
                         fit="cover"></el-image>
            <!--<img :src="item.url" alt="" class="showImg">-->
            <p >
              <i class="el-icon-delete img-delete" @click="deleteArray(index,'nav')"></i>
            </p>
            </div>
         </div>
        </el-form-item>
        <el-form-item align="left">
          <img :src="commentImg" alt="" class="commentImg" @click="judgement({action:'comment_article',resources_id:article_id},'chocieImg')">
          <el-button  class="float-right" type="primary" @click="judgement({action:'comment_article',resources_id:article_id},'submitMessage')" :disabled="!replyForm.content && imageArray.length===0 || forbid">发送</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="reply-title">
      <span>全部评论  {{total}}条</span>
    </div>
    <div class="reply-item" v-for="(item,index) in commentData" :key="index">
      <div class="clearfix mb-15">
        <div class="user-face">
          <el-popover
            popper-class="comment-popover"
            placement="top-start"
            width="260"
            trigger="hover"
             v-if="can_forbid_comment">
            <div class="clearfix p-5"  @click="open(item)" style="cursor: pointer">
              <img  class="img-circle float-left"  :src="item.icon_url?item.icon_url:admin_url" width="50" height="50" alt="头像">
              <div class="float-left ml-15  forbid-img mb-15">
                  <h5 class="text-primary text-overflow-1">{{item.commentator_name}}</h5>
              </div>
            </div>
            <el-button class="ml-10" plain size="small" @click="forbidVisible_action(item, 1)">禁止评论</el-button>
            <img  class="img-circle" slot="reference" :src="item.icon_url?item.icon_url:admin_url" width="60" height="60" alt="头像" @click="open(item)">
          </el-popover>
          <img  v-if="!can_forbid_comment" class="img-circle" :src="item.icon_url?item.icon_url:admin_url" width="60" height="60" alt="头像" @click="open(item)">
        </div>
        <el-popover
          popper-class="comment-popover"
          placement="top-start"
          width="260"
          trigger="hover"
          v-if="can_forbid_comment">
          <div class="clearfix p-5" @click="open(item)" style="cursor: pointer">
            <img  class="img-circle float-left" :src="item.icon_url?item.icon_url:admin_url" width="50" height="50" alt="头像">
            <div class="float-left ml-15  forbid-img mb-15">
              <h5 class="text-primary text-overflow-1">{{item.commentator_name}}</h5>
            </div>
          </div>
          <el-button class="ml-10" plain size="small" @click="forbidVisible_action(item, 1)">禁止评论</el-button>
          <span class="float-left user-name text-primary" slot="reference" @click="open(item)">{{item.commentator_name}}</span>
        </el-popover>
        <span v-if="!can_forbid_comment" class="float-left user-name text-primary" slot="reference" @click="open(item)">{{item.commentator_name}}</span>
      </div>
      <div class="content">
        <p v-html="item.content"></p>
        <p>
          <el-image
                     :src="itemUrl.url"
                     fit="cover" v-for="(itemUrl,index) in item.image_url"   @click.native="check_big_img(itemUrl.original_url,item.srcList,index)" :key="index" class="mr-10 mb-10 info-img"></el-image>
        </p>
      </div>
      <div class="clearfix operate mb-15">
        <span class="float-left user-time text-999">{{item.time}}</span>
        <span class="float-right user-reply text-999" @click="showCommentInput(1,item)"><i class="el-icon-chat-dot-square"></i>回复</span>
        <span class="float-right user-delete text-999" @click="handleClose(item)" v-if="item.commentator_id===account_id||can_delete_comment"><i class="el-icon-delete"></i>删除</span>
      </div>
      <div class="other-reply">
        <ul v-if="item.reply||showItemId === item.id">
          <li class="write_comments" v-if="flag===1">
            <transition name="fade">
              <div class="input-wrapper" v-if="showItemId === item.id">
                <el-input class="gray-bg-input"
                          v-model="inputComment"
                          type="textarea"
                          :rows="3"
                          autofocus
                          placeholder="写下你的回复">
                </el-input>
                <div v-if="subImageArray.length>0" class="img-parent">
                  <div class="img-div mr-5" v-for="(sub,subIndex) in subImageArray" :key="subIndex">
                    <img :src="sub.url?sub.url:admin_url" alt="" class="showImg">
                    <p >
                      <i class="el-icon-delete img-delete" @click="deleteArray(subIndex,'sub_nav')"></i>
                    </p>
                  </div>
                </div>
                <div class="btn-control mt-15">
                  <img :src="commentImg" alt="" class="commentImg" @click="chocieImg('sub_nav')">
                  <el-button type="primary" class="float-right" :disabled='!inputComment&&subImageArray.length===0 ||forbid' @click="commitComment(item)">发送</el-button>
                  <el-button  @click="cancel" class="float-right mr-10">取消</el-button>
                </div>
              </div>
            </transition>
          </li>
          <li v-for="(reply,i) in item.reply" :key="i">
            <div class="reply-content mb-15">
              <el-popover
                placement="top-start"
                width="260"
                trigger="hover" v-if="can_forbid_comment">
                <div class="clearfix p-5" @click="open(reply)" style="cursor: pointer">
                  <img  class="img-circle float-left"  :src="reply.icon_url?reply.icon_url:admin_url" width="40" height="40" alt="头像">
                  <div class="float-left ml-15  forbid-img mb-15">
                    <h5 class="text-primary text-overflow-1">{{reply.commentator_name}}</h5>
                  </div>
                </div>
                <el-button class="ml-10" plain size="small" @click="forbidVisible_action(reply, 1)">禁止评论</el-button>
                <img  class="img-circle face" slot="reference" :src="reply.icon_url?reply.icon_url:admin_url" width="40" height="40" alt="头像" @click="open(reply)">
              </el-popover>
              <img  class="img-circle face"  v-if="!can_forbid_comment" :src="reply.icon_url?reply.icon_url:admin_url" width="40" height="40" alt="头像" @click="open(reply)">
              <p class="from-name text-primary">
                <el-popover
                placement="top-start"
                width="260"
                trigger="hover" v-if="can_forbid_comment">
                <div class="clearfix p-5">
                  <img  class="img-circle float-left"  :src="reply.icon_url?reply.icon_url:admin_url" width="40" height="40" alt="头像">
                  <div class="float-left ml-15  forbid-img mb-15">
                    <h5 class="text-primary text-overflow-1">{{reply.commentator_name}}</h5>
                  </div>
                </div>
                <el-button class="ml-10" plain size="small" @click="forbidVisible_action(reply, 1)">禁止评论</el-button>
                <span class="from-name text-primary" style="cursor: pointer" slot="reference" @click="open(reply)">{{reply.commentator_name}}</span>
              </el-popover>
                <span v-if="!can_forbid_comment" class="from-name text-primary" style="cursor: pointer" slot="reference" @click="open(reply)">{{reply.commentator_name}}</span>
              </p>
              <span v-if="reply.parent_id!==reply.father_id" class="reply-text">回复</span>
              <span class="to-name text-primary mr-15" v-if="reply.parent_id!==reply.father_id">
                <el-popover
                  placement="top-start"
                  width="260"
                  trigger="hover" v-if="can_forbid_comment">
                <div class="clearfix p-5" @click="open2(reply)" style="cursor: pointer">
                  <img  class="img-circle float-left"  :src="reply.commented_icon?reply.commented_icon:admin_url" width="40" height="40" alt="头像">
                  <div class="float-left ml-15  forbid-img mb-15">
                    <h5 class="text-primary text-overflow-1">{{reply.commented_name}}</h5>
                  </div>
                </div>
                <el-button class="ml-10" plain size="small" @click="forbidVisible_action(reply, 2)">禁止评论</el-button>
                <span slot="reference" @click="open2(reply)" style="cursor: pointer">{{reply.commented_name}}</span>
              </el-popover>
                <span v-if="!can_forbid_comment" @click="open2(reply)" style="cursor: pointer">{{reply.commented_name}}</span>
                <span>: </span>
              </span>
              <span v-html="reply.content" class="text-333"></span>
              <br>
              <el-image
                :src="replyUrl.url"
                fit="contain" v-for="(replyUrl,i) in reply.image_url"   @click.native="check_big_img(replyUrl.original_url,reply.srcList,i)"  :key="i" class="mr-10 mt-10 info-img"></el-image>
            </div>
            <div class="reply-bottom clearfix">
              <span class="float-left text-999">{{reply.time}}</span>
              <span class="float-right user-reply text-999" @click="showCommentInput(2,item, reply,i)">
                <i class="el-icon-chat-dot-square"></i>
                <span>回复</span>
              </span>
              <span class="float-right user-delete text-999 ml-15" @click="handleClose(reply)" v-if="reply.commentator_id===account_id||can_delete_comment"><i class="el-icon-delete"></i>删除</span>
            </div>
            <div class="subRepay mt-10" v-if="flag===2">
              <transition name="fade">
                <div class="input-wrapper" v-if="showItemId === item.id&&subIndex === i">
                  <el-input class="gray-bg-input"
                            v-model="inputComment"
                            type="textarea"
                            :rows="3"
                            autofocus
                            placeholder="写下你的回复">
                  </el-input>
                  <div v-if="subImageArray.length>0" class="img-parent">
                    <div class="img-div mr-5" v-for="(sub,subIndex) in subImageArray" :key="subIndex">
                      <img :src="sub.url" alt="" class="showImg">
                      <p >
                        <i class="el-icon-delete img-delete" @click="deleteArray(subIndex,'sub_nav')"></i>
                      </p>
                    </div>
                  </div>
                  <div class="btn-control mt-15">
                    <img :src="commentImg" alt="" class="commentImg" @click="chocieImg('sub_nav')">
                    <el-button type="primary" class="float-right" :disabled='!inputComment&&subImageArray.length===0 || forbid' @click="commitComment(item)">发送</el-button>
                    <el-button type="" @click="cancel" class="float-right mr-10">取消</el-button>
                  </div>
                </div>
              </transition>
            </div>
          </li>
          <div v-if="(item.reply&&item.reply.length>=3)&&item.showSub" class="more_comments" @click="subComment(item)"><p class="text-center"><a href="javascript:;" class="text-primary">加载全部</a></p></div>
        </ul>
      </div>
    </div>
    <transition name="fade">
    <p class="text-center" @click="more" v-if="(first_number/10>0)&&(first_number-size)>0"><a href="javascript:;" class="text-primary" style="color: #9fadc2">展开更多评论</a></p>
    <p class="text-center"  v-else><a href="javascript:;" class="text-primary" style="color: #9fadc2" >亲，没有数据了</a></p>
    </transition>
    <!--dialog-->
    <el-dialog
      class="comment_delete"
      title="删除评论"
      align="center"
      :visible.sync="dialogVisible"
      >
      <span>你确定要删除这条评论吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogVisible = false">关闭</el-button>
        <el-button type="text" @click="deleteComentData({comment_id:comment_id})">确 定</el-button>
      </span>
    </el-dialog>
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
        <img :src="item" v-if="current_img_src==item"  v-for="(item,index) in images_viewer" :key="index" class="el-image-viewer__img" style="transform: scale(1) rotate(0deg); margin-left: 0px; margin-top: 0px; max-height: 100%; max-width: 100%;">
      </div>
        <p class="img-page">{{current_img_index+1}} / {{images_viewer.length}}</p>
      </div>
    </div>
    <diglog-components :scene="text_tips" :modal-show.sync="modalShow" :needBack="needBack"></diglog-components>
    <global-popup :file_type='file_type' :propData="propData" :title="title" :choiceStyle="choiceStyle" :modal-show.sync="modalVisible"  @click="choiceData"></global-popup>
    <forbid-comments :modalForbidShow.sync="forbidVisible" :account_id="commentId" :commentator_categorys="categorys" :account_name="accountName"></forbid-comments>
    <!--dialog-->
  </div>
</template>

<script>
import store from '../store/index'
import globalPopup from './popup'
import diglogComponents from './diglogComponents'
import forbidComments from './forbid_comments'
import diglogMask from './mask'
export default {
  props: {
    comments: {
      type: Array,
      required: true
    },
    can_delete_comment: Boolean,
    can_forbid_comment: Boolean,
    article_id: {
      type: String,
      required: true
    }
  },
  components: {
    'global-popup': globalPopup,
    'diglog-components': diglogComponents,
    'forbid-comments': forbidComments,
    'diglog-mask': diglogMask
  },
  inject: ['reload'],
  watch: {
    comments (val) {
      this.commentData = val
      if (this.commentData.length > 0) {
        this.total = this.commentData[0].total_number
        this.first_number = this.commentData[0].first_number
      } else {
        this.total = 0
        this.first_number = 0
      }
    },
    loginStyle (val) {
      if (val) {
        this.account_id = 0
      } else {
        this.account_id = this.Cookies.get('info') ? JSON.parse(this.Cookies.get('info')).account_id : null
      }
    }
  },
  data () {
    return {
      checkImg: false,
      images_viewer: [],
      current_img_src: '',
      current_img_index: 0,
      text_tips: '',
      commentId: null,
      accountName: '',
      categorys: [],
      modalShow: false,
      forbidVisible: false,
      needBack: false,
      flag: null,
      total: 0,
      first_number: 0,
      size: 10,
      imageArray: [],
      subImageArray: [],
      choiceStyle: 'Multiple',
      title: '云盘图片选择',
      subIndex: -1,
      file_type: 1,
      tradeImg: '',
      propData: [],
      modalVisible: false,
      commentImg: require('../assets/commerntImg.png'),
      admin_url: require('../../static/images/toux.png'),
      path2: '#/otherUserInfo?account_id=',
      at_account_id: 0,
      father_id: 0,
      comment_id: '',
      account_id: null,
      commentData: [],
      inputComment: '',
      otherinput: '',
      showItemId: '',
      replyForm: {},
      dialogVisible: false,
      forbid: false
    }
  },
  mounted () {
  },
  computed: {
    loginStyle () {
      return this.$store.state.login_status
    }
  },
  methods: {
    open (item) {
      window.open(this.path2 + item.commentator_id, '_blank')
    },
    open2 (item) {
      window.open(this.path2 + item.commented_id, '_blank')
    },
    check_big_img (itemUrl, srcList, index) {
      this.checkImg = true
      this.images_viewer = srcList
      this.current_img_src = itemUrl
      this.current_img_index = index
    },
    next () {
      if (this.current_img_index === (this.images_viewer.length - 1)) {
        this.$toast('亲，已经没有图片了', 2000, 'warning')
      } else {
        this.current_img_index = this.current_img_index + 1
        this.current_img_src = this.images_viewer[this.current_img_index]
      }
    },
    prev () {
      if (this.current_img_index === 0) {
        this.$toast('亲，已经没有图片了', 2000, 'warning')
      } else {
        this.current_img_index = this.current_img_index - 1
        this.current_img_src = this.images_viewer[this.current_img_index]
      }
    },
    judgement (params, fn) {
      if (fn === 'submitMessage') {
        this.forbid = true
      }
      this.http.getScoreJudgement(params).then(res => {
        if (res.status === 0) {
          if (res.data.isForbidComment) {
            this.$toast('您已被禁言', 2000, 'warning')
            if (fn === 'inputData') {
              this.replyForm.content = ''
            }
          } else {
            if (res.data.is_satisfy && res.data.resource_status === 0) {
              if (fn === 'inputData') {
                this.inputData()
              } else if (fn === 'chocieImg') {
                this.chocieImg('nav')
              } else if (fn === 'submitMessage') {
                this.submitMessage()
              }
            } else if (!res.data.is_satisfy && res.data.resource_status === -3) {
              this.$router.push('/nopassage')
            } else if (!res.data.is_satisfy && res.data.resource_status === 0) {
              this.text_tips = `评论一篇新文章需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再评论`
              this.modalShow = true
            }
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    forbidVisible_action (v, type) {
      this.forbidVisible = true
      this.commentId = v.commentator_id
      this.accountName = type === 1 ? v.commentator_name : v.commented_name
      this.http.hasForbid({uid: v.commentator_id}).then(res => {
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
    isContained (a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false
      if (a.length < b.length) return false
      var aStr = a.toString()
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) === -1) return false
      }
      return true
    },
    inputData () {
      if (!this.Cookies.get('info')) {
        store.commit('flagLogin', true)
      }
    },
    /**
       * 提交一级评论
       */
    submitMessage () {
      let arr = []
      if (!this.replyForm.content && this.imageArray.length === 0) {
        this.$toast('请输入评论内容', 2000, 'error')
        return false
      }
      this.imageArray.forEach(item => {
        arr.push(item.id)
      })
      if (this.Cookies.get('info')) {
        if (JSON.parse(this.Cookies.get('info')).isLogin) {
          this.replyForm.article_id = this.article_id
          this.replyForm.image_id = arr
          this.http.releaseComment(this.replyForm).then(res => {
            if (res.status === 0) {
              this.forbid = false
              if (res.data.limit_score > 0) {
                this.$toast('评论文章扣' + res.data.limit_score + '分', 2000, 'common')
              }
              this.imageArray = []
              this.replyForm.content = ''
              this.$emit('getData', {article_id: this.article_id, size: this.size})
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        }
      } else {
        store.commit('flagLogin', true)
      }
    },
    /**
       * 点击取消按钮
       */
    cancel () {
      this.showItemId = ''
    },
    choiceData (playload) {
      if (this.tradeImg === 'nav') {
        this.imageArray = this.forReatData(this.imageArray, playload)
      } else {
        this.subImageArray = this.forReatData(this.subImageArray, playload)
      }
    },
    forReatData (arr, arr1) {
      arr = arr.concat(arr1)
      let newJson = []
      for (let item1 of arr) {
        let flag = true
        for (let item2 of newJson) {
          if (item1.id === item2.id) {
            flag = false
          }
        }
        if (flag) {
          newJson.push(item1)
        }
      }
      return newJson
    },
    chocieImg (text) {
      this.tradeImg = text
      if (this.Cookies.get('info')) {
        this.modalVisible = true
        this.http
          .getMyFileList({file_type: 1})
          .then(res => {
            if (res.status === 0) {
              console.log(res)
              if (res.data.file_info && res.data.file_info.length > 0) {
                res.data.file_info.forEach(item => {
                  item.total = res.data.total_number
                })
                this.propData = res.data.file_info
              } else {
                this.propData = []
              }
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
      } else {
        store.commit('flagLogin', true)
      }
    },
    /**
       * 提交评论
       */
    commitComment (item) {
      this.forbid = true
      this.http.getScoreJudgement({action: 'comment_article', resources_id: this.article_id}).then(res => {
        if (res.status === 0) {
          this.forbid = false
          if (res.data.isForbidComment) {
            this.$toast('您已被禁言', 2000, 'warning')
          } else {
            if (res.data.is_satisfy && res.data.resource_status === 0) {
              let obj = {}
              let arr = []
              this.subImageArray.forEach(item1 => {
                arr.push(item1.id)
              })
              obj.article_id = this.article_id
              obj.parent_id = item.id
              obj.image_id = arr
              if (item.reply) {
                obj.at_account_id = this.at_account_id
                obj.father_id = this.father_id
                obj.content = this.inputComment.replace(this.otherinput, '')
                if (!obj.content && this.subImageArray.length === 0) {
                  this.$toast('请输入回复内容', 2000, 'error')
                  return false
                }
              } else {
                // if (!this.inputComment) {
                //   this.$message.error('请输入回复内容')
                //   return false
                // } else {
                //   obj.at_account_id = this.at_account_id
                //   obj.content = this.inputComment
                //   obj.father_id = this.father_id
                // }
                obj.at_account_id = this.at_account_id
                obj.content = this.inputComment
                obj.father_id = this.father_id
              }
              this.http.releaseComment(obj).then(res => {
                if (res.status === 0) {
                  this.showItemId = ''
                  this.subImageArray = []
                  if (res.data.limit_score > 0) {
                    this.$toast('回复评论扣' + res.data.limit_score + '分', 2000, 'common')
                  }
                  this.$emit('getData', {article_id: this.article_id, size: this.size})
                } else {
                  this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
                }
              })
            } else if (!res.data.is_satisfy && res.data.resource_status === -3) {
              this.$router.push('/nopassage')
            } else if (!res.data.is_satisfy && res.data.resource_status === 0) {
              this.text_tips = `评论一篇新文章需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再评论`
              this.modalShow = true
            }
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },

    deleteArray (index, flag) {
      if (flag === 'nav') {
        this.imageArray.splice(index, 1)
      } else {
        this.subImageArray.splice(index, 1)
      }
    },

    /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
    showCommentInput (flag, item, reply, index) {
      this.http.getScoreJudgement({action: 'comment_article', resources_id: this.article_id}).then(res => {
        if (res.status === 0) {
          if (res.data.isForbidComment) {
            this.$toast('您已被禁言', 2000, 'warning')
          } else {
            if (res.data.is_satisfy && res.data.resource_status === 0) {
              this.flag = flag
              this.subImageArray = []
              if (this.Cookies.get('info')) {
                if (reply) {
                  this.subIndex = index
                  this.inputComment = '@' + reply.commentator_name + ' '
                  this.otherinput = this.inputComment
                  this.at_account_id = reply.commentator_id
                  this.father_id = reply.id
                } else {
                  this.inputComment = ''
                  this.father_id = item.id
                  this.at_account_id = item.commentator_id
                }
                this.showItemId = item.id
              } else {
                store.commit('flagLogin', true)
              }
            } else if (!res.data.is_satisfy && res.data.resource_status === -3) {
              this.$router.push('/nopassage')
            } else if (!res.data.is_satisfy && res.data.resource_status === 0) {
              this.text_tips = `评论一篇新文章需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再评论`
              this.modalShow = true
            }
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    /**
     * 删除评论
     */
    handleClose (item) {
      this.dialogVisible = true
      this.comment_id = item.id
    },
    deleteComentData (params) {
      this.http.deleteComment(params).then(res => {
        if (res.status === 0) {
          this.dialogVisible = false
          this.$emit('getData', {article_id: this.article_id, size: this.size})
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    more () {
      this.size = this.size + 10
      this.$emit('getData', {article_id: this.article_id, size: this.size})
    },
    subComment (item) {
      item.showSub = false
      this.http.secondComment({article_id: this.article_id, size: 99999, comment_id: item.id}).then(res => {
        if (res.status === 0) {
          if (res.data.article_comments) {
            this.commentData.forEach((obj, index) => {
              if (obj.id === res.data.article_comments[0].id) {
                if (res.data.article_comments[0].reply) {
                  res.data.article_comments[0].reply.forEach(item1 => {
                    item1.time = this.formatToBeforeTime(item1.time / 1000000000)
                  })
                  obj.reply = res.data.article_comments[0].reply
                  return false
                }
              }
            })
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    }
  },
  created () {
    this.account_id = this.Cookies.get('info') ? JSON.parse(this.Cookies.get('info')).account_id : null
    // console.log(this.comments)
  }
}
</script>

<style scoped>
  .content p{
    word-break: break-all;
  }
  .forbid-img{
    margin-top: 8px;
  }
  .forbid-img h5{
    font-size: 16px;
    max-width: 155px;
  }
  .my-reply{
    padding-top: 20px;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 20px;
  }
  .reply-item .my-reply{
    border-bottom: none 0;
  }
  .reply-title {
    font-size: 20px;
    color: #333333;
    margin-bottom: 20px;
  }
  .reply-item{
    padding: 5px 0 20px 75px;
    position: relative;
    border-bottom: 1px solid #dddddd;
    margin-bottom: 15px;
  }
  .reply-item .user-face{
    width: 60px;
    height: 60px;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
  }
  @media only screen and (max-width:768px) {
    .reply-item .user-face{
      /*display: none;*/
    }
    .reply-item{
      /*padding: 5px 2px 20px 2px;*/
    }
    .reply-bottom{
      padding-left: 0px!important;
    }
  }
  .reply-item .user-face img{
    width: 100%;
    height: 100%;
  }
  .reply-item .float-left.user-name{
    font-size: 16px;
    cursor: pointer;
  }
  .reply-item .float-left.user-name,.reply-item .float-left.user-time,.reply-item .float-left.user-only{
    margin-right: 50px;
  }
  .other-reply{
    border-radius: 4px;
  }
  .other-reply ul{
    background: #f6f8fb;
    padding: 15px 15px 0px 15px;
    margin-bottom: 15px;
    border-radius: 4px;
  }
  .other-reply ul li{
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e5e5e5;
  }
  .other-reply ul li:last-child{
    border: none 0;
  }
  .operate span{.info-img
    color: #9fadc2
  ;
  }
  .operate span.float-right{
    margin-left: 40px;
    cursor: pointer;
  }
  .operate span.user-praise.active{
    color: #f6a20e;
  }
  .reply-content{
    min-height: 40px;
    padding-left: 50px;
    position: relative;
  }
  .reply-content .face{
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .reply-content .face{
      display: none;
    }
    .reply-content{
      padding-left: 0px;
    }
  }
  .reply-bottom{
    padding-left: 50px;
  }
  .reply-bottom span{
    color: #9fadc2;
  }
  .reply-bottom span.float-right{
    margin-left: 40px;
    cursor: pointer;
  }
  .commentImg{
     width: 18px;
     height: 15px;
  }
  .showImg{
    width: 100%;
    height: 100%;
  }
  .img-parent{
    padding-top: 10px ;
  }
  .img-div{
    display: inline-block;
    width: 80px;
    height: 60px;
    position: relative;
  }
  .img-div p{
    width: 0;
    height:0;
    display: none;
  }
  .img-div:hover p{
    width: 100%;
    height: 100%;
    text-align: center;
    line-height:60px;
    color:#fff;
    font-size:16px;
    background-color:rgba(0,0,0,0.5);
    position: absolute;
    left: 0;
    top: 0;
    transition: all 5s;
    display: inline-block;
  }
  .subRepay{
    overflow: hidden;
  }
  .info-img{
    display: inline-block;
    width: 150px;
    height: 100px;
    margin-right: 6px;
    cursor: zoom-in;
  }
  @media only screen and (max-width: 768px){
    .info-img{
      width: 47%;
    }
  }
</style>
<style>
  .comment_delete .el-dialog__body{
    border-bottom: 1px solid #e5e5e5;
    font-size: 16px;
  }
   .btn-control{
    padding-bottom: 15px;
  }
  .comment .el-form-item{
    margin-bottom: 15px;
  }
  .comment .el-form-item__content{
    line-height: inherit;
  }
  .comment-popover{
    border-radius: 8px;
  }
  .comment_review_pic .el-image-viewer__close{
    color: #fff;
    top: 80px;
  }
  .comment_review_pic .el-image__preview{
    cursor:zoom-in;
  }
  .comment_review_pic .el-image-viewer__actions{
    display: none;
  }
</style>
