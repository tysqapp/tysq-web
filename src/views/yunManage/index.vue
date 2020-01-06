<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <!-- el-main -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="tab-box">
              <ul class="clearfix">
                <li
                  v-for="(item1, index1) in arr"
                  :key="index1"
                  :class="{ active: active === index1 }"
                  @click="changeFile(index1, item1);"
                >
                  <span>{{ item1.name }}</span>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="left-tab-box border-radius-4">
              <ul>
                <li
                  v-for="(item1, index1) in arr"
                  :key="index1"
                  :class="{ active: active === index1 }"
                  @click="changeFile(index1, item1);"
                >
                  <span>{{ item1.name }}</span>
                </li>
                <!--
                  <el-button size="small" type="primary"><i class="fa fa-upload" aria-hidden="true"></i>点击上传</el-button>
                -->
              </ul>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <div class="right-upload-box">
              <div class="upload-tab">
                <ul class="clearfix tab-nav-ul">
                  <li
                    class="tab-nav-li"
                    :class="{ active: active2 }"
                    @click="changeFileStatus2();"
                  >
                    <span>{{ `已上传(${total})` }}</span>
                  </li>
                  <li
                    class="tab-nav-li"
                    :class="{ active: active1 }"
                    @click="changeFileStatus1();"
                  >
                    <span>{{ `上传中(${uploadingNumber})` }}</span>
                  </li>
                </ul>
                <div class="upload-box">
                  <global-uploader
                    @uploadTotal="uploading"
                    :file_type="resinfo.file_type"
                  ></global-uploader>
                  <div class="uploaded-box" v-if="this.active2">
                    <ul>
                      <li v-for="(item, index) in filedList" :key="index" v-if="filedList.length > 0">
                        <div class="mobile-uploaded-img">
                          <img v-if="item.type === 'video'" class="cover-img" :src="item.screenshots? item.screenshots[0].screenshots_url: icon_video" width="150" height="100" :alt="item.filename"/>
                          <img v-if="item.type === 'image'" class="cover-img" :src="item.url ? item.url : icon_img" width="150" :alt="item.filename"/>
                          <img v-if="item.type === 'other'" class="cover-img" :src="item.src" width="150" :alt="item.filename"/>
                          <img v-if="item.type === 'audio'" class="cover-img" src="../../../static/images/icon-mp3.png" width="150" :alt="item.filename"/>
                          <img v-if="item.type === 'video'" class="play-btn"  src="../../assets/yun-manage/play-btn.png" width="40" height="40" alt=""/>
                          <span v-if="item.type === 'video'" class="video-time">{{ item.duration }}</span>
                          <div class="mobile-uploaded-cover" v-if="item.type === 'video' && !item.covers" @click="uploadCover(item);">
                            <p class="fs-18"><i class="el-icon-plus"></i></p>
                            <p class="fs-16">上传封面</p>
                          </div>
                          <div class="mobile-change-cover" v-if="item.type === 'video' && item.covers">
                            <img class="cover-img" :src="item.covers[0].cover_url" width="150" height="100" :alt="item.filename"/>
                            <div class="mobile-update-cover" @click="uploadCover(item);">
                              <p>
                                <img src="../../assets/yun-manage/icon-update-cover.png" width="24" height="24" alt=""/>
                              </p>
                              <p class="fs-16">修改封面</p>
                            </div>
                          </div>
                        </div>
                        <div class="uploaded-img">
                          <img v-if="item.type === 'video'" class="cover-img" :src="item.screenshots&&item.storage===3? item.screenshots[0].screenshots_url: icon_video" width="150" height="100" :alt="item.filename"/>
                          <img v-if="item.type === 'image'" class="cover-img" :src="item.url&&item.storage===3 ? item.url : icon_img" width="150" :alt="item.filename"/>
                          <img v-if="item.type === 'other'" class="cover-img" :src="item.src&&item.storage===3 ?item.src: icon_zip" width="150" :alt="item.filename"/>
                          <img v-if="item.type === 'audio'" class="cover-img" src="../../../static/images/icon-mp3.png" width="150" :alt="item.filename"/>
                          <img v-if="item.type === 'video'" class="play-btn"  src="../../assets/yun-manage/play-btn.png" width="40" height="40" alt=""/>
                          <span v-if="item.type === 'video'" class="video-time">{{ item.duration }}</span>
                        </div>
                        <div class="uploaded-cover" v-if="item.type === 'video' && item.covers">
                          <img class="cover-img" :src="item.covers[0].cover_url" width="150" height="100" :alt="item.filename"/>
                          <div class="update-cover">
                            <p class="float-right update-cover-edit ml-10" @click="check_big_pic(item)">
                              <img src="../../assets/yun-manage/amplify.png" alt=""/>
                            </p>
                            <p class="float-right update-cover-edit" @click="uploadCover(item);">
                              <img src="../../assets/yun-manage/file_name_edit.png"  alt=""/>
                            </p>
                          </div>
                        </div>
                        <div v-if="item.type === 'video' && !item.covers" class="uploaded-cove" @click="uploadCover(item);">
                          <p><i class="el-icon-plus"></i></p>
                          <p class="fs-18">上传封面</p>
                        </div>
                        <div class="uploaded-info">
                          <div class="title " v-if="!item.edit">
                              <span class="text-overflow-1 el-input-filename">{{item.filename}}</span>
                              <i class="el-icon-edit-outline edit-filename" @click="edit_name(item.id,1)"></i>
                          </div>
                          <div class="title" v-if="item.edit">
                            <el-input v-model="item.filename"  class="edit_input_content" maxlength="50"></el-input>
                            <div class="el-input-opreate">
                              <span class="ml-10" @click="changeName(item,{file_name:item.filename})">完成</span>
                              <span class="ml-10" @click="edit_name(item.id,2)">取消</span>
                            </div>
                          </div>

                          <p class="clearfix time">
                            <span style="margin-right: 40px">{{item.create_at}}</span>
                            <span>{{ item.size }}</span>
                          </p>
                          <p class="upload-server" v-if="item.storage===1">
                            正在上传服务器...
                          </p>

                        </div>
                        <div class="uploaded-delete-btn" @click="handleClose(item);">
                          <span><i class="fa fa-trash-o" aria-hidden="true"></i></span>
                        </div>
                        <div v-if="item.storage!=3" class="uploaded-delete-btn" style="width: 40px; height: 40px"></div>
                        <div v-if="item.storage===3" class="uploaded-delete-btn" @click="downloadFile(item.download_url,item.filename)">
                          <span><i class="el-icon-download"></i></span>
                        </div>
                      </li>
                      <div v-if="filedList.length == 0" class="no-passage">
                        <p>
                          <img src="../../../static/images/shangchuan.png" width="62" height="47" alt=""/>
                        </p>
                        <p class="text-999 fs-14">暂无已上传的文件！</p>
                      </div>
                    </ul>
                    <div class="box-pagination" v-if="filedList.length > 0">
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
          </el-col>
        </el-row>
        <!-- el-main -->
        <!-- globalPopup -->
        <global-popup
          :file_type="file_type"
          :propData="propData"
          :title="title"
          :choiceStyle="choiceStyle"
          :video_id="video_id"
          :modal-show.sync="modalVisible"
          @click="choiceData"
        ></global-popup>
        <!-- globalPopup -->
        <!-- dialog -->
        <el-dialog
          class="comment_delete"
          title="删除文件"
          align="center"
          :visible.sync="dialogVisible"
        >
          <span class="fs-18">你确定要删除此文件吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false;" class="el-button--text">关闭</el-button>
            <el-button  @click="deleteFile({ file_id: file_id });" class="el-button--text">确 定</el-button
            >
          </span>
        </el-dialog>
        <!-- dialog -->
        <!--查看大图-->
        <div class="el-image-viewer__wrapper yunpanDetail" v-if="checkImg" style="z-index: 2000;">
          <div class="el-image-viewer__mask"></div>
          <span class="el-image-viewer__btn el-image-viewer__close" @click="checkImg=false">
           <i class="el-icon-circle-close"></i>
          </span>
          <div class="loading-div">
           <div class="el-image-viewer__canvas">
            <img :src="current_img_src" class="el-image-viewer__img" style="transform: scale(1) rotate(0deg); margin-left: 0px; margin-top: 0px; max-height: 100%; max-width: 100%;">
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalUploader from '../../components/globalUploader'
import globalPopup from '../../components/popup'
export default {
  name: 'yunManage',
  components: {
    'global-uploader': globalUploader,
    'global-popup': globalPopup
  },
  data () {
    return {
      icon_video: require('../../../static/images/icon-video.png'),
      icon_img: require('../../../static/images/icon-img.png'),
      icon_zip: require('../../../static/images/icon-zip.png'),
      active: 0,
      active1: false,
      active2: true,
      uploadingNumber: 0,
      arr: [
        { file_type: 0, name: '全部' },
        { file_type: 1, name: '图片' },
        { file_type: 2, name: '视频' },
        { file_type: 3, name: '音频' },
        { file_type: 4, name: '其他' }
      ],
      choiceStyle: 'Radio',
      video_id: 0,
      activeName: 'first',
      title: '云盘图片选择',
      file_type: 1,
      propData: [],
      imgData: [],
      checkImg: false,
      current_img_src: '',
      comparisonfiledList: [],
      filedList: [],
      modalVisible: false,
      dialogVisible: false,
      resinfo: {
        file_type: 0
      },
      file_id: '',
      // 页码
      total: 0,
      size: 10,
      currentPage: 1
    }
  },
  inject: ['reload'],
  computed: {},
  created () {
    if (this.$route.query.type) {
      if (this.$route.query.type === 'uploading') {
        this.active1 = true
        this.active2 = false
      } else if (this.$route.query.type === 'uploaded') {
        this.active1 = false
        this.active2 = true
      }
    }
  },
  mounted () {
    this.getFileList({file_type: this.resinfo.file_type, type: 1})
  },
  methods: {
    check_big_pic (item) {
      this.checkImg = true
      this.current_img_src = item.covers[0].cover_url
    },
    changeFile (index, item) {
      this.active = index
      this.activeName = 'second'
      this.resinfo.file_type = item.file_type
      this.getFileList({file_type: item.file_type, type: 1})
    },
    changeFileStatus1 () {
      this.$router.push({path: '/yunManage', query: {type: 'uploading'}})
      this.active1 = true
      this.active2 = false
    },
    changeFileStatus2 () {
      this.$router.push({path: '/yunManage', query: {type: 'uploaded'}})
      this.active1 = false
      this.active2 = true
    },
    uploading (playLoad) {
      this.uploadingNumber = playLoad
    },
    getFileList (params) {
      this.http.getMyFileList(params).then(res => {
        if (res.status === 0) {
          this.total = res.data.total_number
          if (res.data.file_info && res.data.file_info.length > 0) {
            res.data.file_info.forEach(item => {
              item.create_at = this.getTime(item.create_at)
              item.size = this.transformByte(item.size)
              item.duration = this.formatSeconds(item.duration)
              item.edit = false
              if (item.type === 'other') {
                var index = item.filename.lastIndexOf('.')
                var suffix = item.filename.substr(index)
                item.src = (suffix === '.doc' || suffix === '.docx') ? require('../../../static/images/icon-word.png') : (suffix === '.xls' || suffix === '.xlsx') ? require('../../../static/images/icon-excel.png') : (suffix === '.ppt' || suffix === '.pptx') ? require('../../../static/images/icon-ppt.png') : (suffix === '.rar' || suffix === '.zip' || suffix === '.arj') ? require('../../../static/images/icon-zip.png') : require('../../../static/images/icon-exe.png')
              }
            })
            this.filedList = res.data.file_info
            this.comparisonfiledList = res.data.file_info.map(c => Object.assign({}, c))
          } else {
            this.filedList = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    edit_name (id, type) {
      for (let i = 0; i < this.filedList.length; i++) {
        if (this.filedList[i].id === id) {
          this.filedList[i].edit = !this.filedList[i].edit
          if (type === 2) {
            for (let j = 0; j < this.comparisonfiledList.length; j++) {
              if (this.comparisonfiledList[j].id === id) {
                this.filedList[i].filename = this.comparisonfiledList[j].filename
                break
              }
            }
          }
          break
        }
      }
    },
    choiceData (playload) {
      this.imgData = playload
    },
    uploadVideoCover (params) {
      this.http.uploadCover(params).then(res => {
        if (res.status === 0) {
          this.getFileList({file_type: this.resinfo.file_type, type: 1})
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    uploadCover (item) {
      this.modalVisible = true
      this.video_id = item.id
      this.http.getMyFileList({ file_type: 1 }).then(res => {
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
    handleClose (item) {
      this.dialogVisible = true
      this.file_id = item.id
    },
    deleteFile (fileId) {
      this.dialogVisible = false
      this.http.deleteMyFileList(fileId).then(res => {
        if (res.status === 0) {
          this.getFileList({file_type: this.resinfo.file_type, type: 1})
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    handleClick (tab, event) {
    },
    downloadFile (url, fileName, obj) {
      window.open(url)
      // this.http.filestream(url, obj).then(res => {
      //   if (!res) {
      //     return
      //   }
      //   let blobUrl = window.URL.createObjectURL(res)
      //   let link = document.createElement('a')
      //   document.body.appendChild(link)
      //   link.style.display = 'none'
      //   link.href = blobUrl
      //   link.download = fileName
      //   link.click()
      //   document.body.removeChild(link)
      //   window.URL.revokeObjectURL(blobUrl)
      // })
    },
    changeName (item, params) {
      this.http.changeFileName(item.id, params).then(res => {
        if (res.status === 0) {
          this.$toast('修改成功', 2000, 'common')
          item.edit = !item.edit
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    // 页码
    handleSizeChange (val) {
      this.size = val
      this.currentPage = 1
      this.getFileList({size: val, file_type: this.resinfo.file_type, type: 1})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getFileList({
        size: this.size,
        start: (val - 1) * this.size,
        file_type: this.resinfo.file_type,
        type: 1
      })
    }
  }
}
</script>

<style scoped>
  .app-wrapper{
    overflow: auto;
  }
  .welcome-view {
    width: 100%;
  }
  .tab-box{
    background: #ffffff;
    padding-top: 15px;
    display: none;
  }
  .tab-box ul li{
    float: left;
    height: 26px;
    line-height: 26px;
    padding: 0 13px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
  }
  .tab-box ul li.active,
  .tab-box ul li:hover {
    color: #598cf2;
  }
  .left-tab-box {
    background: #ffffff;
    padding: 24px;
  }
  .left-tab-box ul li {
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    text-align: center;
    font-size: 18px;
    margin-bottom: 15px;
    cursor: pointer;
  }
  .left-tab-box ul {
    min-height: 530px;
    position: relative;
  }
  .left-tab-box ul li.active,
  .left-tab-box ul li:hover {
    background: #dee8fc;
    color: #598cf2;
  }
  .left-tab-box .el-button {
    z-index: 1;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: linear-gradient(135deg, #36b6f9, #598cf2);
    border: none 0;
    border-color: transparent;
    font-size: 18px;
    padding: 20px 20px;
  }
  .upload-tab {
    background: #ffffff;
    padding: 20px 0;
    position: relative;
  }
  .upload-tab .tab-nav-ul {
    background: #ffffff;
    padding: 0 20px;
    position: relative;
    border-bottom: 2px solid #e4e7ed;
  }
  .upload-tab .tab-nav-li {
    float: left;
    margin-right: 40px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    font-size: 16px;
    color: #9fadc2;
    position: relative;
  }
  .upload-tab .tab-nav-li:before {
    content: "";
    width: 100%;
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 2px;
    background-color: #598cf2;
    z-index: 1;
    -webkit-transition: -webkit-transform 0.3s
    cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    display: none;
  }
  .upload-tab .tab-nav-li.active {
    color: #598cf2;
  }
  .upload-tab .tab-nav-li.active:before {
    display: block;
  }
  .upload-tab .tab-nav-li span {
    cursor: pointer;
  }
  .upload-box {
    position: relative;
    background-color: #ffffff;
    padding-bottom: 10px;
  }
  .uploaded-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 600px;
    background: #ffffff;
    z-index: 10;
  }
  .uploaded-box ul li {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #e5e5e5;
  }
  .uploaded-box .uploaded-img,
  .uploaded-box .uploaded-cover {
    min-width: 150px;
    width: 150px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 15px;
    position: relative;
    background: #f1f3f7;
  }
  .upload-server{
    color: #FF0000;
    font-size: 14px;
  }
  .uploaded-box .mobile-uploaded-img{
    display: none;
    min-width: 150px;
    width: 150px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 15px;
    position: relative;
    background: #f1f3f7;
  }
  .uploaded-box .mobile-uploaded-img .cover-img {
    min-width: 100%;
    min-height: 100%;
    cursor: pointer;
  }
  .uploaded-box .mobile-uploaded-cover{
    background: rgba(0,0,0,0.5);
    text-align: center;
    color: #ffffff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 20px 20px;
    z-index: 1;
  }
  .mobile-change-cover{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .mobile-update-cover{
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
    line-height: 20px;
    padding: 20px 0;
    color: #ffffff;
    cursor: pointer;
  }
  .uploaded-box .uploaded-cove {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    min-width: 148px;
    width: 148px;
    height: 98px;
    cursor: pointer;
    line-height: 20px;
    vertical-align: top;
    margin-right: 15px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: none;
    padding: 20px;
    color: #a6b3c6;
  }
  .uploaded-box .uploaded-cove i {
    font-size: 28px;
    color: #a6b3c6;
  }
  .uploaded-box .uploaded-img .play-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -20px;
    margin-top: -20px;
  }
  .video-time {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px 4px;
    background: rgba(0, 0, 0, 0.5);
    color: #f7f7f7;
  }
  .uploaded-box .uploaded-img .cover-img {
    min-width: 100%;
    min-height: 100%;
    -webkit-transform: scale(1) translateZ(0);
    -webkit-transition: -webkit-transform 0.75s;
    transform: scale(1) translateZ(0);
    transition: -webkit-transform 0.75s;
    transition: transform 0.75s;
    transition: transform 0.75s, -webkit-transform 0.75s;
    cursor: pointer;
  }
  .uploaded-box .uploaded-img:hover .cover-img {
    webkit-transform: scale(1.2) translateZ(0);
    -webkit-transition: -webkit-transform 0.75s cubic-bezier(0, 1, 0.75, 1);
    transform: scale(1.2) translateZ(0);
    transition: -webkit-transform 0.75s cubic-bezier(0, 1, 0.75, 1);
    transition: transform 0.75s cubic-bezier(0, 1, 0.75, 1);
    transition: transform 0.75s cubic-bezier(0, 1, 0.75, 1),
    -webkit-transform 0.75s cubic-bezier(0, 1, 0.75, 1);
  }
  .uploaded-box .uploaded-info {
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
  .uploaded-box .uploaded-info .title {
    font-size: 18px;
  }
  .uploaded-box .uploaded-info .time {
    color: #9fadc2;
  }
  .uploaded-box .uploaded-delete-btn {
    margin-left: 15px;
  }
  .uploaded-box .uploaded-delete-btn span {
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
  .uploaded-box .uploaded-delete-btn span:hover {
    background: #409eff;
    color: #ffffff;
  }
  .uploaded-box .uploaded-delete-btn span i {
    margin-right: 0;
  }
  .update-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.45);
    line-height: 20px;
    padding:10px;
    color: #ffffff;
    cursor: pointer;
    transition: transform 0.4s;
    transition: transform 0.4s;
    transition: -webkit-transform 0.4s;
    transform: translateX(200px);
    -webkit-transform: translateX(200px);
    -moz-transform: translateX(200px);
  }
  .uploaded-box .uploaded-cover:hover .update-cover {
    transform: translateX(0px);
    -webkit-transform: translateX(0px);
    -moz-transform: translateX(0px);
  }

  .update-cover-edit{
    width:30px;
    height:30px;
    line-height: 28px;
    border-radius:4px;
    background-color: rgba(0,0,0,0.5);
  }
  .file-icon-img {
    line-height: 100px;
    text-align: center;
  }
  .el-input-filename{
    display: inline-block;
    max-width:80%;
  }
  .edit-filename{
    display: inline-block;
    vertical-align: super;
    margin-left: 20px;
    color: #9FADC2;
  }
  .edit-filename:hover{
    color: #409EFF;
    cursor: pointer;
  }
  .no-passage {
    min-height: 600px;
    text-align: center;
    margin-top: 0;
    padding: 200px 0;
  }
  .yunpanDetail  .el-image-viewer__close {
    color: #fff;
    top: 80px;
  }
  @media only screen and (max-width: 1200px) {
  }
  @media only screen and (max-width: 768px) {
    .tab-box{
      display: block;
    }
    .left-tab-box{
      display: none;
    }
    .upload-tab{
      padding: 15px 0;
    }
    .uploaded-box ul li{
      padding: 10px 15px;
    }
    .uploaded-box .mobile-uploaded-img{
      display: block;
    }
    .uploaded-box .uploaded-cove,.uploaded-box .uploaded-cover,.uploaded-box .uploaded-img{
      display: none;
    }
  }
</style>
<style>
.left-tab-box .el-upload {
  width: 100%;
}
.right-upload-box .el-tabs__item {
  font-size: 16px;
  color: #9fadc2;
}
.edit_input_content{
  max-width:300px;
}
.edit_input_content .el-input__inner{
  font-size: 18px;
  height:36px;
  line-height: 36px;
  background-color: rgba(247,247,247,1);
}
.edit_input_content{
  display: inline-block;
}
.el-input-opreate{
  display: inline-block;
}
.el-input-opreate span{
  font-size: 14px;
  color: #409EFF;
  cursor: pointer;
}
.right-upload-box .upload-tab .el-tabs__content {
  overflow: inherit;
}
.right-upload-box .el-tabs__item.is-active {
  color: #598cf2;
}
.right-upload-box .el-tabs__active-bar {
  background: #598cf2;
}
.right-upload-box .el-tabs__nav-scroll {
  padding: 0 20px;
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
</style>
