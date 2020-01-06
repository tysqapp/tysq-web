<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <!-- el-main -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="left-tab-box border-radius-4">
              <ul>
                <li
                  v-for="(item, index) in arr"
                  :key="index"
                  :class="{ active: defaultActive===index}"
                  @click="changeTab(index);"
                >
                  <el-badge :value="number" :max="99" class="item" slot="name" v-if="index===0 && number">
                    <span>{{item.name}}</span>
                  </el-badge>
                  <span slot="name" v-else>{{item.name}}</span>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <router-view></router-view>
          </el-col>
        </el-row>
        <!-- el-main -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'moderLayout',
  components: {
  },
  data () {
    return {
      number: '',
      defaultActive: 0,
      arr: [
        {name: '文章审核列表'},
        {name: '禁止评论列表'},
        {name: '举报'}
      ]
    }
  },
  inject: ['reload'],
  computed: {},
  mounted () {
    this.getUnreadNumber({type: 'article'})
  },
  created () {
    let path = this.$route.path
    if (path === '/moderArticle') {
      this.defaultActive = 0
    } else if (path === '/moderComment') {
      this.defaultActive = 1
    } else {
      this.defaultActive = 2
    }
  },
  methods: {
    changeTab (index) {
      this.defaultActive = index
      if (this.defaultActive === 0) {
        this.$router.push({path: '/moderArticle'})
      } else if (this.defaultActive === 1) {
        this.$router.push({path: '/moderComment'})
      } else {
        this.$router.push({path: '/accusation'})
      }
    },
    getUnreadNumber (params) {
      this.http
        .getModerUnreadCount(params)
        .then(res => {
          if (res.status === 0) {
            this.number = res.data.count_info.unreviewed_count
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    }
  }
}
</script>

<style scoped>
  .welcome-view {
    width: 100%;
  }
  .left-tab-box {
    background: #ffffff;
    padding: 24px;
  }
  .left-tab-box ul li {
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    text-align: center;
    font-size: 18px;
    margin-bottom: 15px;
    cursor: pointer;
  }
  .left-tab-box ul {
    position: relative;
  }
  .left-tab-box ul li.active,
  .left-tab-box ul li:hover {
    background: #dee8fc;
    color: #598cf2;
  }
</style>
<style>
  .left-tab-box .el-badge__content{
    line-height: 16px;
  }
  .left-tab-box .el-badge__content.is-fixed{
    top:6px;
    background-color: #ff0000;
  }
</style>
