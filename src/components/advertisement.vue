
<template>
    <div :style="{height:height*lineNum + 'px'}" class="rollScreen_container advertisement" id ="rollScreen_container" v-if="contentArr.length>0">
    <ul class="rollScreen_list" :style = {transform:transform} :class="{rollScreen_list_unanim:num===0}">
      <li class="rollScreen_once" :class="[(index+1)%3===1?'rollScreen_one':(index+1)%3===2?'rollScreen_two':(index+1)%3===0?'rollScreen_three':'']" v-for="(item,index) in contentArr" :key=index :style="{height:height+'px'}">
        <a target="_blank" :href="item.url" v-if="item.url" class="router-link">
        <p class="float-left text-overflow-two has_url" :title="item.title">{{item.title}}</p>
        <span class="float-right mt-15"><i class="el-icon-arrow-right"></i></span>
        </a>
        <p class="float-left text-overflow-two" v-else :title="item.title">{{item.title}}</p>
      </li>
      <li class="rollScreen_once" v-if="(contentArr.length%3)===1" :class="[index===0?'rollScreen_two':index===1?'rollScreen_three':(index!==0&&index!==1&&(index+1)%3===0)?'rollScreen_one':(index!==0&&index!==1&&(index+1)%3===1)?'rollScreen_two':(index!==0&&index!==1&&(index+1)%3===2)?'rollScreen_three':'']" v-for="(item,index) in contentArr" :key=index+contentArr.length :style="{height:height+'px'}">
        <a tag='a'  :href="item.url" v-if="item.url" class="router-link">
        <p class="float-left text-overflow-two has_url" :title="item.title">{{item.title}}</p>
        <span class="float-right mt-15"><i class="el-icon-arrow-right"></i></span>
        </a>
        <p class="float-left text-overflow-two" :title="item.title"  v-else>{{item.title}}</p>
      </li>
      <li class="rollScreen_once" v-if="(contentArr.length%3)===2" :class="[index===0?'rollScreen_three':(index!==0&&(index+1)%3===2)?'rollScreen_one':(index!==0&&(index+1)%3===0)?'rollScreen_two':(index!==0&&(index+1)%3===1)?'rollScreen_three':'']" v-for="(item,index) in contentArr" :key=index+contentArr.length :style="{height:height+'px'}">
        <a target="_blank" :href="item.url" v-if="item.url" class="router-link">
          <p class="float-left text-overflow-two has_url" :title="item.title" >{{item.title}}</p>
        <span class="float-right mt-15"><i class="el-icon-arrow-right"></i></span>
        </a>
        <p class="float-left text-overflow-two" v-else :title="item.title" >{{item.title}}</p>
      </li>
      <li class="rollScreen_once" v-if="(contentArr.length%3)===0" :class="[(index+1)%3===1?'rollScreen_one':(index+1)%3===2?'rollScreen_two':(index+1)%3===0?'rollScreen_three':'']" v-for="(item,index) in contentArr" :key=index+contentArr.length :style="{height:height+'px'}">
        <a target="_blank" :href="item.url" v-if="item.url" class="router-link">
        <p class="float-left text-overflow-two has_url" :title="item.title" >{{item.title}}</p>
        <span class="float-right mt-15"><i class="el-icon-arrow-right"></i></span>
        </a>
        <p class="float-left text-overflow-two" :title="item.title"  v-else>{{item.title}}</p>
      </li>
    </ul>
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      height: 80,
      lineNum: 3.33,
      contentArr: [],
      num: 0
    }
  },
  computed: {
    transform: function () {
      return 'translateY(-' + (this.num * (this.height + 10)) + 'px)'
    }
  },
  methods: {
    getAdInfo (params) {
      this.http.getNotices(params).then(res => {
        if (res.status === 0) {
          if (res.data.announcement_list) {
            let rightAd = []
            res.data.announcement_list.forEach((item) => {
              if (item.position === 1 || item.position === 3) {
                rightAd.push(item)
              }
            })
            this.$emit('click', rightAd)
            this.contentArr = rightAd
            if (this.contentArr.length > 3) {
              let _this = this
              setInterval(function () {
                if (_this.num !== _this.contentArr.length) {
                  _this.num++
                } else {
                  _this.num = 0
                }
              }, 5000)
            } else if (this.contentArr.length === 2) {
              this.lineNum = 2.2
            } else if (this.contentArr.length === 1) {
              this.lineNum = 1.1
            }
          } else {
            this.contentArr = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    }
  },
  mounted () {
  },
  created: function () {
    this.getAdInfo({size: 999})
  }
}
</script>

<style>
  .advertisement{
    width: 100%;
    display: inline-block;
    position:relative;
    overflow: hidden;
  }
  @media only screen and (max-width: 768px) {
  .advertisement{
    padding: 0px 12px;
   }
  }
  .advertisement .rollScreen_list{
    transition: 1s linear;
  }
  .advertisement .rollScreen_once{
    padding: 15px 12px;
    margin-bottom: 10px;
  }
  .advertisement .rollScreen_once{
    color: #fff;
    font-size: 15px;
  }
  .advertisement .rollScreen_once .has_url{
     width:90%;
  }
  .advertisement .rollScreen_list_unanim{
    transition: none
  }
  .advertisement .rollScreen_one{
   background: url("../assets/ad/green2.png");
   background-size: 100% 100%;
  }
  .advertisement .rollScreen_two{
    background: url("../assets/ad/yellow2.png");
    background-size: 100% 100%;
  }
  .advertisement .rollScreen_three{
    background: url("../assets/ad/blue2.png");
    background-size: 100% 100%;
  }
  .advertisement .text-overflow-two{
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
