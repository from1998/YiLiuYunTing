<template>
  <div id="app-container" style="padding:30px 0 0 0">
    <div class="payCard">
      <el-row :gutter="0" style="height:30px;margin-top:3%;">
        <el-col :span="20" :offset="2">{{ carNumber }}</el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px">
        <el-col :span="6" :offset="2">入场时间</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">2021-09-23 16:21</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">结束时间</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">2021-09-23 19:59</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">停车时长</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">0小时1分</el-col>
        <el-col :span="2" :offset="0" />
        <div id="lineDowm" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">总金额</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">6.66</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">优惠类型</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">折扣</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">应交金额</el-col>
        <el-col :span="14" :offset="0" style="text-align:right;color:red;font-size:1.2rem">￥5.89</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
    </div>
    <el-row :gutter="0" style="font-size:14px;margin-top:10%;color:#DBA44F">
      <el-col :span="22" :offset="2">温馨提示:
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:2%;color:#DBA44F">
      <el-col :span="22" :offset="2">请核对您的车牌号，确认无误后,请在2分钟内支付。
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:5%">
      <el-col :span="20" :offset="2">
        <el-button type="primary" round style="width:100%">返回</el-button>
      </el-col>
    </el-row>
    <div id="anbo-ad-st" />
    <div class="advwrap" />
  </div>
</template>
<script>
// import { getLeaveData } from '@/api/qrcodeAccess/accessOut'

export default {
  data() {
    return {
      loading: false,
      parkId: '',
      carNumber: '临NF00365',
      queryParams: {
        sn: '2021092410020961589649605'
      }
    }
  },
  created() {
    // 取路由路径上的参数
    // this.queryParams.sn = this.encode64(this.$route.params && this.$route.params.sn) // 路由传参
    // 查询进场数据
    this.getData()
  },
  mounted() {
    this.loadScript('https://sdk.anbokeji.net/adv/index.js', () => {
      const container = document.getElementById('app-container')
      const st = document.querySelector('#anbo-ad-st')
      if (st) {
        container.removeChild(st)
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.id = 'anbo-ad-st'
      script.innerHTML = '__anbo_adv_sdk__.init({appid: "ab9N879pd0ZUt1dAZh", adPosId:"3",parkId:"' + this.parkId + '",host:""})'
      container.append(script)
      document.querySelector('.advwrap').innerHTML = "<anboadv @show='advShow'></anboadv>"
      window.advShow = function() {
      }
    })
  },
  methods: {
    // 查询进场数据
    getData() {
      this.loading = true // 打开遮罩
      this.parkId = '340100202107124653'
      // getLeaveData(this.queryParams).then(res => {
      //   this.carNumber = res.data.carNumber
      // this.parkId = res.data.parkId
      // })
      this.loading = false// 关闭遮罩
    },
    loadScript(xyUrl, callback) {
      var head = document.getElementsByTagName('head')[0]
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = xyUrl
      script.onload = script.onreadystatechange = function() {
        if (
          !this.readyState ||
          this.readyState === 'loaded' ||
          this.readyState === 'complete'
        ) {
          callback && callback()
          script.onload = script.onreadystatechange = null
          if (head && script.parentNode) {
            head.removeChild(script)
          }
        }
      }
      head.insertBefore(script, head.firstChild)
    }
  }
}
</script>
<style css>
.advwrap {
  height: 200px;
  margin: auto;
    margin-top: 50px;
  width: 90%;
}
#lineDowm {
width: 83%;
margin: 6% auto 0;
height: 1px;
background-color: #dcdfe6;
}
.payCard {
  background-color: #f8f8f8;
  width: 90%;
  margin: auto;
  padding: 10px 0;
}
</style>
