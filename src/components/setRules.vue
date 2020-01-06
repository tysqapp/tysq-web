<template>
  <div>
    <el-dialog class="set-rules-dialog" title="设置" :visible.sync="setRulesVisible"  @close="closeSetRules">
    <el-form ref="setForm"  label-width="80px">
      <div class="model_margin">
      <el-form-item label="阅读文章:" align="left">
          大于 <el-input class="textInline" placeholder=""  v-if="item.operate_action==='read_limit_score'" v-for="(item,index) in readArticle" :key="index" v-model.number="item.value" oninput="value=value.replace(/[^\d]/g,'')" @keyup.native="chocieCoin(item.value)"> </el-input>积分
          (<el-select class="textInline imgLine" v-if="item.operate_action==='read_limit_score'" v-for="(item,index) in readArticle" :key="index"  popper-class="set-rules-el-select" :class="[item.grade===1?'imgLine1':item.grade===2?'imgLine2':item.grade===3?'imgLine3':
          item.grade===4?'imgLine4':item.grade===5?'imgLine5':item.grade===6?'imgLine6':item.grade===7?'imgLine7':item.grade===8?'imgLine8':item.grade===9?'imgLine9':
          item.grade===10?'imgLine10':item.grade===11?'imgLine11':item.grade===12?'imgLine12':item.grade===13?'imgLine13':item.grade===14?'imgLine14':item.grade===15?'imgLine15':item.grade===16?'imgLine16':item.grade===17?'imgLine17':item.grade===18?'imgLine18':'']"
                     v-model.number="item.grade"  clearable @change="chocieGrade">
            <el-option v-for="(item1,index) in avatars" :key="index"  :value="item1.grade">
              <img :src="item1.src" v-if="item1.src">
               <span v-else>自定义</span>
            </el-option>
          </el-select>)
          或以上级别才允许阅读
        </el-form-item>
      <el-form-item>
        发布者加 <el-input class="textInline" placeholder=""  v-if="item.operate_action==='author_hot_coin'" v-for="(item,index) in readArticle" :key="index" v-model.number="item.value" oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 热金币,加 <el-input class="textInline" placeholder=""  v-if="item.operate_action==='author_add_score'" v-for="(item,index) in readArticle"  :key="index" v-model.number="item.value"  oninput="value=value.replace(/[^\d]/g,'')"></el-input> 积分
         ( 该积分有效期: <el-input class="textInline" placeholder=""  v-if="item.operate_action==='author_score_exp'" v-for="(item,index) in readArticle" :key="index"  v-model.number="item.value" oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 天 )
      </el-form-item>
      <el-form-item label="">
        阅读者减 <el-input class="textInline" placeholder="" v-if="item.operate_action==='author_hot_coin'" v-for="(item,index) in readArticle" :key="index"  v-model.number="item.value" :disabled="true"> </el-input> 冷金币,减 <el-input class="textInline" placeholder=""  v-if="item.operate_action==='deduct_score'" v-for="(item,index) in readArticle" :key="index"  v-model.number="item.value" oninput="value=value.replace(/[^\d]/g,'')"></el-input> 积分
      </el-form-item>
      <el-form-item label="">
        阅读者不扣减冷金币,发布者则不加热金币;
      </el-form-item>
      <el-form-item label="">
        阅读有效期: <el-input class="textInline" placeholder=""  v-if="item.operate_action==='read_validity'" v-for="(item,index) in readArticle" :key="index"  v-model.number="item.value"  oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 天
      </el-form-item>
      </div>
      <div class="model_margin">
      <el-form-item label="下载视频:">
        发布者加 <el-input class="textInline" placeholder=""  v-if="item.operate_action==='author_add_score'" v-for="(item,index) in downloadVideo" :key="index"  v-model.number="item.value"    oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 积分, ( 该积分有效期: <el-input class="textInline" placeholder=""   v-if="item.operate_action==='author_score_exp'" v-for="(item,index) in downloadVideo" :key="index"  v-model.number="item.value"  oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 天 )
      </el-form-item>
      <el-form-item label="">
        阅读者减 <el-input class="textInline" placeholder=""   v-if="item.operate_action==='deduct_score'" v-for="(item,index) in downloadVideo" :key="index"  v-model.number="item.value"   oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 积分;
      </el-form-item>
      </div>
      <div class="model_margin">
      <el-form-item label="评论文章:" >
        文章发布者加 <el-input class="textInline" placeholder=""  v-if="item.operate_action==='author_add_score'" v-for="(item,index) in commentArticle" :key="index"  v-model.number="item.value"  oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 积分, ( 该积分有效期: <el-input class="textInline" placeholder=""  v-if="item.operate_action==='author_score_exp'" v-for="(item,index) in commentArticle" :key="index"  v-model.number="item.value"  oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 天 )
      </el-form-item>
      <el-form-item label="">
        评论者减 <el-input class="textInline" placeholder=""  v-if="item.operate_action==='deduct_score'" v-for="(item,index) in commentArticle" :key="index"  v-model.number="item.value"  oninput="value=value.replace(/[^\d]/g,'')"> </el-input> 积分;
      </el-form-item>
      </div>
      <div class="model_margin_large">
          <p>1.输入0积分/金币，则代表不扣、也不加积分或金币;</p>
          <p>2.下载视频：是指下载文章详情的视频;</p>
          <p>3.单位“天”：按自然天计算，包括当天;</p>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary set-save" @click="checkSubmit">确定</el-button>
      </span>
  </el-dialog>
    <el-dialog class="set-rules-sure-dialog" title="温馨提示" :visible.sync="setRulesSure">
       <p class="text-center" v-if="tips.read">{{tips.read}}</p>
       <p class="text-center" v-if="tips.comment">{{tips.comment}}</p>
       <p class="text-center" v-if="tips.downLoad">{{tips.downLoad}}</p>
       <p class="text-center">这样设置可刷分,确定要这样修改吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary set-save" @click="setRulesSure=false">取消</el-button>
       <el-button type="primary set-save" @click="secondSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'setRules',
  props: {
    modalSetShow: Boolean,
    articleConfigs: {
      type: Array,
      required: true
    },
    articleId: String
  },
  inject: ['reload'],
  data () {
    return {
      setRulesVisible: false,
      tips: {read: '', comment: '', downLoad: ''},
      setRulesSure: false,
      avatars: [],
      readArticle: [],
      commentArticle: [],
      downloadVideo: [],
      article: {},
      comment: {},
      download: {}
    }
  },
  created () {
    this.getRelations()
  },
  mounted () {
  },
  watch: {
    modalSetShow (val) {
      if (val) {
        this.setRulesVisible = val
      } else {
        this.setRulesVisible = false
      }
    },
    articleConfigs (val) {
      if (val) {
        if (val.length > 0) {
          let readArticle = []
          let commentArticle = []
          let downloadVideo = []
          val.forEach((item) => {
            if (item.parent_action === 'read_article') {
              readArticle.push(item)
            } else if (item.parent_action === 'comment_article') {
              commentArticle.push(item)
            } else if (item.parent_action === 'download_video') {
              downloadVideo.push(item)
            }
          })
          this.readArticle = this.forMortNumber(readArticle)
          this.commentArticle = this.forMortNumber(commentArticle)
          this.downloadVideo = this.forMortNumber(downloadVideo)
        } else {
          this.readArticle = []
          this.commentArticle = []
          this.downloadVideo = []
        }
      }
    }
  },
  methods: {
    chocieGrade (e) {
      for (let i = 0; i < this.avatars.length; i++) {
        if (this.avatars[i].grade === e) {
          for (let j = 0; j < this.readArticle.length; j++) {
            if (this.readArticle[j].operate_action === 'read_limit_score') {
              this.readArticle[j].value = this.avatars[i].min_score
              break
            }
          }
          break
        }
      }
    },
    chocieCoin (val) {
      for (let i = 0; i < this.avatars.length; i++) {
        if (val === this.avatars[i].min_score) {
          for (let j = 0; j < this.readArticle.length; j++) {
            if (this.readArticle[j].operate_action === 'read_limit_score') {
              this.readArticle[j].grade = this.avatars[i].grade
              break
            }
          }
          break
        } else {
          for (let j = 0; j < this.readArticle.length; j++) {
            if (this.readArticle[j].operate_action === 'read_limit_score') {
              this.readArticle[j].grade = '自定义'
              break
            }
          }
        }
      }
    },
    getRelations () {
      this.http.GradeCoinRelations().then(res => {
        if (res.status === 0) {
          if (res.data.relations) {
            res.data.relations.forEach((item, index) => {
              item.src = require(`../assets/invitaton/rank-${index + 1}.png`)
            })
            let obj = {src: '', grade: '自定义', min_score: null}
            res.data.relations.push(obj)
            this.avatars = res.data.relations
          } else {
            this.avatars = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    checkSubmit () {
      this.tips = {read: '', comment: '', downLoad: ''}
      this.forInObj(this.readArticle, 'read_article')
      this.forInObj(this.commentArticle, 'comment_article')
      this.forInObj(this.downloadVideo, 'download_video')
      let flag = false
      if ((this.article.add_score >= 0 && this.article.deduct_score >= 0) || (this.comment.add_score >= 0 && this.comment.deduct_score >= 0) || (this.download.add_score >= 0 && this.download.deduct_score >= 0)) {
        if (this.article.add_score > this.article.deduct_score) {
          this.setRulesSure = true
          this.tips.read = `阅读文章,发布者加${this.article.add_score}积分,但阅读者减${this.article.deduct_score}积分`
          flag = true
        }
        if (this.comment.add_score > this.comment.deduct_score) {
          this.tips.downLoad = `下载视频,发布者加${this.comment.add_score}积分,但阅读者减${this.comment.deduct_score}积分`
          this.setRulesSure = true
          flag = true
        }

        if (this.download.add_score > this.download.deduct_score) {
          this.tips.comment = `评论文章,发布者加${this.download.add_score}积分,但阅读者减${this.download.deduct_score}积分`
          this.setRulesSure = true
          flag = true
        }
      }
      if (!flag) {
        this.postData()
      }
    },
    secondSubmit () {
      this.setRulesSure = false
      this.postData()
    },
    forMortNumber (arr) {
      arr.forEach(item => {
        if (item.value) {
          item.value = Number(item.value)
        }
        if (item.grade === 0) {
          item.grade = ''
        }
      })
      return arr
    },
    postData () {
      let arr = []
      arr = arr.concat(this.readArticle).concat(this.commentArticle).concat(this.downloadVideo)
      let obj = {article_id: this.articleId, score_coin_configs: arr}
      this.http.coinConfigurations(obj).then(res => {
        if (res.status === 0) {
          this.$toast('保存成功', 2000, 'common')
          this.$emit('update:modalSetShow', false)
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    forInObj (arr, type) {
      if (arr.length > 0) {
        arr.forEach((item) => {
          if (item.operate_action !== 'read_cold_coin') {
            if (item.id) {
              if (item.value === '' || item.value === null) {
                item.operate_type = 3
                delete item.value
              } else {
                item.operate_type = 2
              }
            } else {
              if (item.value || item.value === 0) {
                item.operate_type = 1
              } else if (item.value === '' || item.value === null) {
                delete item.value
              }
            }
          }
          if (type === 'read_article') {
            if (item.operate_action === 'author_add_score') {
              if (item.value || item.value === 0) {
                this.article.add_score = item.value
              } else {
                if (this.article.add_score !== undefined) {
                  delete this.article.add_score
                }
              }
            }
            if (item.operate_action === 'deduct_score') {
              if (item.value || item.value === 0) {
                this.article.deduct_score = item.value
              } else {
                if (this.article.deduct_score !== undefined) {
                  delete this.article.deduct_score
                }
              }
            }
            if (item.operate_action === 'author_hot_coin') {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].operate_action === 'read_cold_coin') {
                  if (item.operate_type === 3) {
                    arr[i].operate_type = 3
                    delete arr[i].value
                  } else if (item.operate_type === 2) {
                    arr[i].value = item.value
                    arr[i].operate_type = 2
                  } else if (item.operate_type === 1) {
                    arr[i].value = item.value
                    arr[i].operate_type = 1
                  }
                  break
                }
              }
            }
          }
          if (type === 'comment_article') {
            if (item.operate_action === 'author_add_score') {
              if (item.value || item.value === 0) {
                this.comment.add_score = item.value
              } else {
                if (this.comment.add_score !== undefined) {
                  delete this.comment.add_score
                }
              }
            }
            if (item.operate_action === 'deduct_score') {
              if (item.value || item.value === 0) {
                this.comment.deduct_score = item.value
              } else {
                if (this.comment.deduct_score !== undefined) {
                  delete this.comment.deduct_score
                }
              }
            }
          }
          if (type === 'download_video') {
            if (item.operate_action === 'author_add_score') {
              if (item.value || item.value === 0) {
                this.download.add_score = item.value
              } else {
                if (this.download.add_score !== undefined) {
                  delete this.download.add_score
                }
              }
            }
            if (item.operate_action === 'deduct_score') {
              if (item.value || item.value === 0) {
                this.download.deduct_score = item.value
              } else {
                if (this.download.deduct_score !== undefined) {
                  delete this.download.deduct_score
                }
              }
            }
          }
        })
      }
    },
    closeSetRules () {
      this.$emit('update:modalSetShow', false)
    }
  }
}
</script>

<style scoped>
  .set-save{
    background-color: #409eff;
    padding: 10px 40px;
  }
</style>
<style>
  .set-rules-dialog .textInline{
    display: inline-block;
    width: 100px;
    margin: 0px 5px;
  }
  .set-rules-dialog .model_margin{
    margin-bottom: 25px;
  }
  .set-rules-dialog .model_margin_large{
    margin: 30px 0px 30px 110px;
    color: #999999;
    font-size: 13px;
  }
  .set-rules-dialog .model_margin_large p{
    margin-bottom: 0px;
  }
  .set-rules-dialog .el-dialog{
    max-width: 750px;
  }
  .set-rules-sure-dialog .el-dialog{
    max-width: 400px;
  }
  .set-rules-dialog .el-dialog__header,.set-rules-sure-dialog .el-dialog__header{
    background: #409eff;
    padding: 15px 20px;
  }
  .set-rules-dialog .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
  .set-rules-dialog .el-form-item{
    margin-bottom: 5px;
  }
  .set-rules-dialog .el-input--suffix .el-input__inner{
    padding-right: 15px;
  }
  .set-rules-dialog .el-dialog__title,.set-rules-sure-dialog .el-dialog__title{
    font-size: 16px;
    color: #ffffff;
  }
  .set-rules-dialog .el-dialog__headerbtn .el-dialog__close,.set-rules-sure-dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .set-rules-dialog .el-dialog__footer,.set-rules-sure-dialog .el-dialog__footer{
    text-align: center;
  }
  .set-rules-dialog .el-dialog__body,.set-rules-sure-dialog .el-dialog__body{
    padding: 15px 20px 0 20px;
  }
  .set-rules-dialog .el-textarea .el-textarea__inner{
    min-height: 80px!important;
  }
  .set-rules-el-select .el-select-dropdown__wrap{
    max-height:600px;
  }
  .set-rules-dialog .imgLine .el-input::before{
    content: '';
    position: absolute;
    width: 54px;
    height:21px;
    left: 10px;
    top: 10px;
  }
  .set-rules-dialog .imgLine1 .el-input::before{
    background: url("../assets/invitaton/rank-1.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine2 .el-input::before{
    background: url("../assets/invitaton/rank-2.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine3 .el-input::before{
    background: url("../assets/invitaton/rank-3.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine4 .el-input::before{
    background: url("../assets/invitaton/rank-4.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine5 .el-input::before{
    background: url("../assets/invitaton/rank-5.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine6 .el-input::before{
    background: url("../assets/invitaton/rank-6.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine7 .el-input::before{
    background: url("../assets/invitaton/rank-7.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine8 .el-input::before{
    background: url("../assets/invitaton/rank-8.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine9 .el-input::before{
    background: url("../assets/invitaton/rank-9.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine10 .el-input::before{
    background: url("../assets/invitaton/rank-10.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine11 .el-input::before{
    background: url("../assets/invitaton/rank-11.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine12 .el-input::before{
    background: url("../assets/invitaton/rank-12.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine13 .el-input::before{
    background: url("../assets/invitaton/rank-13.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine14 .el-input::before{
    background: url("../assets/invitaton/rank-14.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine15 .el-input::before{
    background: url("../assets/invitaton/rank-15.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine16 .el-input::before{
    background: url("../assets/invitaton/rank-16.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine17 .el-input::before{
    background: url("../assets/invitaton/rank-17.png") no-repeat;
    background-size: 100% 100%;
  }
  .set-rules-dialog .imgLine18 .el-input::before{
    width: 48px;
    height:26px;
    top: 7px;
    background: url("../assets/invitaton/rank-18.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
