<template>
    <!--el-main-->
    <div class="right-edit-box">
      <div class="user-info-head clearfix">
        <el-row :gutter="0">
          <el-col :span="24"><router-link to="/userInfo" class="float-right text-999">返回我的主页 <i class="el-icon-arrow-right"></i></router-link></el-col>
        </el-row>
        <div class="avatar-uploader pull-left">
          <div class="upload">
            <img :src="imageUrl?imageUrl:useradimg" class="avatar">
            <div class="cover-box" @click="uploadCover()">
              <i class="el-icon-edit-outline"></i>
              <p>修改头像</p>
            </div>
          </div>
        </div>
        <div class="set-info-other pull-left clearfix">
          <el-form :model="formLabelAlign">
            <el-form-item class="pull-left">
              <el-input v-model="formLabelAlign.account" :maxlength="10" :readonly="oreator.readonly" ref="account" :class="[oreator.readonly?'':'inputBackround']" @keyup.enter.native="save"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="pull-right edit-info-btn" v-if="oreator.readonly">
          <el-button type="primary" plain @click="editThis">编辑</el-button>
        </div>
        <div class="pull-right edit-info-btn" v-if="!oreator.readonly">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
      <div class="set-info">
        <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
            <el-form-item label="居住地">
              <el-input v-model="formLabelAlign.home_address" :maxlength="10" :readonly="oreator.readonly" ref="home_address" :class="[oreator.readonly?'':'inputBackround']" placeholder="添加居住地" @keyup.enter.native="save"></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-input v-model="formLabelAlign.career" :maxlength="10" :readonly="oreator.readonly" ref="career" :class="[oreator.readonly?'':'inputBackround']" placeholder="输入职位" @keyup.enter.native="save"></el-input>
            </el-form-item>
            <el-form-item label="行业">
              <el-input v-model="formLabelAlign.trade" :maxlength="10" :readonly="oreator.readonly" ref="trade" :class="[oreator.readonly?'':'inputBackround']" placeholder="输入行业" @keyup.enter.native="save"></el-input>
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input type="textarea" v-model="formLabelAlign.personal_profile" :maxlength="50" :readonly="oreator.readonly" ref="personal_profile" :class="[oreator.readonly?'':'inputBackround']" placeholder="输入个人简介" @keyup.enter.native="save"></el-input>
            </el-form-item>
        </el-form>
      </div>
      <!--globalPopup-->
      <global-popup :file_type='file_type' :propData="propData" :title="title"  :choiceStyle="choiceStyle"  :video_id="video_id" :file_style="file_style" :modal-show.sync="modalVisible"  @click="choiceData"></global-popup>
      <!--globalPopup-->
    </div>
    <!--el-main-->
</template>

<script>
import globalPopup from '../../components/popup'
export default {
  name: 'editInfo',
  components: {
    'global-popup': globalPopup
  },
  data () {
    return {
      labelPosition: 'left',
      imageUrl: '',
      useradimg: require('../../../static/images/toux.png'),
      choiceStyle: 'Radio',
      video_id: 0,
      file_style: 'user',
      title: '云盘图片选择',
      file_type: 1,
      propData: [],
      imgData: [],
      filedList: [],
      modalVisible: false,
      oreator: {readonly: true},
      formLabelAlign: {}
    }
  },
  inject: ['reload'],
  computed: {
  },
  mounted () {
    this.userInfo()
  },
  methods: {
    userInfo () {
      this.http
        .userInfo().then(res => {
          if (res.status === 0) {
            this.imageUrl = res.data.account_info.head_url
            this.formLabelAlign = res.data.account_info
            if (this.Cookies.get('info')) {
              if (res.data.account_info.account !== JSON.parse(this.Cookies.get('info')).account || res.data.account_info.head_url !== JSON.parse(this.Cookies.get('info')).head_url) {
                let info = JSON.parse(this.Cookies.get('info'))
                info.account = res.data.account_info.account
                info.head_url = res.data.account_info.head_url
                this.imageUrl = res.data.account_info.head_url
                this.Cookies.set('info', JSON.stringify(info))
                this.reload()
              }
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    choiceData (playload) {
      this.imgData = playload
    },
    uploadCover () {
      this.modalVisible = true
      this.http
        .getMyFileList({file_type: 1})
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
    uploadUserCover (params) {
      if (this.formLabelAlign.account) {
        this.formLabelAlign.icon_id = params.icon_id
        this.changeData(this.formLabelAlign)
        this.oreator.readonly = true
      } else {
        this.$toast('昵称不能为空哦', 2000, 'error')
      }
    },
    changeData (params) {
      this.http
        .changeUserInfo(params)
        .then(res => {
          if (res.status === 0) {
            this.$toast('修改成功', 2000, 'common')
            if (this.Cookies.get('info')) {
              let info = JSON.parse(this.Cookies.get('info'))
              info.account = res.data.account_info.account
              this.Cookies.set('info', JSON.stringify(info))
              info.head_url = res.data.account_info.head_url
              this.imageUrl = res.data.account_info.head_url
              this.$store.commit('flagUserHeadUrl', res.data.account_info.head_url)
              this.$store.commit('flagUserName', res.data.account_info.account)
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            this.oreator.readonly = false
          }
        })
    },
    cancel () {
      this.oreator.readonly = true
      this.reload()
    },
    save () {
      this.formLabelAlign.account = this.formLabelAlign.account.replace(/\s+/g, '')
      this.formLabelAlign.home_address = this.formLabelAlign.home_address.replace(/\s+/g, '')
      this.formLabelAlign.career = this.formLabelAlign.career.replace(/\s+/g, '')
      this.formLabelAlign.trade = this.formLabelAlign.trade.replace(/\s+/g, '')
      this.formLabelAlign.personal_profile = this.formLabelAlign.personal_profile.replace(/\s+/g, '')
      if (this.formLabelAlign.account) {
        this.changeData(this.formLabelAlign)
        this.oreator.readonly = true
      } else {
        this.$toast('昵称不能为空哦', 2000, 'error')
      }
    },
    editThis () {
      this.oreator.readonly = false
    }
  }
}
</script>

<style scoped>
  .right-edit-box{
    padding: 40px 100px;
    background: #ffffff;
    min-height: 500px;
  }
  .user-info-head{
    min-height: 100px;
    background: #ffffff;
    position: relative;
    margin-bottom: 50px;
  }
  .user-info-head .avatar-uploader{
    border-radius: 5px;
    overflow: hidden;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    -webkit-transition-property: color;
    transition-property: color;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
  }
  .user-info-head .avatar-uploader .upload {
    width: 122px;
    height: 122px;
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
  .user-info-head .avatar {
    width: 110px;
    height: 110px;
    display: block;
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
    width: 100px;
    height: 100px;
    left: 10px;
    top: 10px;
    background: rgba(0,0,0,0.4);
    color: #ffffff;
    font-size: 16px;
    padding: 15px 0;
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
  .set-info-other{
    margin-top: 40px;
    padding-left: 20px;
  }
  .edit-info-btn{
    margin-top: 40px;
  }
  .set-info{
    margin: 0 auto;
    padding: 20px 0;
  }
  .set-info .el-form-item{
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 22px;
  }
  @media only screen and (max-width: 768px){
    .user-info-head{
      margin-bottom: 20px;
    }
    .user-info-head .avatar-uploader .upload{
      width: 100px;
      height: 100px;
    }
    .user-info-head .avatar{
      width: 90px;
      height: 90px;
    }
    .set-info-other{
      padding-left: 0;
      width: 40%;
      overflow: hidden;
    }
    .right-edit-box{
      padding: 20px 20px;
    }
  }
</style>
<style>
  .set-info-other .el-input__inner{
    border-color: transparent;
    background: #ffffff;
    font-size: 22px;
    color: #333333;
    width: auto;
  }
  .set-info-other .el-form-item{
    margin-bottom: 0px;
  }
  .set-info .el-input__inner{
    border-color: transparent;
  }
  .set-info .el-textarea__inner{
    border-color: transparent;
    outline: none 0;
    resize: none;
  }
  .inputBackround .el-input__inner{
    border-color: #eeeeee;
    background: #f7f7f7;
  }
  .inputBackround .el-textarea__inner{
    border-color: #eeeeee;
    background: #f7f7f7;
  }
</style>
