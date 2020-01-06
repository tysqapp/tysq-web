<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <div class="invite-box">
          <div class="invite-info-box">
            <div class="type-title clearfix gold"><h2 class="pull-left title">积分</h2></div>
            <div class="integral-note-box">
              <div class="integral-note">
                <div class="title">获取途径</div>
                <ul>
                  <li><span>1</span>文章被阅读：可获得{{configuration_info.article_by_reading}}分/次，同一用户7天内重复阅读不加分（阅读自己的文章不加分）。</li>
                  <li><span>2</span>文章被评论：可获得{{configuration_info.article_by_commenting}}分/次（评论自己的文章不加分）。</li>
                  <li><span>3</span>购买积分：可用现金购买积分。</li>
                  <li><span>4</span>邀请朋友注册：一个朋友进入邀请页面，可获得{{configuration_info.rec_register_click}}分，两个朋友进入邀请页面，可获得{{configuration_info.rec_register_click*2}}分，以此类推；一个朋友进入邀请页面且成功注
                    册，可获得{{configuration_info.rec_register_success}}分，两个好友进入邀请页面且成功注册，可获得{{configuration_info.rec_register_success*2}}分，以此类推。</li>
                  <li><span>5</span>注册：可获得{{configuration_info.register_score}}分。</li>
                  <li><span>6</span>验证邮箱：可获得{{configuration_info.activate_email}}分。</li>
                </ul>
              </div>
              <div class="integral-note">
                <div class="title">作用</div>
                <ul>
                  <li><span>1</span>可阅读文章：每阅读一篇文章{{configuration_info.read_article}}分，{{configuration_info.read_article_limit_day}}天内重复阅读不扣分（阅读自己的文章不扣分）。</li>
                  <li><span>2</span>可评论文章：每评论一次{{configuration_info.comment_article}}分（评论自己的文章不扣分）。</li>
                  <li><span>6</span>可发布文章：新发布一篇文章{{configuration_info.create_article}}分（同一篇文章只扣一次）。</li>
                </ul>
              </div>
              <div class="integral-note">
                <div class="title">特别说明</div>
                <ul>
                  <li><span>1</span>积分都有有效期，具体的时间可在积分明细中查看。</li>
                  <li><span>2</span>注册和邀请朋友注册奖励都有IP限制，同一IP同一天有效加分次数为{{configuration_info.register_score_max_number}}次。</li>
                </ul>
              </div>
            </div>
            <div class="type-title clearfix gold" style="margin-bottom: 15px"><h2 class="pull-left title">等级</h2></div>
            <div class="mb-15">会员等级由积分唯一决定。具体规则如下:</div>
            <div class="gold-invite-table">
              <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                border
                style="width: 100%">
                <el-table-column
                  prop="title"
                  label=""
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span class="strong fs-20 text-gold">{{scope.row.title}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rank"
                  label="等级"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span class="text-gold strong fs-16">{{ scope.row.rank }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="score"
                  label="所需积分"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span class="text-gold strong fs-16">{{ scope.row.score }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rankImg"
                  label="称号"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span class="rank-img"><img :src="scope.row.rankImg" width="auto" height="auto" alt=""></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="type-title clearfix gold"><h2 class="pull-left title">金币</h2></div>
            <div class="integral-note-box">
              <p>金币是本站推出的虚拟货币，文章被阅读、好友购买积分都可获得金币。</p>
            </div>
            <footer class="text-center text-999 fs-16 pt-20 pb-20">{{explain}}</footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      configuration_info: {
        article_by_reading: ''
      },
      explain: window.GlodConfig.explain,
      tableData: [{
        title: '普通会员',
        rank: '1',
        rankImg: require('../../assets/invitaton/rank-1.png'),
        score: '0'
      }, {
        title: '普通会员',
        rank: '2',
        rankImg: require('../../assets/invitaton/rank-2.png'),
        score: '600'
      }, {
        title: '普通会员',
        rank: '3',
        rankImg: require('../../assets/invitaton/rank-3.png'),
        score: '1000'
      }, {
        title: '普通会员',
        rank: '4',
        rankImg: require('../../assets/invitaton/rank-4.png'),
        score: '5000'
      }, {
        title: '普通会员',
        rank: '5',
        rankImg: require('../../assets/invitaton/rank-5.png'),
        score: '1W'
      }, {
        title: '普通会员',
        rank: '6',
        rankImg: require('../../assets/invitaton/rank-6.png'),
        score: '3W'
      }, {
        title: '普通会员',
        rank: '7',
        rankImg: require('../../assets/invitaton/rank-7.png'),
        score: '7W'
      }, {
        title: '普通会员',
        rank: '8',
        rankImg: require('../../assets/invitaton/rank-8.png'),
        score: '10W'
      }, {
        title: '高级会员',
        rank: '9',
        rankImg: require('../../assets/invitaton/rank-9.png'),
        score: '20W'
      }, {
        title: '高级会员',
        rank: '10',
        rankImg: require('../../assets/invitaton/rank-10.png'),
        score: '50W'
      }, {
        title: '高级会员',
        rank: '11',
        rankImg: require('../../assets/invitaton/rank-11.png'),
        score: '80W'
      }, {
        title: '高级会员',
        rank: '12',
        rankImg: require('../../assets/invitaton/rank-12.png'),
        score: '100W'
      }, {
        title: '高级会员',
        rank: '13',
        rankImg: require('../../assets/invitaton/rank-13.png'),
        score: '300W'
      }, {
        title: '高级会员',
        rank: '14',
        rankImg: require('../../assets/invitaton/rank-14.png'),
        score: '700W'
      }, {
        title: '高级会员',
        rank: '15',
        rankImg: require('../../assets/invitaton/rank-15.png'),
        score: '1000W'
      }, {
        title: '高级会员',
        rank: '16',
        rankImg: require('../../assets/invitaton/rank-16.png'),
        score: '3000W'
      }, {
        rank: '17',
        rankImg: require('../../assets/invitaton/rank-17.png'),
        score: '7000W'
      }, {
        rank: '18',
        rankImg: require('../../assets/invitaton/rank-18.png'),
        score: '10000W'
      }]
    }
  },
  computed: {
  },
  mounted () {
    this.userInfo()
    this.getData()
  },
  methods: {
    getData () {
      this.http.getConfiguration().then(res => {
        if (res.status === 0) {
          this.configuration_info.activate_email = res.data.activate_email
          this.configuration_info.article_by_commenting = res.data.article_by_commenting
          this.configuration_info.article_by_reading = res.data.article_by_reading
          this.configuration_info.comment_article = res.data.comment_article
          this.configuration_info.create_article = res.data.create_article
          this.configuration_info.read_article = res.data.read_article
          this.configuration_info.read_article_limit_day = res.data.read_article_limit_day
          this.configuration_info.rec_register_click = res.data.rec_register_click
          this.configuration_info.rec_register_success = res.data.rec_register_success
          this.configuration_info.register_score = res.data.register_score
          this.configuration_info.register_score_max_number = res.data.register_score_max_number
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    userInfo () {
      this.http
        .userInfo().then(res => {
          if (res.status === 0) {
            this.imageUrl = res.data.account_info.head_url
            // this.formLabelAlign.name = res.data.account_info.account
            this.asset = res.data.asset
            this.gradeImg = res.data.asset.grade === 1 ? require('../../assets/invitaton/rank-1.png') : res.data.asset.grade === 2 ? require('../../assets/invitaton/rank-2.png') : res.data.asset.grade === 3 ? require('../../assets/invitaton/rank-3.png')
              : res.data.asset.grade === 4 ? require('../../assets/invitaton/rank-4.png') : res.data.asset.grade === 5 ? require('../../assets/invitaton/rank-5.png') : res.data.asset.grade === 6 ? require('../../assets/invitaton/rank-6.png') : res.data.asset.grade === 7 ? require('../../assets/invitaton/rank-7.png') : res.data.asset.grade === 8 ? require('../../assets/invitaton/rank-8.png') : res.data.asset.grade === 9 ? require('../../assets/invitaton/rank-9.png')
                : res.data.asset.grade === 10 ? require('../../assets/invitaton/rank-10.png') : res.data.asset.grade === 11 ? require('../../assets/invitaton/rank-11.png') : res.data.asset.grade === 12 ? require('../../assets/invitaton/rank-12.png') : res.data.asset.grade === 13 ? require('../../assets/invitaton/rank-13.png') : res.data.asset.grade === 14 ? require('../../assets/invitaton/rank-14.png')
                  : res.data.asset.grade === 15 ? require('../../assets/invitaton/rank-15.png') : ''
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 8 === 0) {
          return {
            rowspan: 8,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .main-container>.view{
    width: 100%;
  }
  .integral-note{
    margin-bottom: 35px;
  }
  .integral-note .title{
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .integral-note-box p{
    font-size: 16px;
    margin-bottom: 20px;
  }
  .integral-note ul li{
    margin-bottom: 10px;
  }
  .integral-note ul li span{
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
    background-color: #c59b56;
    border-radius: 50%;
    margin-right: 15px;
  }
</style>
<style>
  .gold-invite-table table tbody>tr:nth-child(9) td:nth-child(1){
    border-bottom: none 0;
  }
</style>
