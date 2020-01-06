
<template>
  <el-dialog class="download-dialog" title="" align="center" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="downloadVisible" @close="hide_diglog">
    <div class="download-box">
      <div class="download-noice">
        <img src="../assets/icon/success.png" width="60" height="60" alt="">
        <h3>温馨提示</h3>
      </div>
      <p class="text-000 mb-15 text-left fs-18">下载视频需要扣 <span class="text-pink">{{score}}</span>积分,确定要下载吗?</p>
      <p class="text-000 mb-15 text-left fs-16"> <el-checkbox v-model="checked" @change="setCookieData">7天内不在提示</el-checkbox></p>
      <p class="download-btn">
        <el-button type="primary download_save" @click="checkSubmit()">确定</el-button>
      </p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'downloadVideo',
  props: {
    modalDownloadShow: Boolean,
    score: Number,
    videoId: String
  },
  data () {
    return {
      downloadVisible: false,
      checked: false
    }
  },
  methods: {
    hide_diglog () {
      this.$emit('update:modalDownloadShow', false)
    },
    setCookieData () {
      if (this.checked) {
        this.Cookies.set('downloadVideoTips', true, {expires: 7})
      } else {
        if (this.Cookies.get('downloadVideoTips')) {
          this.Cookies.set('downloadVideoTips', '', -1)
        }
      }
    },
    video_download_judgement (id, params) {
      this.$emit('update:modalDownloadShow', false)
      this.http.videoJudement(id, params).then(res => {
        if (res.status === 0) {
          if (res.data.is_satisfy) {
            this.downloadVideoStream(res.data.video_url)
          } else {
            this.$parent.text_tips = ` 下载该视频需扣<span class="text-pink">${res.data.limit_score}积分</span>，您的积分不足，请先获取积分再下载`
            this.$parent.modalShow = true
            this.$parent.needBack = false
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
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        return 'Android'
      } else if (u.indexOf('iPhone') > -1) {
        return 'iPhone'
      } else if (u.indexOf('Windows Phone') > -1) {
        return 'windows'
      } else if (/macintosh|mac os x/i.test(u)) {
        return 'isMac'
      }
    },
    checkSubmit () {
      this.video_download_judgement(this.videoId, {article_id: this.$route.query.article_id})
    }
  },
  watch: {
    modalDownloadShow (val) {
      if (val) {
        this.downloadVisible = val
      } else {
        this.downloadVisible = false
      }
    }
  },
  created () {

  }
}
</script>
<style scoped>
  .download-dialog .download-box{
    width: 332px;
    margin: 0 auto;
  }
  .download-dialog .download-noice h3{
    font-size: 28px;
    color: #000000;
    margin-bottom: 25px;
  }
  .download-btn .el-button{
    width: 240px;
    height: 60px;
    line-height: 36px;
    font-size: 18px;
    text-align: center;
  }
  @media only screen and (max-width: 768px) {
    .download-dialog .download-box{
      width: 282px;
    }
  }
  @media only screen and (max-width: 320px) {
    .download-dialog .download-box{
      width: 200px;
    }
    .download-btn .el-button{
      width: 200px;
    }
  }
</style>
<style>
  .download-dialog .el-dialog{
    max-width: 600px;
    border-radius: 4px;
  }
  .download-dialog .el-dialog__body{
    padding: 20px 20px;
  }
</style>
