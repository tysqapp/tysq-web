<template>
  <el-dialog class="reward-dialog" title="打赏金币" :visible.sync="rewardVisible"  @close="reward_review" :close-on-click-modal="false">
    <p class="text-999">千言万语都抵不过一次行动，给作者一些鼓励吧！</p>
    <el-row :gutter="36">
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" v-for="(item,index) in rewardList" :key="index">
        <span class="reward-item" :class="[index===isActive?'active':'']" @click="changeStatus(index,item.value)"><img src="../assets/icon/icon-reward.png" width="28" height="28" alt="">{{item.value}}</span>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <span class="reward-custom" :class="{'active': customActive}" @click="custom"><span>自定义</span></span>
      </el-col>
      <transition name="el-zoom-in-top">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="customActive">
          <div class="reward-num">
            <img src="../assets/icon/icon-reward.png" width="28" height="28" alt="">
            <el-input v-model="input" placeholder="请输入打赏金币数" @blur="inputNumber(input)" maxlength="8" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
          </div>
      </el-col>
      </transition>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary rewards-save" @click="submit" :disabled="forbid">打赏</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'rewardArticle',
  props: {
    modalRewardShow: Boolean,
    articleId: String,
    coinWarnShow: Boolean
  },
  data () {
    return {
      isActive: -1,
      customActive: false,
      inputActive: false,
      forbid: false,
      rewardVisible: false,
      rewardList: [
        {value: '100'},
        {value: '200'},
        {value: '500'},
        {value: '1000'},
        {value: '2000'}
      ],
      input: '',
      reward_num: '',
      allCoinNum: 0,
      rewardNum: 0
    }
  },
  created () {
  },
  inject: ['reload'],
  watch: {
    modalRewardShow (val) {
      if (val) {
        this.rewardVisible = val
      } else {
        this.rewardVisible = false
      }
    }
  },
  methods: {
    reward_review () {
      this.$emit('update:modalRewardShow', false)
    },
    changeStatus (index, value) {
      this.customActive = false
      this.input = ''
      this.isActive = index
      this.reward_num = value
    },
    custom () {
      this.customActive = !this.customActive
      if (this.customActive) {
        this.isActive = -1
      }
      if (this.customActive && this.isActive === -1) {
        this.reward_num = null
      }
    },
    inputNumber (value) {
      if (value) {
        this.reward_num = value
      }
    },
    submit () {
      console.log(this.reward_num)
      if (this.reward_num === null || this.reward_num === '') {
        this.$toast('请选择打赏数量！', 3000, 'error')
      } else if (this.reward_num < 100) {
        this.$toast('打赏数量不可低于100！', 3000, 'error')
      } else {
        this.forbid = true
        this.http.rewardArticle({reward_num: parseInt(this.reward_num), article_id: this.articleId}).then(res => {
          this.forbid = false
          if (res.status === 0) {
            this.$emit('update:modalRewardShow', false)
            this.$toast('打赏成功！', 2000, 'common')
            this.customActive = false
            this.input = ''
            this.$parent.getNewestReward(this.$route.query.article_id, {size: 6})
          } else if (res.status === 2994) {
            this.$parent.coinWarnShow = true
            this.$parent.coin_num = res.data.coin_num
            this.$parent.reward_num = res.data.reward_num
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 5000, 'error')
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .el-row .el-col{
    margin: 15px 0;
  }
  .reward-item,.reward-custom{
    display: inline-block;
    width: 150px;
    height: 70px;
    line-height: 70px;
    border: 1px solid #DDDDDD;
    border-radius:8px;
    font-size: 24px;
    color: #666666;
    cursor: pointer;
    padding-left: 25px;
  }
  .reward-item img{
    margin-right: 5px;
  }
  .reward-item.active{
    border-color: #598CF2;
    color: #598CF2;
  }
  .reward-custom{
    text-align: center;
    padding-left: 0;
    color: #999999
  }
  .reward-custom.active{
    border-color: #598CF2;
    color: #598CF2;
  }
  .el-input{
    width: 84px;
    height: 70px;
  }
  .reward-num{
    position: relative;
  }
  .reward-num img{
    position: absolute;
    left: 0;
    top: 20px;
    z-index: 1;
  }
  .reward-num .el-input{
    width: 100%;
  }
  .rewards-save{
    width: 200px;
    height: 70px;
    border-radius: 35px;
    font-size: 24px;
  }
  @media only screen and (max-width: 768px){
  }
</style>
<style>
  .reward-dialog .el-dialog{
    max-width: 620px;
  }
  .reward-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .reward-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .reward-dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .reward-dialog .el-dialog__footer{
    text-align: center;
  }
  .reward-dialog .el-dialog__body{
    padding: 30px 20px 0 20px;
  }
  .reward-dialog .el-input__inner{
    height: 68px;
    font-size: 24px;
    color: #666666;
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0;
    padding-left: 40px;
    color: #598CF2;
  }
</style>
