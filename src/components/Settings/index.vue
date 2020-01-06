<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">主题配置</h3>
      <div class="drawer-item" v-for="(item,index) in themeData" :key="index">
        <el-radio v-model="theme" :label="item.flag" @change="choice_theme"> <span>{{item.title}}</span></el-radio>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store/index'
export default {
  data () {
    return {
      theme: 'simplicity-black',
      themeData: [
        {title: '简约-黑(默认)', flag: 'simplicity-black'},
        {title: '简约-白', flag: 'simplicity-white'},
        {title: '秋天模式', flag: 'fall-wrapper'},
        {title: '夜间模式', flag: 'eye_care_wrapper'}
      ]
    }
  },
  computed: {

  },
  created () {
    if (window.localStorage.getItem('theme')) {
      this.theme = window.localStorage.getItem('theme')
      store.commit('flagTheme', this.theme)
    }
  },
  methods: {
    choice_theme (e) {
      if (e === 'sidebar_wrapper') {
        this.$toast('还未开发完,请稍等', 3000, 'error')
        store.commit('flagTheme', e)
        window.localStorage.setItem('theme', e)
      } else {
        store.commit('flagTheme', e)
        window.localStorage.setItem('theme', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }

  .job-link{
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
