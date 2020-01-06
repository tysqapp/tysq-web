<template>
  <!--首页公告-->
  <el-dialog
    class="noticeDiglog"
    :class="[contentArr.length===1?'notice_one':contentArr.length===2?'notice_two':contentArr.length===3?'notice_three':contentArr.length===4?'notice_four':'notice_five']"
    :close-on-click-modal="false"
    :visible.sync="noticeDiglog">
    <img src="../assets/ad/close.png"  class="close" alt="关闭" @click="noticeDiglog=false">
     <div class="noticeContent">
       <div>
          <ul class="rollScreen_list">
            <li class="rollScreen_once" :class="[(index+1)%3===1?'rollScreen_one':(index+1)%3===2?'rollScreen_two':(index+1)%3===0?'rollScreen_three':'']" v-for="(item,index) in contentArr" :key=index :style="{height:height+'px'}">
              <a  target="_blank" :href="item.url" v-if="item.url" class="router-link">
                <p class="float-left text-overflow-two has_url" :title="item.title" >{{item.title}}</p>
                <span class="float-right mt-15"><i class="go_subway"></i></span>
              </a>
              <p class="float-left text-overflow-two" :title="item.title"  v-else>{{item.title}}</p>
            </li>
          </ul>
       </div>
     </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'notice',
  props: {
    height: {
      default: 80,
      type: Number
    },
    lineNum: {
      default: 3.33,
      type: Number
    }
  },
  data () {
    return {
      noticeDiglog: false,
      contentArr: []
    }
  },
  created () {

  },
  mounted () {
    if (!window.sessionStorage.getItem('noticeDiglog')) {
      this.getAdInfo({size: 999})
    }
  },
  methods: {
    getAdInfo (params) {
      this.http.getNotices(params).then(res => {
        if (res.status === 0) {
          if (res.data.announcement_list) {
            let rightPopup = []
            res.data.announcement_list.forEach((item) => {
              if (item.position === 2 || item.position === 3) {
                // var index = item.url.lastIndexOf('#')
                // item.url = item.url.substring(index + 1, item.url.length)
                rightPopup.push(item)
              }
            })
            this.contentArr = rightPopup
            if (this.contentArr.length > 0) {
              if (window.sessionStorage.getItem('noticeDiglog')) {
                this.noticeDiglog = false
              } else {
                this.noticeDiglog = true
                window.sessionStorage.setItem('noticeDiglog', true)
              }
            }
          } else {
            this.contentArr = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    }
  }
}
</script>

<style>
  .noticeDiglog .el-dialog{
     max-width: 480px;
     box-shadow: none;
  }
  .noticeDiglog .go_subway{
    display: inline-block;
    background: url("../assets/go_suway.png");
    background-size: 100% 100%;
    width: 60px;
    height: 25px;
  }
  .notice_one .el-dialog{
    padding: 50px 20px 0px 20px;
    background: url("../assets/ad/notice_one.png") no-repeat;
    background-size: 100% 100%;
  }
  .notice_two .el-dialog{
    padding: 30px 20px 20px 20px;
    background: url("../assets/ad/notice_two.png") no-repeat;
    background-size: 100% 100%;
  }
  .notice_three .el-dialog{
    padding: 30px 20px 20px 20px;
    background: url("../assets/ad/notice_three.png") no-repeat;
    background-size: 100% 100%;
  }
  .notice_four .el-dialog{
    padding: 30px 20px 20px 20px;
    background: url("../assets/ad/notice_four.png") no-repeat;
    background-size: 100% 100%;
  }
  .notice_five .el-dialog{
    background: url("../assets/ad/notice_five.png") no-repeat;
    background-size: 100% 100%;
    max-height: 570px;
  }
  .notice_five .rollScreen_list{
    transition: 1s linear;
    height: 460px;
    padding: 20px;
    overflow-y:auto;
  }
  .notice_five .rollScreen_list::-webkit-scrollbar {
    width: 5px;  /*滚动条宽度*/
    height: 2px;  /*滚动条高度*/
  }
  .notice_five .rollScreen_list::-webkit-scrollbar-track {
    box-shadow:0px 1px 3px rgba(0,0,0,0.3) inset;
    border-radius: 10px;
    background-color: #ddd;
  }
  .notice_five .rollScreen_list::-webkit-scrollbar-thumb {
    box-shadow:0px 1px 3px rgba(0,0,0,0.3) inset;
    border-radius: 10px;
    background-color: #aaa;
  }
  .noticeDiglog .close{
    width: 26px;
    height: 26px;
    position: absolute;
    right: 16px;
    cursor: pointer;
  }
  .notice_one .close{
    top: 26px;
  }
  .notice_two .close{
    top: 19px;
  }
  .notice_three .close{
    top: 18px;
  }
  .notice_four .close{
    top: 18px;
  }
  .notice_five .close{
    top: 13px;
  }
  @media only screen and(width: 768px) {
    .noticeDiglog .close{
      top: 18px;
      right: 8px;
    }
  }
  @media (min-width: 321px)and (max-width: 767px) {
    .noticeDiglog .close{
      top: 18px;
      right: 8px;
    }
    .notice_five .rollScreen_list{
      padding: 10px 8px;
    }
    .noticeDiglog .rollScreen_once .has_url{
      width:170px!important;
    }
    .noticeDiglog .el-dialog__body{
      padding: 30px 2px;
    }
  }
  @media only screen and (max-width: 320px) {
    .noticeDiglog .close{
      right: 5px;
    }
    .notice_five .rollScreen_list{
      padding: 10px 2px;
    }
    .noticeDiglog .rollScreen_once .has_url{
      width:150px!important;
    }
    .noticeDiglog .el-dialog__body{
      padding: 30px 0px;
    }
  }
  .noticeDiglog .el-dialog__header{
    display: none;
  }
  .noticeDiglog .el-dialog__body{
    padding-top: 80px;
  }
  .noticeDiglog .rollScreen_once{
    padding: 15px 12px;
    margin-bottom: 15px;
  }
  .noticeDiglog .rollScreen_once{
    color: #fff;
    font-size: 15px;
  }
  .noticeDiglog .rollScreen_once .has_url{
    width:80%;
  }
  .noticeDiglog .rollScreen_list_unanim{
    transition: none
  }
  .noticeDiglog .rollScreen_one{
    background: url("../assets/ad/green2.png");
    background-size: 100% 100%;
  }
  .noticeDiglog .rollScreen_two{
    background: url("../assets/ad/yellow2.png");
    background-size: 100% 100%;
  }
  .noticeDiglog .rollScreen_three{
    background: url("../assets/ad/blue2.png");
    background-size: 100% 100%;
  }
  .noticeDiglog .text-overflow-two{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: -moz-box;
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    /*! autoprefixer: off */
    -moz-box-orient: vertical;
    /* autoprefixer: on */
    max-height: 46px;
  }
</style>
