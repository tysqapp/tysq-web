
<template>
  <el-dialog class="mask-dialog" title="" align="center" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="maskShow">
  </el-dialog>
</template>

<script>
export default {
  name: 'mask',
  props: {
    maskShow: Boolean
  },
  data () {
    return {
      maskVisible: false
    }
  },
  methods: {
  },
  watch: {
  },
  created () {

  }
}
</script>
<style>
  .mask-dialog .el-dialog{
    display: none;
  }
</style>
