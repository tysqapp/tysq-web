<template>
  <div>
    <el-dialog
      class="gradeDiglog"
      title=""
      align="center"
      :visible.sync="dialog_grade"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="goBack">
      <div class="noice-box">
        <div class="noice">
          <img src="../assets/invitaton/warning.png" width="65" height="58" alt="">
          <h3>等级不足</h3>
        </div>
        <p class="text-000 mb-25 text-left fs-18" v-html="scene"></p>
        <p class="operator_jf">
          <a target="_blank" :href="buy_points">购买积分可以升级哦！去升级</a>
        </p>
        <p class="text-right fs-18"><a  class="text-primary" :href="explain_guide">查看等级规则</a></p>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'gradeDiglog',
  props: {
    scene: String,
    gradeNeedBack: Boolean,
    modalGradeShow: Boolean
  },
  data () {
    return {
      buy_points: '',
      explain_guide: '',
      dialog_grade: false
    }
  },
  watch: {
    modalGradeShow (val) {
      if (val) {
        this.dialog_grade = val
      } else {
        this.dialog_grade = false
      }
    }
  },
  created () {
    this.buy_points = this.http.buyScoreLink
    this.explain_guide = this.http.explainGuideLink(1)
  },
  methods: {
    goBack () {
      if (this.gradeNeedBack) {
        var userAgent = navigator.userAgent
        if (userAgent.indexOf('Firefox') !== -1 || userAgent.indexOf('Chrome') !== -1) {
          this.$router.push({path: '/home'})
          window.close()
        } else {
          window.opener = null
          window.open('', '_self')
          window.close()
        }
      }
      this.$emit('update:modalGradeShow', false)
    }
  }
}
</script>
<style scoped>
  .gradeDiglog .noice-box{
    width: 318px;
    margin: 0 auto;
  }
  .gradeDiglog .noice h3{
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
    .gradeDiglog .noice-box{
      width: auto;
    }
  }
</style>
<style>
  .gradeDiglog .el-dialog{
    max-width: 600px;
    border-radius: 4px;
  }
  .gradeDiglog .el-dialog__body{
    padding: 20px 20px 0px;
  }
</style>
