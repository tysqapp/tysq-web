
<template>
    <div class="app-code">
      <div class="title text-center"><span class="caption"><span class="line line-l"></span>扫码下载APP<span class="line line-r"></span></span></div>
      <div class="QR-code">
        <vue-qr   :text="download_url" :size="160" :margin="0"  class="erPic"></vue-qr>
      </div>
    </div>
</template>

<script>
import VueQr from 'vue-qr'
export default {
  data: function () {
    return {
      download_url: ''
    }
  },
  components: {
    VueQr
  },
  methods: {

  },
  mounted () {
  },
  created: function () {
    if (window.GlodConfig.download_src.indexOf('/api') === 0) {
      this.download_url = window.location.protocol + '//' + window.location.host + window.GlodConfig.download_src
    } else {
      this.download_url = window.GlodConfig.download_src
    }
  }
}
</script>

<style scoped>
  .app-code{
    width: 100%;
    background: #ffffff;
    padding: 20px 25px;
    margin-bottom: 15px;
    border-radius: 5px;
  }
  .title{
    width: 100%;
    margin: 0 auto;
    font-size: 16px;
    position: relative;
    line-height: 24px;
    text-align: center;
    overflow: hidden;
    margin-bottom: 12px;
  }
  .title .caption {
    position: relative;
    display: inline-block;
  }
  .title .caption .line {
    position: absolute;
    top: 11px;
    width: 50%;
    height: 1px;
    background-color: #999999;
  }
  .title .caption .line-l{
    right: 100%;
    margin-right: 15px;
  }
  .title .caption .line-r {
    left: 100%;
    margin-left: 15px;
  }
  .QR-code{
    width: 180px;
    height: 180px;
    border: 1px solid #e5e5e5;
    padding: 10px;
    margin: 0 auto;
  }
  .QR-code img{
    width: 100%;
    height: 100%;
  }
  @media only screen and (max-width: 768px) {
  }
</style>
