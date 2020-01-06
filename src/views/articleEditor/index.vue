<template>
  <div class="container main-container article-edit">
    <div class="view welcome-view">
      <div class="welcome-context">
        <h2 class="title">写文章</h2>
        <div class="title-info border-radius-4">
          <h4 class="text-666"><span class="required-info">*</span>文章信息</h4>
          <div class="createPost-main-container">
            <el-form ref="postForm" :model="postForm"  label-width="0" class="form-container">
              <el-form-item label="" prop="title">
                <el-input v-model="postForm.title" placeholder="请输入文章标题" maxlength="200"></el-input>
              </el-form-item>
            </el-form>
            <el-form ref="postForm" :inline="true" :model="postForm" label-width="0" class="form-container">
              <el-form-item label="">
                <el-select v-model="category_id" placeholder="选择一级分类"  @change="go_subNav" clearable>
                  <el-option :label="item.name" :value="item.id" v-for="(item,index) in nav" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" v-if="sub_nav.length>0">
                <el-select v-model="sub_category_id" placeholder="选择二级分类" clearable>
                  <el-option :label="item.name" :value="item.id" v-for="(item,index) in sub_nav" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="title-info border-radius-4">
          <h4 class="text-666">添加标签</h4>
          <div class="createPost-main-container">
            <el-tag
              :key="index"
              v-for="(tag,index) in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag.label_name}}
            </el-tag>
            <el-button @click="addLabelShow">+添加标签</el-button>
            <div class="label-tag-box" v-if="isShow">
              <button @click="closeAddLabel" type="button" aria-label="Close" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="">
                  <el-input v-model="formInline.tag" placeholder="可输入标签名称查询"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitTag()">搜索</el-button>
                </el-form-item>
              </el-form>
              <ul class="clearfix">
                <li class="pull-left" v-for="(item,index) in labelData10" :key="index"><el-button @click="addLabel(item,item.label_id,item.label_name)" type="primary" plain>{{item.label_name}}</el-button></li>
                <li class="text-999 text-center" v-if="labelData10.length<=0">暂无你需要搜索的标签哦！</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="title-info border-radius-4">
          <h4 class="text-666"><span class="required-info">*</span> 正文</h4>
          <div class="createPost-main-container">
            <el-form ref="postForm" :model="postForm" label-width="0" class="form-container">
              <div class="editor-container">
                <p class="force_p">
                  <el-tooltip class="item" effect="dark" content="图片" placement="bottom">
                    <img src="../../assets/img1.png" alt="上传图片" class="mr-16 force" @click="choiceStyle('img')">
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="视频" placement="bottom">
                    <img src="../../assets/video1.png" alt="上传视频" class="mr-16 force" @click="choiceStyle('video')">
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="音频" placement="bottom">
                    <img src="../../assets/music.png" alt="上传音频" class="mr-16 force" @click="choiceStyle('audio')">
                  </el-tooltip>
                </p>
                <Tinymce ref="editor" :height="400" v-model="postForm.content"/>
              </div>
              <el-form-item>
                <el-button type="primary" @click="onSubmit(true)" v-if="!this.$route.query.article_id" :disabled="!postForm.content||resflag">发表文章</el-button>
                <el-button type="primary" @click="onSubmit(true)" :disabled="!postForm.content||resflag" v-else>更新文章</el-button>
                <el-button type="warning" @click="onSubmit(false)" :disabled="!postForm.content||resflag">保存草稿</el-button>
                <el-button @click="cancal">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <diglog-components :scene="text_tips" :modal-show.sync="modalShow" :needBack="needBack"></diglog-components>
    <global-popup :file_type='file_type' :propData="propData" :title="title"  :choiceStyle="choice_style" :modal-show.sync="modalVisible"  @click="choiceData"></global-popup>
    <!--el-dialog-->
    <el-dialog :title="dialog_title" align="center" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="dialogArticleVisible" class="box-shadow article-dialog">
      <div class="dialog-body">
        <p class="text-center" style="line-height: 30px">
          <span class="fs-16">文章会尽快审核，请耐心等待。</span>
          <br>
          <span class="fs-16">审核状态请留意站内信息或邮件通知。</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer clearfix">
        <el-button type="text" @click="cancal">返回首页</el-button>
        <el-button type="text" @click="checkArtitle">查看文章</el-button>
      </div>
    </el-dialog>
    <!--el-dialog-->
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import globalPopup from '@/components/popup'
import diglogComponents from '../../components/diglogComponents'
import store from '../../store/index'
export default {
  name: 'Post',
  components: {
    Tinymce,
    'global-popup': globalPopup,
    'diglog-components': diglogComponents
  },
  data () {
    return {
      text_tips: '',
      dialog_title: '',
      modalShow: false,
      needBack: false,
      resflag: false,
      category_id: null,
      sub_category_id: null,
      path: 'article/info?article_id=',
      article_id: '',
      is_review: '',
      activeName: 'first',
      choice_style: 'Multiple',
      labelData: [],
      labelData10: [],
      nav: [],
      sub_nav: [],
      postForm: {
        title: '',
        label: [],
        content: '',
        audios: [],
        files: []
      },
      oldPostForm: {},
      editorContent: '',
      infoData: {},
      imageArray: [],
      videoArray: [],
      audioArray: [],
      trade: '',
      title: '云盘图片选择',
      file_type: 1,
      propData: [],
      modalVisible: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      formInline: {},
      isShow: false,
      dialogArticleVisible: false
    }
  },
  inject: ['reload'],
  computed: {
    articleResFlag () {
      return this.$store.state.articleEditorFlag
    }
  },
  created () {
  },
  mounted () {
    this.geCategory()
    if (!this.$route.query.article_id) {
      this.getlabData()
    }
  },
  watch: {
    $route (to, from) {
      this.geCategory()
      if (!this.$route.query.article_id) {
        this.getlabData()
      }
    },
    articleResFlag (val) {
      if (val) {
        this.resflag = false
      }
    }
  },
  methods: {
    judgement (params) {
      this.http.getScoreJudgement(params).then(res => {
        if (res.status === 0) {
          if (res.data.is_satisfy && res.data.resource_status === 0) {
            if (this.Cookies.get('info')) {
              this.onSubmit(true)
            } else {
              store.commit('flagLogin', true)
            }
          } else if (!res.data.is_satisfy && res.data.resource_status === -3) {
            this.$router.push('/nopassage')
          } else if (!res.data.is_satisfy && res.data.resource_status === 0) {
            this.text_tips = `发布一篇新文章需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再发布`
            this.modalShow = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    go_subNav (value) {
      this.sub_nav = []
      this.sub_category_id = null
      this.nav.forEach(item => {
        if (item.id === value) {
          if (item.subcategories) {
            this.sub_nav = item.subcategories
            return false
          }
        }
      })
    },
    geCategory (params) {
      this.http.userCategory(params).then(res => {
        if (res.status === 0) {
          if (res.data.category_info) {
            this.nav = res.data.category_info
            if (this.$route.query.article_id) {
              this.passageDetail({article_id: this.$route.query.article_id})
            } else {
              if (this.$route.query.from_router) {
                if (window.sessionStorage.getItem('category_info_id')) {
                  this.nav_sub_Data(this.nav, Number(window.sessionStorage.getItem('category_info_id')))
                }
              } else {
                if (window.sessionStorage.getItem('parent_id')) {
                  if (window.sessionStorage.getItem('parent_id') !== '-1') {
                    this.category_id = Number(window.sessionStorage.getItem('parent_id'))
                    if (this.nav.length > 0) {
                      for (let i = 0; i < this.nav.length; i++) {
                        if (this.nav[i].id === this.category_id) {
                          this.sub_nav = this.nav[i].subcategories ? this.nav[i].subcategories : []
                          break
                        }
                      }
                    }
                  }
                }
                if (window.sessionStorage.getItem('category_id')) {
                  if (window.sessionStorage.getItem('category_id') !== '0') {
                    this.sub_category_id = Number(window.sessionStorage.getItem('category_id'))
                  }
                }
              }
            }
          } else {
            this.nav = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    passageDetail (params) {
      this.http.passageEdit(params).then(res => {
        if (res.status === 0) {
          this.postForm.title = res.data.article_info.title
          this.dynamicTags = res.data.article_info.label
          if (res.data.article_info.label && res.data.article_info.label.length > 0) {
            this.http.getLabel().then(req => {
              if (req.status === 0) {
                if (req.data.label_infos) {
                  this.labelData = req.data.label_infos
                  if (req.data.label_infos.length > 0 && req.data.label_infos.length <= 20) {
                    this.labelData10 = req.data.label_infos
                  } else {
                    this.labelData10 = req.data.label_infos.slice(0, 20)
                  }
                  res.data.article_info.label.forEach(item => {
                    this.postForm.label.push(item.label_id)
                    this.labelData.forEach(item1 => {
                      if (item1.label_id === item.label_id) {
                        this.labelData10.splice(this.labelData10.indexOf(item1), 1)
                      }
                    })
                  })
                } else {
                  this.labelData10 = []
                }
              } else {
                this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
              }
            })
          } else {
            this.getlabData()
          }
          if (res.data.article_info.videos && res.data.article_info.videos.length > 0) {
            let videos = res.data.article_info.videos
            videos.forEach(item => {
              let obj = {}
              obj.id = item.video.id
              obj.basic_file_id = item.video.basic_file_id
              if (item.cover && item.cover.length > 0) {
                let arraycover = []
                item.cover.forEach(cover => {
                  let objcover = {}
                  objcover.id = cover.id
                  arraycover.push(objcover)
                })
                obj.covers = arraycover
              } else {
                obj.covers = null
              }
              if (item.screen_shot && item.screen_shot.length > 0) {
                let arrayScreenshot = []
                item.screen_shot.forEach(screenshot => {
                  let objscreenshot = {}
                  objscreenshot.id = screenshot.id
                  arrayScreenshot.push(objscreenshot)
                })
                obj.screenshots = arrayScreenshot
              } else {
                obj.screenshots = null
              }
              this.videoArray.push(obj)
            })
          }
          if (res.data.article_info.audios && res.data.article_info.audios.length > 0) {
            this.audioArray = res.data.article_info.audios
          }
          if (res.data.article_info.images && res.data.article_info.images.length > 0) {
            this.imageArray = res.data.article_info.images
          }
          let regVideo = /<video [^>]*src=['"]([^'"]+)[^>]*><\/video>/gi
          let regAudio = /<audio [^>]*src=['"]([^'"]+)[^>]*><\/audio>/gi
          if (res.data.article_info.content) {
            res.data.article_info.content = res.data.article_info.content.replace(regVideo, function (match, capture) {
              return `<span class="mce-preview-object mce-object-video" data-mce-p-srcUrl=${capture} contenteditable="false"
            data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen"  data-mce-p-frameborder="no" data-mce-p-scrolling="no">
                              <video  style="max-width: 500px;"  controls="controls" controlslist="nodownload"></video></span>`
            })
            res.data.article_info.content = res.data.article_info.content.replace(regAudio, function (match, capture) {
              return `<span class="mce-preview-object mce-object-audio" data-mce-p-srcUrl=${capture} contenteditable="false" data-mce-object="audio" data-mce-p-allowfullscreen="allowfullscreen"  data-mce-p-frameborder="no" data-mce-p-scrolling="no">
                 <audio  style="width: 100%"   controls="controls" controlslist="nodownload"></audio>
                 <span style="position: absolute;left:75px;top: 20px;z-index: 999;font-size: 13px;" class="audio_fileName"></span>
                 </span>`
            })
            res.data.article_info.content = '<div>' + res.data.article_info.content + '</div>'
            let dom = $(res.data.article_info.content)
            if (res.data.article_info.videos && res.data.article_info.videos.length > 0) {
              let videos = res.data.article_info.videos
              let videosDom = dom.find('video')
              videos.forEach((item, index) => {
                let posterUrl = item.cover && item.cover.length > 0 ? item.cover[0].url : item.screen_shot && item.screen_shot.length > 0 ? item.screen_shot[0].url : ''
                videosDom.eq(index).attr('poster', posterUrl)
              })
            }
            if (res.data.article_info.audios && res.data.article_info.audios.length > 0) {
              let audios = res.data.article_info.audios
              let audiosDom = dom.find('.audio_fileName')
              audios.forEach((item, index) => {
                audiosDom.eq(index).text(item.name)
              })
            }
            window.tinymce.get(this.$refs.editor.tinymceId).insertContent(dom.html())
          }
          this.nav_sub_Data(this.nav, res.data.article_info.category_id)
          // if (this.nav.length > 0) {
          //   for (let i = 0; i < this.nav.length; i++) {
          //     if (this.nav[i].id === res.data.article_info.category_id) {
          //       this.category_id = res.data.article_info.category_id
          //       this.sub_nav = this.nav[i].subcategories ? this.nav[i].subcategories : []
          //       return false
          //     } else {
          //       for (let i = 0; i < this.nav.length; i++) {
          //         if (this.nav[i].subcategories) {
          //           for (let j = 0; j < this.nav[i].subcategories.length; j++) {
          //             if (this.nav[i].subcategories[j].id === res.data.article_info.category_id) {
          //               this.sub_nav = this.nav[i].subcategories
          //               this.category_id = this.nav[i].subcategories[j].parent_id
          //               this.sub_category_id = this.nav[i].subcategories[j].id
          //               return false
          //             }
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    nav_sub_Data (arr, categoryId) {
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === categoryId) {
            this.category_id = categoryId
            this.sub_nav = arr[i].subcategories ? arr[i].subcategories : []
            return false
          } else {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].subcategories) {
                for (let j = 0; j < arr[i].subcategories.length; j++) {
                  if (arr[i].subcategories[j].id === categoryId) {
                    this.sub_nav = arr[i].subcategories
                    this.category_id = arr[i].subcategories[j].parent_id
                    this.sub_category_id = arr[i].subcategories[j].id
                    return false
                  }
                }
              }
            }
          }
        }
      }
    },
    addLabel (item, id, name) {
      if (this.dynamicTags.length < 6) {
        this.dynamicTags.push({label_name: name, label_id: id})
        this.postForm.label.push(id)
        this.labelData10.splice(this.labelData10.indexOf(item), 1)
        return false
      } else {
        this.$toast('所选标签不能超过6个', 2000, 'warning')
        return false
      }
    },
    addLabelShow () {
      this.isShow = true
    },
    onSubmitTag () {
      if (this.formInline.tag) {
        let arr = []
        for (let i = 0; i < this.labelData.length; i++) {
          if (this.labelData[i].label_name.indexOf(this.formInline.tag) > -1) {
            arr.push(this.labelData[i])
          }
          if (arr.length === 20) {
            break
          }
        }
        this.labelData10 = arr
      } else {
        this.$toast('请请输入你要搜索的标签', 2000, 'warning')
      }
    },
    choiceStyle (flag) {
      this.trade = flag
      this.modalVisible = true
      if (flag === 'img') {
        this.title = '云盘图片选择'
        this.file_type = 1
        this.getYp(this.file_type)
      } else if (flag === 'video') {
        this.title = '云盘视频选择'
        this.file_type = 2
        this.getYp(this.file_type)
      } else {
        this.title = '云盘音频选择'
        this.file_type = 3
        this.getYp(this.file_type)
      }
    },
    getYp (fileType) {
      this.http
        .getMyFileList({file_type: fileType})
        .then(res => {
          if (res.status === 0) {
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
    },
    choiceData (playload) {
      if (this.trade === 'img') {
        if (playload.length > 0) {
          playload.forEach(item => {
            window.tinymce.get(this.$refs.editor.tinymceId).insertContent(`<p><img src=` + item.url + `></p>`)
          })
        }
        if (this.imageArray.length > 0) {
          this.imageArray = this.forReatData(this.imageArray, playload)
        } else {
          this.imageArray = playload
        }
      } else if (this.trade === 'video') {
        if (playload.length > 0) {
          playload.forEach(item => {
            let posterUrl = item.covers ? item.covers[0].cover_url : item.screenshots ? item.screenshots[0].screenshots_url : ''
            window.tinymce.get(this.$refs.editor.tinymceId).insertContent(`<p>
               <span class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen" data-mce-p-srcUrl=${item.url} data-mce-p-frameborder="no" data-mce-p-scrolling="no">
                 <video   style="max-width: 500px;" controls="controls" controlslist='nodownload' poster=${posterUrl}></video>
               </span>
            </p>`)
          })
        }
        if (this.videoArray.length > 0) {
          this.videoArray = this.forReatData(this.videoArray, playload)
        } else {
          this.videoArray = playload
        }
      } else {
        if (playload.length > 0) {
          playload.forEach(item => {
            window.tinymce.get(this.$refs.editor.tinymceId).insertContent(`<p>
               <span class="mce-preview-object mce-object-audio" contenteditable="false" data-mce-object="audio" data-mce-p-allowfullscreen="allowfullscreen" data-mce-p-srcUrl=${item.url} data-mce-p-frameborder="no" data-mce-p-scrolling="no">
                 <audio  style="width: 100%;"  controls="controls"></audio>
                 <span style="position: absolute;left:75px;top: 20px;font-size:13px;z-index: 999">${item.filename}</span>
               </span>
            </p>`)
          })
        }
        if (this.audioArray.length > 0) {
          this.audioArray = this.forReatData(this.audioArray, playload)
        } else {
          this.audioArray = playload
        }
      }
    },
    forReatData (arr, arr1) {
      arr = arr.concat(arr1)
      let newJson = []
      for (let item1 of arr) {
        let flag = true
        for (let item2 of newJson) {
          if (item1.basic_file_id === item2.basic_file_id) {
            flag = false
          }
        }
        if (flag) {
          newJson.push(item1)
        }
      }
      return newJson
    },
    onSubmit (type) {
      this.oldPostForm = Object.assign({}, this.postForm)
      if (!this.postForm.title) {
        this.$toast('请输入文章标题', 2000, 'error')
        return false
      }
      if (!this.category_id) {
        this.$toast('请选择分类', 2000, 'error')
        return false
      } else {
        if (this.sub_category_id) {
          this.postForm.category_id = this.sub_category_id
        } else {
          this.postForm.category_id = this.category_id
        }
      }
      if (!this.postForm.content) {
        this.$toast('请输入文章正文', 2000, 'error')
        return false
      }
      let img = this.postForm.content.match(/<img[^>]+>/g)
      let video = this.postForm.content.match(/<video[^>]+>/g)
      let audio = this.postForm.content.match(/<audio[^>]+>/g)
      let regImg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi
      let regVideo = /<video [^>]*srcUrl=['"]([^'"]+)[^>]*>/gi
      let regAudio = /<audio [^>]*srcUrl=['"]([^'"]+)[^>]*>/gi
      if (img) {
        let arr = []
        img.forEach(item => {
          let src = $(item).attr('src')
          let srcArr = src.split('/')
          let id = Number(srcArr[srcArr.length - 3])
          for (let i = 0; i < this.imageArray.length; i++) {
            if (this.imageArray[i].basic_file_id === Number(id)) {
              arr.push(this.imageArray[i].id)
              return false
            }
          }
        })
        this.postForm.images = arr
      } else {
        this.postForm.images = []
      }
      if (video) {
        let arr = []
        video.forEach(item => {
          let src = $(item).attr('srcUrl')
          let srcArr = src.split('/')
          let id = Number(srcArr[srcArr.length - 3])
          for (let i = 0; i < this.videoArray.length; i++) {
            if (this.videoArray[i].basic_file_id === Number(id)) {
              arr.push(this.videoArray[i].id)
              return false
            }
          }
        })
        this.postForm.videos = arr
      } else {
        this.postForm.videos = []
      }
      if (audio) {
        let arr = []
        audio.forEach(item => {
          let src = $(item).attr('srcUrl')
          let srcArr = src.split('/')
          let id = Number(srcArr[srcArr.length - 3])
          for (let i = 0; i < this.audioArray.length; i++) {
            if (this.audioArray[i].basic_file_id === Number(id)) {
              arr.push(this.audioArray[i].id)
              return false
            }
          }
        })
        this.postForm.audios = arr
      } else {
        this.postForm.audios = []
      }
      this.postForm.content = this.postForm.content.replace(/[\r\n]/g, '')
      this.postForm.content = this.postForm.content.replace(regImg, "<img src='{{img}}'/>")
      this.postForm.content = this.postForm.content.replace(regVideo, "<video src='{{video}}' controls='controls' controlslist='nodownload'>")
      this.postForm.content = this.postForm.content.replace(regAudio, "<audio src='{{audio}}' controls='controls' controlslist='nodownload'>")
      if (this.postForm.status) {
        delete this.postForm.status
      }
      if (type) {
        if (!this.$route.query.article_id) {
          this.resflag = true
          this.http.postPassage(this.postForm).then(res => {
            this.resflag = false
            if (res.status === 0) {
              this.article_id = res.data.article_id
              this.is_review = res.data.is_review
              if (this.is_review === true) {
                this.dialogArticleVisible = true
                this.dialog_title = res.data.limit_score > 0 ? '文章已提交审核,扣' + res.data.limit_score + '积分' : '文章已提交审核'
              } else {
                let str = res.data.limit_score > 0 ? '文章发布成功,扣' + res.data.limit_score + '积分' : '文章发布成功'
                this.$toast(str, 2000, 'common')
                this.$router.push(this.path + this.article_id)
              }
            } else if (res.status === 3997) {
              this.text_tips = `发布一篇新文章需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再发布`
              this.modalShow = true
              this.postForm = this.oldPostForm
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        } else {
          this.postForm.article_id = this.$route.query.article_id
          this.resflag = true
          this.http.updatePassage(this.postForm).then(res => {
            this.resflag = false
            if (res.status === 0) {
              this.article_id = res.data.article_id
              this.is_review = res.data.is_review
              if (this.is_review === true) {
                this.dialogArticleVisible = true
                this.dialog_title = res.data.limit_score > 0 ? '文章已提交审核,扣' + res.data.limit_score + '积分' : '文章已提交审核'
              } else {
                this.$router.push(this.path + this.$route.query.article_id)
                let str = res.data.limit_score > 0 ? '文章更新成功,扣' + res.data.limit_score + '积分' : '文章更新成功'
                this.$toast(str, 2000, 'common')
              }
            } else if (res.status === 3997) {
              this.text_tips = `发布一篇新文章需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再发布`
              this.modalShow = true
              this.postForm = this.oldPostForm
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        }
      } else {
        if (!this.$route.query.article_id) {
          this.postForm.status = 2
          this.resflag = true
          this.http.postPassage(this.postForm).then(res => {
            this.resflag = false
            if (res.status === 0) {
              this.$toast('草稿保存成功', 2000, 'common')
              this.article_id = res.data.article_id
              this.$router.push(this.path + this.article_id)
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        } else {
          this.postForm.article_id = this.$route.query.article_id
          this.postForm.status = 2
          this.resflag = true
          this.http.updatePassage(this.postForm).then(res => {
            this.resflag = false
            if (res.status === 0) {
              this.$router.push(this.path + this.$route.query.article_id)
              this.$toast('草稿保存成功', 2000, 'common')
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        }
      }
    },
    cancal () {
      this.$router.push('/home')
      window.sessionStorage.setItem('nav_index', 0)
      window.sessionStorage.setItem('sub_nav_index', 0)
      this.reload()
    },
    getlabData () {
      this.http.getLabel().then(res => {
        if (res.status === 0) {
          this.labelData = res.data.label_infos
          if (res.data.label_infos.length > 0 && res.data.label_infos.length <= 20) {
            this.labelData10 = res.data.label_infos
          } else {
            this.labelData10 = res.data.label_infos.slice(0, 20)
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    // 关闭标签
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.postForm.label.splice(this.postForm.label.indexOf(tag.label_id), 1)
      this.labelData10.push(tag)
    },
    checkArtitle () {
      this.$router.push(this.path + this.article_id)
    },
    closeAddLabel () {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
  .main-container>.view {
    width: 100%;
  }
  .editor-container{
    position: relative;
  }
  .editor-container .force_p{
    position: absolute;
    left:170px;
    top:4px;
    z-index: 99;
  }
  .editor-container .force{
    width: 18px;
    height: 16px;
  }
  .required-info{
    color: red;
    vertical-align: middle;
  }
  .title{
    border-radius: 4px;
    padding: 15px 30px;
    background-color: #ffffff;
    font-size: 16px;
  }
  .title-info{
    background-color: #ffffff;
    margin-bottom: 15px;
  }
  .title-info h4{
    padding: 20px 30px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #ffffff;
    font-size: 16px;
  }
  .createPost-main-container{
    background-color: #FFFFFF;
    padding: 20px 30px;
    overflow: hidden;
  }
  .editor-container{
    margin-bottom: 15px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .article-dialog .el-dialog__footer .el-button{
    width: 50%;
    float: left;
    border-right: 1px solid #e5e5e5;
    padding: 22px 20px;
    position: relative;
    border-radius: 0;
  }
  .article-dialog .el-button+.el-button{
    margin-left: 0px;
  }
  .createPost-main-container .el-tag{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
  .label-tag-box{
    max-width: 700px;
    background: #f7f7f7;
    padding: 30px 30px;
    border: 1px solid #dddddd;
    margin-top: 20px;
    position: relative;
  }
  .label-tag-box .el-dialog__headerbtn{
    right: 10px;
    top: 10px;
  }
  .label-tag-box ul li{
    margin-right: 30px;
    margin-bottom: 20px;
  }
  @media only screen and (max-width: 768px){
    .position li{
      margin: 0;
      font-size: 14px;
    }
    .createPost-main-container{
      padding: 15px 15px;
    }
  }
</style>
<style>
  .article-edit .el-tabs .el-tabs__header{
    margin-bottom: 0;
  }
  .article-edit .el-tabs__nav-wrap::after{
    background: transparent;
  }
  .article-edit .el-tabs__item{
    font-size: 16px;
  }
  .article-edit .el-tabs__item.is-active{
    color: #598cf2;
  }
  .article-edit .el-tabs__active-bar{
    background-color: #598cf2;
  }
  .article-edit.article-edit .createPost-main-container .el-tag{
    margin: 5px;
  }
  .article-dialog .el-dialog{
    max-width: 480px;
    border-radius: 5px;
    overflow: hidden;
  }
  .article-dialog .el-dialog__title{
    font-weight: 700;
  }
  .article-dialog .el-dialog__footer{
    padding: 0;
    border-top: 1px solid #e5e5e5;
  }
</style>
