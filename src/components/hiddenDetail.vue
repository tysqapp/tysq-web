
<template>
  <el-dialog class="hidden-dialog" title="帮助" :visible.sync="hiddenVisible" @close="hide_diglog">
    <p class="hidden-dialog-p">勾选【设为隐藏状态】后，文章变为【已隐藏】，【已隐藏】状态的文章不显示在主页列表和推荐列表。<br>取消勾选，则文章取消隐藏状态。</p>
  </el-dialog>
</template>

<script>
export default {
  name: 'hiddenDetail',
  props: {
    modalHiddenShow: Boolean
  },
  data () {
    return {
      hiddenVisible: false
    }
  },
  methods: {
    hide_diglog () {
      this.$emit('update:modalHiddenShow', false)
    }
  },
  watch: {
    modalHiddenShow (val) {
      if (val) {
        this.hiddenVisible = val
      } else {
        this.hiddenVisible = false
      }
    }
  },
  created () {

  }
}
</script>
<style scoped>
  .hidden-dialog-p{
    line-height: 26px;
  }
</style>
<style>
  .hidden-dialog .el-dialog{
    max-width:400px;
  }
  .hidden-dialog .el-dialog__body{
    padding: 20px 20px;
    color: #333333;
  }
  .hidden-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .hidden-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .hidden-dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
</style>
