<template>
  <el-dialog
    class="dialog-box"
    :title="title"
    :visible.sync="modalFlag" :show-close="false" :close-on-click-modal="false">
    <div class="search-box">
      <el-form :model="formaParams">
        <el-row :gutter="10">
          <el-col :xs="16" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item>
              <el-input v-model="formaParams.filename" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item>
              <el-button type="primary" @click="search()">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="cover-list-box"  v-if="file_type===1">
      <ul class="clearfix" v-if="choiceStyle==='Multiple'">
        <li :class="{'active':choiceData.indexOf(item)!=-1}" v-for="(item,index) in imgData" :key="index" @click="choiceImg(index,item)">
          <div class="img-item multiple-image">
            <label><i class="el-icon-upload-success el-icon-check"></i></label>
            <el-image
              :src="item.url"
              fit="contain"
              lazy>
            </el-image>
          </div>
          <p class="text-overflow-1">{{item.filename}}</p>
        </li>
      </ul>
      <ul class="clearfix" v-if="choiceStyle==='Radio'">
        <li :class="{'active':radioIndex===index}" v-for="(item,index) in imgData" :key="index" @click="choiceRadio(index,item)">
          <div class="img-item radio-image">
            <label><i class="el-icon-upload-success el-icon-check"></i></label>
            <el-image
              :src="item.url"
              fit="contain"
              lazy>
            </el-image>
          </div>
          <p class="text-overflow-1">{{item.filename}}</p>
        </li>
      </ul>
      <div class="no-thing text-center pt-15 pb-15" v-if="imgData.length===0">
        <p><img src="../assets/yun-manage/no-thing.png" width="66" height="43" alt=""></p>
        <p>亲，您的云盘没有图片哦。</p>
      </div>
    </div>
    <div class="cover-list-box"  v-if="file_type===2">
      <ul class="clearfix" v-if="choiceStyle==='Multiple'">
        <li  :class="{'active':choiceData.indexOf(item)!=-1}" v-for="(item,index) in videoData" :key="index" @click="choiceImg(index,item)">
          <div class="img-item video-img">
            <i class="cover-mask"><img src="../assets/yun-manage/play-video-btn.png" width="23" height="28" alt=""></i>
            <label><i class="el-icon-upload-success el-icon-check"></i></label>
            <el-image
              :src="item.covers?item.covers[0].cover_url:item.screenshots?item.screenshots[0].screenshots_url:''"
              fit="contain"
              lazy>
            </el-image>
          </div>
          <p class="text-overflow-1">{{item.filename}}</p>
        </li>
      </ul>
      <ul class="clearfix" v-if="choiceStyle==='Radio'">
        <li  :class="{'active':radioIndex===index}" v-for="(item,index) in videoData" :key="index" @click="choiceRadio(index,item)">
          <div class="img-item video-img">
            <i class="cover-mask"><img src="../assets/yun-manage/play-video-btn.png" width="23" height="28" alt=""></i>
            <label><i class="el-icon-upload-success el-icon-check"></i></label>
            <el-image
              :src="item.covers?item.covers[0].cover_url:item.screenshots?item.screenshots[0].screenshots_url:''"
              fit="contain"
              lazy>
            </el-image>
          </div>
          <p class="text-overflow-1">{{item.filename}}</p>
        </li>
      </ul>
      <div class="no-thing text-center pt-15 pb-15" v-if="videoData.length===0">
        <p><img src="../assets/yun-manage/no-thing.png" width="66" height="43" alt=""></p>
        <p>亲，您的云盘没有视频文件哦。</p>
      </div>
    </div>
    <div class="cover-list-box" v-if="file_type===3">
      <ul class="clearfix" v-if="choiceStyle==='Multiple'">
        <li :class="{'active':choiceData.indexOf(item)!=-1}" v-for="(item,index) in audiosData" :key="index" @click="choiceImg(index,item)">
          <div class="img-item">
            <img class="cover-img" src="../assets/yun-manage/icon-audio-cover.png" alt="">
            <label><i class="el-icon-upload-success el-icon-check"></i></label>
          </div>
          <p class="text-overflow-1">{{item.filename}}</p>
        </li>
      </ul>
      <ul class="clearfix" v-if="choiceStyle==='Radio'">
        <li :class="{'active':radioIndex===index}" v-for="(item,index) in audiosData" :key="index" @click="choiceRadio(index,item)">
          <div class="img-item">
            <img class="cover-img" src="../assets/yun-manage/icon-audio-cover.png" alt="">
            <label><i class="el-icon-upload-success el-icon-check"></i></label>
          </div>
          <p class="text-overflow-1">{{item.filename}}</p>
        </li>
      </ul>
      <div class="no-thing text-center pt-15 pb-15" v-if="audiosData.length===0">
        <p><img src="../assets/yun-manage/no-thing.png" width="66" height="43" alt=""></p>
        <p>亲，您的云盘没有音频文件哦。</p>
      </div>
    </div>
    <div class="box-pagination" v-if="data.length>0">
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
    <div class="box-pagination-phone" v-if="data.length>0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="size"
        :total="total"
        layout=" prev, pager, next"
      >
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancal">取 消</el-button>
    <el-button type="primary" @click="go">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    propData: {
      type: Array,
      required: true
    },
    choiceStyle: String,
    video_id: Number,
    file_style: String,
    file_type: Number,
    title: String,
    modalShow: Boolean
  },
  name: 'popup',
  data () {
    return {
      form: {},
      formaParams: {},
      modalFlag: false,
      radioIndex: -1,
      choiceData: [],
      data: [],
      imgData: [],
      videoData: [],
      audiosData: [],
      total: 0,
      size: 10,
      currentPage: 1
    }
  },
  computed: {},
  watch: {
    propData (val) {
      if (val) {
        if (this.file_type === 1) {
          this.imgData = val
        } else if (this.file_type === 2) {
          this.videoData = val
        } else {
          this.audiosData = val
        }
        this.data = val
        if (this.data.length > 0) {
          this.total = val[0].total
        }
      } else {
        if (this.file_type === 1) {
          this.imgData = []
        } else if (this.file_type === 2) {
          this.videoData = []
        } else {
          this.audiosData = []
        }
        this.data = []
        this.total = 0
      }
    },
    modalShow (val) {
      if (val) {
        this.modalFlag = val
      } else {
        this.modalFlag = false
      }
    }
  },
  created () {

  },
  methods: {
    getData (params) {
      params.file_type = this.file_type
      this.http.getMyFileList(params).then(res => {
        this.total = res.data.total_number
        if (res.status === 0) {
          if (res.data.file_info) {
            if (this.file_type === 1) {
              this.imgData = res.data.file_info
            } else if (this.file_type === 2) {
              this.videoData = res.data.file_info
            } else {
              this.audiosData = res.data.file_info
            }
            this.data = res.data.file_info
          } else {
            if (this.file_type === 1) {
              this.imgData = []
            } else if (this.file_type === 2) {
              this.videoData = []
            } else {
              this.audiosData = []
            }
            this.data = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    search () {
      this.currentPage = 1
      this.formaParams.start = 0
      this.getData(this.formaParams)
    },
    choiceImg (n, item) {
      if (this.choiceData.indexOf(item) !== -1) {
        this.choiceData.splice(this.choiceData.indexOf(item), 1)
      } else {
        this.choiceData.push(item)
      }
    },
    choiceRadio (index, item) {
      this.radioIndex = index
      this.choiceData = [item]
    },
    cancal () {
      this.formaParams.filename = ''
      this.$emit('update:modalShow', false)
      this.currentPage = 1
      this.size = 10
      this.choiceData = []
      this.radioIndex = -1
    },
    go () {
      if (this.choiceStyle === 'Radio') {
        if (this.file_style === 'user') {
          this.$parent.uploadUserCover({icon_id: this.choiceData[0].id})
        } else {
          this.$parent.uploadVideoCover({video_id: this.video_id, cover_id: this.choiceData[0].id})
        }
      }
      this.currentPage = 1
      this.size = 10
      this.$emit('update:modalShow', false)
      this.$emit('click', this.choiceData)
      this.choiceData = []
      this.radioIndex = -1
    },
    handleSizeChange (val) {
      this.size = val
      this.currentPage = 1
      this.formaParams.size = val
      this.getData({size: this.size, filename: this.formaParams.filename})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.formaParams.start = (Number(val) - 1) * this.size
      this.getData({size: this.size, start: this.formaParams.start, filename: this.formaParams.filename})
    }
  }
}
</script>

<style scoped>
  .dialog-box .search-box{
    border-bottom: 1px solid #e5e5e5;
  }
  .dialog-box .cover-list-box{
    padding: 20px 0;
    border-bottom: 1px solid #e5e5e5;
  }
  .cover-list-box ul li{
    width: 120px;
    float: left;
    margin: 10px 10px;
    cursor: pointer;
  }
  .img-item{
    width: 120px;
    height: 120px;
    position: relative;
    text-align: center;
    border-radius: 4px;
    border: 2px solid #aaaaaa;
    overflow: hidden;
  }
  .active .img-item label{
    position: absolute;
    right: -20px;
    top: -7px;
    width: 46px;
    height: 26px;
    background: #f6b326;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 1px 1px #ccc;
    z-index: 99;
  }
  .img-item label i{
    display: none;
  }
  .active .img-item label i{
    display: inline-block;
    color: #ffffff;
    font-size: 12px;
    margin-top: 12px;
    transform: rotate(-45deg);
  }
  .active .img-item{
    border-color: #f6b326;
  }
  .img-item .cover-img{
    min-height: 100%;
    min-width: 100%;
  }
  .img-item .cover-mask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
    filter: alpha(opacity=50);
    -webkit-transition: opacity .5s;
    transition: opacity .5s;
    z-index: 98;
  }
  .img-item .cover-mask img{
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -14px;
    margin-left: -12px;
  }
  .img-item .video-time{
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px 4px;
    background: rgba(0, 0, 0, 0.5);
    color: #f7f7f7;
    border-radius: 2px;
  }
  .dialog-box .box-pagination-phone{
    display: none;
  }
  @media only screen and (max-width: 768px) {
    .cover-list-box ul{
      padding-left: 20px;
      max-height:300px;
      overflow: auto;
    }
    .cover-list-box ul li{
      width: 80px;
      margin: 10px 5px;
    }
    .img-item{
      width: 80px;
      height: 80px;
    }
    .dialog-box .box-pagination{
      display: none;
    }
    .dialog-box .box-pagination-phone{
      display: block;
      margin: 15px 0px;
    }
    .img-item .cover-img{
      width: 100%;
    }
  }
  @media only  screen and (max-width: 320px){
    .cover-list-box ul{
      padding-left: 10px;
    }
  }
</style>
<style>
  .dialog-box .el-dialog__body{
     padding: 25px 20px 11px 20px;
  }
  .dialog-box .el-dialog__header{
    background: #598cf2;
    padding: 15px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .dialog-box .el-dialog{
    border-radius: 8px;
  }
  .dialog-box .el-dialog__title{
    color: #ffffff;
  }
  .dialog-box .el-dialog__headerbtn .el-dialog__close{
    color: #ffffff;
  }
  .dialog-box .el-dialog{
    max-width: 800px;
  }
  .radio-image .el-image,.multiple-image .el-image ,.video-img .el-image{
    width: 100%;
    height: 100%;
  }
  @media only screen and (max-width: 768px) {
    .dialog-box .el-dialog__body{
      padding: 25px 10px 0px 10px;
    }
    .dialog-box .el-dialog{
      width: 90%;
    }
  }
  @media only  screen and (max-width: 320px){
    .dialog-box .el-dialog{
      width: 95%;
    }
  }
</style>
