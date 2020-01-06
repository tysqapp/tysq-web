<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container editor-container">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
    <!--<div class="editor-custom-btn-container">-->
    <!--<editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"/>-->
    <!--</div>-->
  </div>
</template>

<script>
import plugins from './plugins'
export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: function () {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data () {
    return {
      hasChange: false,
      hasInit: false,
      audio_ico: '',
      tinymceId: this.id,
      fullscreen: false,
      editor: {},
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN'
      }
    }
  },
  computed: {
    language () {
      // return this.languageTypeList[this.$store.getters.language]
      return this.languageTypeList['zh']
    }
  },
  watch: {
    value (val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    },
    language () {
      this.destroyTinymce()
      this.$nextTick(() => this.initTinymce())
    }
  },
  mounted () {
    if (window.localStorage.getItem('theme')) {
      let val = window.localStorage.getItem('theme')
      if (val === 'eye_care_wrapper') {
        this.initTinymce('#999999')
      } else {
        this.initTinymce('#000000')
      }
    } else {
      this.initTinymce('#000000')
    }
  },
  activated () {
    this.initTinymce()
  },
  deactivated () {
    this.destroyTinymce()
  },
  destroyed () {
    this.destroyTinymce()
  },
  methods: {
    initTinymce (e) {
      const _this = this
      if (document.body.clientWidth > 992) {
        this.audio_ico = require('../../assets/music-none.png')
      } else {
        this.audio_ico = require('../../assets/music-none-phone.png')
      }
      window.tinymce.PluginManager.add('stylebuttons', function (editor, url) {
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (name) {
          editor.addButton('style-' + name, {
            tooltip: '标题 ' + name,
            text: name.toUpperCase(),
            onClick: function () { editor.execCommand('mceToggleFormat', false, name) },
            onPostRender: function () {
              let self = this
              let setup = function () {
                editor.formatter.formatChanged(name, function (state) {
                  self.active(state)
                })
              }
              editor.formatter ? setup() : editor.on('init', setup)
            }
          })
        })
      })
      window.tinymce.init({
        language: this.language,
        selector: `#${this.tinymceId}`,
        height: 600, // this.height
        body_class: 'panel-body',
        object_resizing: true,
        toolbar: ['blockquote  bold italic strikethrough hr ', 'fullscreen style-h1 style-h2 style-h3 style-h4 style-h5 style-h6'],
        menubar: false,
        plugins: plugins,
        paste_as_text: true,
        contextmenu: 'copy',
        resize: 'both',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        auto_focus: false,
        remove_trailing_brs: true,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        branding: false,
        content_style: `blockquote{border-left: 2px solid #598CF2;margin-left: 1.5rem; padding: 0.8rem 1rem;background:#EEEEEE} .panel-body{background:transparent;color:${e}} .mce-preview-object{border:none;}  .mce-object-audio{width:45%;min-width:320px;height:60px;}  .mce-object-audio .mce-shim{background:url(${this.audio_ico});background-size:100% 100%} `,
        fontsize_formats: '8px 10px 12px 14px 18px 24px 36px',
        nonbreaking_force_tab: false, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup (editor) {
          _this.editor = editor
          editor.addButton('img', {
            // 按钮，名
            text: '图片',
            // 是否显示图标
            icon: false,
            // onclick事件
            onclick: function () {
              // editor.insertContent('<p>' + '<img src="http://a3.qpic.cn/psb?/V11lQXJM47VFdR/T1w892fI3kSRH7sJolmSQEqRh7Zh7uq*eBt.k*tLeKw!/c/dLYAAAAAAAAA&ek=1&kp=1&pt=0&bo=OASgBQAAAAAAAL8!&tl=3&vuin=773797313&tm=1557100800&sce=60-2-2&rf=0-0">' + '</p>')
            }
          })
          editor.addButton('video', {
            // 按钮，名
            text: '视频',
            // 是否显示图标
            icon: false,
            // onclick事件
            onclick: function () {
              // 这里点击后会插入一句话
              editor.insertContent('<video src="http://player.youku.com/embed/XMzcwNTY3NTM2MA" Autoplay></video>')
            }
          })
          editor.addButton('audio', {
            // 按钮，名
            text: '音频',
            // 是否显示图标
            icon: false,
            // onclick事件
            onclick: function () {
              // 这里点击后会插入一句话
              editor.insertContent('<audio src=""></audio>')
            }
          })
        }
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        // images_upload_handler(blobInfo, success, failure, progress) {
        //   progress(0);
        //   const token = _this.$store.getters.token;
        //   getToken(token).then(response => {
        //     const url = response.data.qiniu_url;
        //     const formData = new FormData();
        //     formData.append('token', response.data.qiniu_token);
        //     formData.append('key', response.data.qiniu_key);
        //     formData.append('file', blobInfo.blob(), url);
        //     upload(formData).then(() => {
        //       success(url);
        //       progress(100);
        //     })
        //   }).catch(err => {
        //     failure('出现未知问题，刷新页面，或者联系程序员')
        //     console.log(err);
        //   });
        // },
      })
    },
    destroyTinymce () {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent (value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent () {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK (arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    }
  }
}
</script>

<style scoped>
  .tinymce-container {
    position: relative;
  }
  .tinymce-container>>>.mce-fullscreen {
    z-index: 10000;
  }
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }
  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }
  .editor-upload-btn {
    display: inline-block;
  }
</style>
