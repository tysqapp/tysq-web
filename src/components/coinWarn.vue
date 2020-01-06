<template>
  <el-dialog class="coin-warn-dialog" title="" align="center" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="coinWarnVisible" @close="hideDiglog">
    <div class="coin-warn-box">
      <div class="coin-warn">
        <img src="../assets/invitaton/warning.png" width="65" height="58" alt="">
        <h3>温馨提示</h3>
      </div>
      <p class="text-000 mb-40 fs-18">您当前金币总额为<span class="text-pink">{{allCoinNum}}</span>金币，不可支出 <span class="text-pink">{{rewardNum}}</span>金币</p>
      <div class="coin-warn-btn clearfix">
        <a href="javascript:;" class="pull-left" @click="coinWarnVisible = false">修改打赏数量</a>
        <a class="pull-right" target="_blank" :href="buy_coin">我要购买金币</a>
      </div>
      <p class="text-right fs-18"><a  class="text-primary" target="_blank" :href="explain_guide">怎么挣金币?</a></p>
      <span slot="footer" class="dialog-footer">
      </span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'coinWarn',
  props: {
    modalCoinWarnShow: Boolean,
    allCoinNum: Number,
    rewardNum: Number
  },
  data () {
    return {
      buy_coin: '',
      explain_guide: '',
      coinWarnVisible: false
    }
  },
  methods: {
    hideDiglog () {
      this.$emit('update:modalCoinWarnShow', false)
    },
    submit () {

    },
    goCoin () {
      let routeUrl = window.location.protocol + '//' + window.location.host + '/html5/explain/index.html?type=2'
      window.open(routeUrl, '_blank')
      this.$emit('update:modalCoinWarnShow', false)
    }
  },
  watch: {
    modalCoinWarnShow (val) {
      if (val) {
        console.log(val)
        this.coinWarnVisible = val
      } else {
        this.coinWarnVisible = false
      }
    }
  },
  created () {
    this.buy_coin = this.http.buyCoinLink
    this.explain_guide = this.http.explainGuideLink(2)
  }
}
</script>
<style scoped>
  .coin-warn-dialog .coin-warn-box{
    width: 400px;
    margin: 0 auto;
  }
  .coin-warn-dialog .coin-warn h3{
    font-size: 28px;
    color: #000000;
    margin-bottom: 25px;
  }
  .coin-warn-btn{
    margin-bottom: 20px;
  }
  .coin-warn-btn a{
    display: inline-block;
    width: 180px;
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    text-align: center;
    background: #598CF2;
    color: #ffffff;
    border-radius: 4px;
  }
  .coin-warn-btn a:hover{
    background: #409EFF;
  }
  @media only screen and (max-width: 768px) {
    .coin-warn-dialog .coin-warn-box{
      width: 282px;
    }
  }
  @media only screen and (max-width: 320px) {
    .coin-warn-dialog .coin-warn-box{
      width: 200px;
    }
    .coin-warn-btn .el-button{
      width: 200px;
    }
  }
</style>
<style>
  .coin-warn-dialog .el-dialog{
    max-width: 600px;
    border-radius: 4px;
  }
  .coin-warn-dialog .el-dialog__body{
    padding: 20px 20px;
  }
</style>
