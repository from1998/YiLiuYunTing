<template>
  <div id="app-container" style="padding:20px 0 0 0">
    <div class="payCard">
      <el-row :gutter="0" style="height:30px;margin-top:3%;">
        <el-col :span="20" :offset="2">{{ carNumber }}</el-col>
      </el-row>
      <el-row :gutter="0" style="height:25px;font-size:14px;">
        <el-col :span="20" :offset="2">一流云停</el-col>
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
        <el-col :span="14" :offset="0" style="text-align:right">5.89</el-col>
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
        <el-button type="primary" round style="width:100%">支付</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:5%">
      <el-col :span="20" :offset="2">
        <el-button type="warning" round style="width:100%">刷新</el-button>
      </el-col>
    </el-row>
    <div id="anbo-ad-st" />
    <div class="advwrap" />
  </div>
</template>
<script>

export default {
  data() {
    return {
      carNumber: '临NF00365'
    }
  },
  mounted() {
    this.loadScript('http://sdk-test.anbokeji.net/adv/index.js', () => {
      const container = document.getElementById('app-container')
      const st = document.querySelector('#anbo-ad-st')
      if (st) {
        container.removeChild(st)
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.id = 'anbo-ad-st'
      script.innerHTML = '__anbo_adv_sdk__.init({appid: "ab9N879pd0ZUt1dAZh", adPosId: 3,parkId: "1631003190101",host:""})'
      container.append(script)

      document.querySelector('.advwrap').innerHTML = "<anboadv @show='advShow'></anboadv>"
      window.advShow = function(res) {
        console.log('============ree', res)
      }
    })
  },
  methods: {

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
