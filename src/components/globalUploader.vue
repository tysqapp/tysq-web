<template>
  <div id="global-uploader"   v-loading.fullscreen.lock="loading"
       element-loading-text="文件处理中"
       element-loading-background="rgba(0, 0, 0, 0.3)">
    <!-- 上传 -->
    <uploader
      ref="uploader"
      :options="options"
      :fileStatusText="fileStatusText"
      :autoStart="false"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-removed="onFileRemoved"
      @file-error="onFileError"
      class="uploader-app">
      <uploader-btn id="global-uploader-btn" class="mobile-uploader-btn" :attrs="attrs" ref="uploadBtn"><i class="fa fa-upload" aria-hidden="true"></i>上传</uploader-btn>
      <uploader-list v-if="panelShow">
        <div class="file-panel" slot-scope="props">
          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id" class="file-list-li">
              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
               <p class="createTime">{{file.createTime}}</p>
               <p class="no_shelter"></p>
               <p class="has_shelter"></p>
            </li>
            <div class="no-file" v-if="!props.fileList.length">
              <div class="no-passage">
                <p><img src="../../static/images/shangchuan.png" width="62" height="47" alt=""></p>
                <p class="text-999 fs-16">暂无上传中的文件！</p>
              </div>
            </div>
          </ul>
        </div>
      </uploader-list>

    </uploader>

  </div>
</template>

<script>
import store from '../store/index'
import Bus from './js/bus'
import jsSha from 'js-sha256'
export default {
  props: {
    uploadingNumber: Number,
    file_type: Number
  },
  data () {
    let apiTitle = this.http.apiTitle
    return {
      loading: false,
      a_this: this,
      options: {
        target: function (file, Chunk, flag) {
          if (flag) {
            return apiTitle + '/upload_file/info'
          } else {
            return apiTitle + '/upload_file'
          }
        },
        fileParameterName: 'uploadfile',
        simultaneousUploads: 10,
        maxChunkRetries: 3,
        testChunks: true,
        chunkSize: '2097152',
        checkChunkUploadedByResponse: function (chunk, message) {
          let objMessage = JSON.parse(message)
          if (objMessage.status === 0) {
            if (objMessage.data.status === 1) {
              return true
            }
            return (objMessage.data.file_slice || []).indexOf((chunk.offset + 1).toString()) >= 0
          } else {
            if (objMessage.status === 2999 || objMessage.status === 2998) {
              store.commit('flagLogin', true)
              store.commit('flagTime', true)
              store.commit('flagLoginInfo', false)
              Bus.Cookies.set('info', '', -1)
            } else {
              Bus.$message.error('错误码' + objMessage.status + ':' + '' + objMessage.reason)
            }
            return true
          }
        },
        processParams: function (params) {
          let obj = {}
          obj['chunk_number'] = params['chunkNumber']
          obj['total_size'] = params['totalSize']
          obj['chunk_size'] = params['chunkSize']
          obj['total_chunks'] = params['totalChunks']
          obj['current_chunk_size'] = params['currentChunkSize']
          obj['total_size'] = params['totalSize']
          obj['hash'] = params['identifier']
          obj['filename'] = params['filename']
          return obj
        },
        processResponse (response, cbFuction) {
          let res = JSON.parse(response)
          if (res.status !== 0) {
            cbFuction(true, res.reason)
          } else {
            cbFuction(false, response)
          }
        },
        headers: {},
        query () {}
      },
      fileStatusText: {
        success: '成功',
        error: '上传失败',
        uploading: '上传中',
        paused: '已暂停',
        waiting: '等待'
      },
      attrs: {},
      panelShow: true
    }
  },
  created () {
  },
  mounted () {
    Bus.$on('openUploader', query => {
      this.params = query || {}
      if (this.$refs.uploadBtn) {
        $('#global-uploader-btn').click()
      }
    })
  },
  computed: {
    uploader () {
      return this.$refs.uploader.uploader
    }
  },
  methods: {
    onFileAdded (file) {
      console.log(this.$refs.uploader.uploader.fileList)
      if (file.size / 1024 / 1024 > 1024) {
        this.$toast('上传的文件不能大于1G', 2000, 'error')
        this.$refs.uploader.uploader.fileList = []
        return false
      }
      Bus.$emit('fileAdded')
      this.$refs.uploader.uploader.fileList.forEach(item => {
        item.createTime = item.createTime ? item.createTime : this.getTime(new Date().getTime() / 1000)
      })
      this.$emit('uploadTotal', this.$refs.uploader.uploader.fileList.length)
      this.panelShow = true
      this.computeHash(file)
    },
    onFileRemoved (file) {
      this.$emit('uploadTotal', this.$refs.uploader.uploader.fileList.length)
    },
    onFileProgress (rootFile, file, chunk) {
      // console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess (rootFile, file, response, chunk) {
      let res = JSON.parse(response)
      if (res.status !== 0) {
        if (res.status !== 2999 && res.status !== 2998) {
          this.fileListRemove(file)
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
        return false
      } else {
        if (res.data.file_slice && res.data.file_slice.length > 0) {
          if (file.chunks.length === res.data.file_slice.length) {
            this.http.mergeFile({
              hash: file.uniqueIdentifier,
              total_chunks: file.chunks.length
            }).then(req => {
              if (req.status === 0) {
                let fileList = this.$refs.uploader.uploader.fileList
                let _this = this
                setTimeout(function () {
                  Bus.$emit('fileSuccess')
                  for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].id === file.id) {
                      fileList.splice(i, 1)
                      _this.$emit('uploadTotal', _this.$refs.uploader.uploader.fileList.length)
                    }
                  }
                  _this.$parent.$parent.$parent.getFileList({file_type: _this.file_type, type: 1})
                }, 500)
              } else {
                this.fileListRemove(file)
                this.$toast('错误码' + res.status + ':' + '' + req.reason, 2000, 'error')
              }
            })
          }
        } else {
          let fileList = this.$refs.uploader.uploader.fileList
          let _this = this
          setTimeout(function () {
            Bus.$emit('fileSuccess')
            for (let i = 0; i < fileList.length; i++) {
              if (fileList[i].id === file.id) {
                fileList.splice(i, 1)
                _this.$emit('uploadTotal', _this.$refs.uploader.uploader.fileList.length)
              }
            }
            _this.$parent.$parent.$parent.getFileList({file_type: _this.file_type, type: 1})
          }, 500)
        }
      }
    },
    fileListRemove (file) {
      let fileList = this.$refs.uploader.uploader.fileList
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].id === file.id) {
          fileList.splice(i, 1)
          this.$emit('uploadTotal', this.$refs.uploader.uploader.fileList.length)
        }
      }
    },
    onFileError (rootFile, file, response, chunk) {
      this.$toast(response, 2000, 'error')
    },
    computeHash (file) {
      this.loading = true
      let _this = this
      let fileReader = new FileReader()
      let hash = ''
      file.pause()
      fileReader.readAsArrayBuffer(file.file)
      fileReader.onload = e => {
        if (file.size !== e.target.result.byteLength) {
          this.error('Browser reported success but could not read the file until the end.')
          return
        }

        hash = jsSha(e.target.result)
        if (hash) {
          _this.loading = false
        }
        this.uploader.opts.query = {
          ...this.params
        }
        file.uniqueIdentifier = hash
        file.resume()
      }
      fileReader.onerror = function () {
        this.error('FileReader onerror was triggered, maybe the browser aborted due to high memory usage.')
      }
    }
  },
  watch: {
  },
  destroyed () {
    Bus.$off('openUploader')
  },
  components: {}
}
</script>

<style scoped lang="scss">
  #global-uploader {
    .uploader-app {
      width: 80%;
      margin: 20px auto                  ;
    }

    .file-panel {
      background-color: #fff;
      border-radius: 7px 7px 0 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, .2);

      .file-title {
        display: flex;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        border-bottom: 1px solid #ddd;

        .operate {
          flex: 1;
          text-align: right;
        }
      }

      .file-list {
        position: relative;
        min-height: 400px;
        max-height: 600px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;

        > li {
          background-color: #fff;
          list-style-type: none;
          padding: 20px 0;
          border-bottom: 1px solid #e5e5e5;
        }
      }

      &.collapse {
        .file-title {
          background-color: #E7ECF2;
        }
      }
    }

    .no-file {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }

    /deep/.uploader-file-icon {
      &:before {
        content: '' !important;
      }

      &[icon=image] {
        background: url(./images/image-icon.png);
      }
      &[icon=video] {
        background: url(./images/video-icon.png);
      }
      &[icon=document] {
        background: url(./images/text-icon.png);
      }
    }

    /deep/.uploader-file-actions > span {
      margin-right: 6px;
    }
  }
</style>
<style scoped>
  #global-uploader .uploader-app{
    width: 100%;
    margin: 0 auto;
  }
  #global-uploader .file-panel{
    box-shadow: none;
    border-radius: 0;
  }
  #global-uploader .file-panel .file-title{
    display: none;
  }
  @media only screen and (max-width: 768px) {
    #global-uploader .mobile-uploader-btn{
      font-weight: 300;
      text-align: center;
      color: #598cf2;
      position: absolute;
      left: 294px;
      top: -86px;
      width: 74px;
      background: linear-gradient(135deg,#ffffff,#f6f2f3);
      border: 1px solid #dddddd;
      border-color: #dddddd;
      font-size: 14px;
      padding: 5px 10px;
      opacity: 1;
      z-index: 3;
      border-radius: 3px;
    }
  }
</style>
<style>
  #global-uploader .uploader-btn{
    font-weight: 300;
    text-align: center;
    color: #ffffff;
    position: absolute;
    left: -281px;
    top: 400px;
    width: 237px;
    background: linear-gradient(135deg,#36b6f9,#598cf2);
    border: none 0;
    border-color: transparent;
    font-size: 18px;
    padding: 20px 20px;
    opacity: 1;
    z-index: 2;
    border-radius: 3px;
  }
  #global-uploader .el-loading-mask{
    z-index: 2;
    top: 10px;
  }
  #global-uploader .uploader-file{
    margin-left: 10px;
    height: 100px;
    border-bottom: none 0;
  }
  #global-uploader .uploader-file-icon{
    width: 150px;
    height: 100px;
    margin-top: 0;
    margin-right: 15px;
    background: #f2f3f7;
  }
  #global-uploader .uploader-file-icon[icon="folder"]::before {
    content: " ";
    width: 150px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: url("../assets/yun-manage/icon-zip.png") no-repeat center center;
  }
  #global-uploader .uploader-file-icon[icon="image"]::before {
    content: " ";
    width: 150px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: url("../assets/yun-manage/icon-img.png") no-repeat center center;
  }
  #global-uploader .uploader-file-icon[icon="video"]::before {
    content: " ";
    width: 150px;
    height: 100px;
    background: url("../assets/yun-manage/icon-video.png") no-repeat center center;
  }
  #global-uploader .uploader-file-icon[icon="audio"]::before {
    content: " ";
    width: 150px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: url("../assets/yun-manage/icon-mp3.png") no-repeat center center;
  }
  #global-uploader .uploader-file-icon[icon="unknown"]::before {
    content: " ";
    width: 150px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: url("../assets/yun-manage/icon-zip.png") no-repeat center center;
  }
  #global-uploader .uploader-file-icon[icon="document"]::before {
    content: " ";
    width: 150px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: url("../assets/yun-manage/icon-zip.png") no-repeat center center;
  }
  #global-uploader .uploader-file-progress{
    height:3px;
    width: 50.88%;
    background:rgba(35,193,50,1);
    border-radius:2px;
    bottom: 8px;
    left: 180px;
    z-index: 3;
  }
  #global-uploader .uploader-file-status>span:first-of-type{
    color: #FF0000;
  }
  #global-uploader .uploader-file-status>span:nth-of-type(2){
    color: rgba(35,193,50,1);
  }
  #global-uploader .has_shelter{
    position: absolute;
    width: 190px;
    height: 105px;
    background-color: #fff;
    top: 7px;
    left: 0;
    z-index: 4;
  }
  #global-uploader .no_shelter{
    position: absolute;
    width:50%;
    left: 190px;
    top:109px;
    height:3px;
    border-radius:2px;
    background-color: #DDDDDD;
    z-index:2;
  }
  #global-uploader .uploader-file-meta{
    display: none;
  }
  #global-uploader .uploader-file-info{
    z-index: 5;
  }
  #global-uploader .uploader-file-info .uploader-file-name{
    width: 70%;
  }
  #global-uploader .uploader-file-actions>span{
    margin-right: 15px;
  }
  #global-uploader .uploader-file-actions>.uploader-file-resume{
    width: 40px;
    height: 40px;
    background:url("../assets/yun-manage/bofang.png");
    background-size: 100% 100%;
  }
  #global-uploader .uploader-file-actions>.uploader-file-pause{
    width: 40px;
    height: 40px;
    background:url("../assets/yun-manage/zanting.png");
    background-size: 100% 100%;
  }

  #global-uploader .uploader-file-actions>.uploader-file-remove{
    width: 40px;
    height: 40px;
    background:url("../assets/yun-manage/shanchu.png");
    background-size: 100% 100%;
  }
  #global-uploader .uploader-file-actions{
    width: 19%;
    float: right;
  }
  #global-uploader .uploader-file-status{
    position: absolute!important;
    top:65px;
    left: 180px;
    height: 20px;
    line-height: 20px;
    text-indent: 0;
  }
  #global-uploader .uploader-file-size{
    position: absolute!important;
    color: rgba(159,173,194,1);
    width: auto;
    font-size: 12px;
    top:40px;
    left: 345px;
    height: 20px;
    line-height: 20px;
    text-indent: 0;
  }
  #global-uploader .file-list-li{
    position: relative;
  }
  #global-uploader .uploader-file-status em, #global-uploader .uploader-file-status i{
    display: none;
  }
  #global-uploader .createTime{
    position: absolute;
    color: rgba(159,173,194,1);
    width: auto;
    font-size: 12px;
    top:60px;
    left: 192px;
    height: 20px;
    line-height: 20px;
    text-indent: 0;
  }
  .no-passage{
    text-align: center;
    margin-top: 0;
    padding: 50px 0;
  }
</style>
