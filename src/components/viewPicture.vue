<template>
  <!--查看大图-->
  <div class="el-image-viewer__wrapper el-image-viewer-Detail" v-if="checkImg" style="z-index: 2000;">
    <div class="el-image-viewer__mask"></div>
    <span class="el-image-viewer__btn el-image-viewer__close" @click="closePicView()">
        <i class="el-icon-circle-close"></i>
      </span>
    <div class="loading-div">
      <div class="el-image-viewer__canvas">
      <img :src="current_img_src"  class="el-image-viewer__img" style="transform: scale(1) rotate(0deg); margin-left: 0px; margin-top: 0px; max-height: 100%; max-width: 100%;">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'viewPicture',
  props: {
    modalPictureShow: Boolean,
    current_img_src: String
  },
  data () {
    return {
      checkImg: false,
      loading: true
    }
  },
  watch: {
    modalPictureShow (val) {
      if (val) {
        this.checkImg = val
      } else {
        this.checkImg = false
      }
    }
  },
  methods: {
    closePicView () {
      this.$emit('update:modalPictureShow', false)
    }
  }
}
</script>

<style scoped>
    .el-image-viewer-Detail  .el-image-viewer__close {
      color: #fff;
      top: 80px
    }
</style>
