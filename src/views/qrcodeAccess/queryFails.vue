<template>
  <!-- 该页面是用户预付款查询失败页面，计划将优惠券领取成功页面与之合并在该页面 -->
  <div id="app-container" style="padding:30px 0 0 0">
    <div class="payCard">
      <el-row :gutter="0" style="height:30px;margin-top:3%;text-align:center">
        <el-col :span="20" :offset="2">车牌号:{{ carNumber }}</el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px;">
        <el-col :span="20" :offset="2">
          【徽昌苑北门商业街停车场】:暂无此车辆信息
        </el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%;">
        <el-col :span="20" :offset="2">
          如果是 <span style="color:red">无牌车</span> 请到出口处扫码支付
        </el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="20" :offset="2">
          如在场请咨询管理人员。
        </el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="20" :offset="2">
          给您带来的不便,敬请谅解。
        </el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%;">
        <el-col :span="22" :offset="2">
          <span>如有疑问请拨打客服电话:</span>
          <a href="tel:0551—65521987">0551—65521987</a>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="0" style="font-size:14px;margin-top:5%">
      <el-col :span="20" :offset="2">
        <router-link to="/qrcodeAccess/imprest" class="link-type">
          <el-button type="primary" round style="width:100%">
            <span>返回</span>
          </el-button>
        </router-link>
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
    margin-top: 30px;
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
