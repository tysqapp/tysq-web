<template>
  <div>
    <el-dialog
      class="dialogJ_F"
      title=""
      align="center"
      :visible.sync="dialogJ_F"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
       @close="goBack">
      <div class="noice-box">
        <div class="noice">
          <img src="../assets/invitaton/warning.png" width="65" height="58" alt="">
          <h3>积分不足</h3>
        </div>
        <p class="text-000 mb-25 text-left fs-18" v-html="scene"></p>
        <p class="operator_jf">
          <a target="_blank" :href="buy_points">我要购买积分</a>
        </p>
        <p class="text-right fs-18"><a  class="text-primary" :href="explain_guide" target="_blank">怎么挣积分?</a></p>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'diglogComponents',
  props: {
    scene: String,
    needBack: Boolean,
    modalShow: Boolean
  },
  data () {
    return {
      buy_points: '',
      explain_guide: '',
      integrals: 100,
      dialogJ_F: false
    }
  },
  watch: {
    modalShow (val) {
      if (val) {
        this.dialogJ_F = val
      } else {
        this.dialogJ_F = false
      }
    }
  },
  mounted () {},
  created () {
    this.buy_points = this.http.buyScoreLink
    this.explain_guide = this.http.explainGuideLink(0)
  },
  methods: {
    goBack () {
      if (this.needBack) {
        // this.$router.back(-1)
        var userAgent = navigator.userAgent
        if (userAgent.indexOf('Firefox') !== -1 || userAgent.indexOf('Chrome') !== -1) {
          // window.location.href = '/home'
          this.$router.push({path: '/home'})
          window.close()
        } else {
          window.opener = null
          window.open('', '_self')
          window.close()
        }
      }
      this.$emit('update:modalShow', false)
    }
  }
}
</script>
<style scoped>
  .dialogJ_F .noice-box{
    width: 318px;
    margin: 0 auto;
  }
  .dialogJ_F .noice h3{
    font-size: 28px;
    color: #000000;
    margin-bottom: 25px;
  }
  .operator_jf a{
    display: inline-block;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
    background-color: #598cf2;
    color: #ffffff;
    border-radius: 10px;
  }
  .operator_jf a:hover{
    background-color: #409EFF;
  }

  @media only screen and (max-width: 768px){
    .dialogJ_F .noice-box{
      width: auto;
    }
  }
</style>
<style>
  .dialogJ_F .el-dialog{
    max-width: 600px;
    border-radius: 4px;
  }
  .dialogJ_F .el-dialog__body{
    padding: 20px 20px 0px;
  }
</style>
