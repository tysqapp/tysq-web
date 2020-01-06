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
                  <span>{{item.name}}</span>
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
  name: 'editLayout',
  components: {
  },
  data () {
    return {
      defaultActive: 0,
      arr: [
        {name: '个人资料', path: '/editInfo'},
        {name: '账号与密码', path: '/userSet'}
      ]
    }
  },
  inject: ['reload'],
  computed: {},
  mounted () {
  },
  created () {
    let path = this.$route.path
    console.log(path)
    if (path === '/editInfo') {
      this.defaultActive = 0
    } else {
      this.defaultActive = 1
    }
  },
  methods: {
    changeTab (index) {
      this.defaultActive = index
      if (this.defaultActive === 0) {
        this.$router.push({path: '/editInfo'})
      } else if (this.defaultActive === 1) {
        this.$router.push({path: '/userSet'})
      }
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
</style>
