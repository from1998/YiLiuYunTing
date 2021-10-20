<template>
  <div id="app-container" style="padding:30px 0 0 0">
    <div class="payCard">
      <el-row :gutter="0" style="height:30px;margin-top:3%;">
        <el-col :span="20" :offset="2">
          <span :v-text="carNumber || resDate.carNumber" />
        </el-col>
      </el-row>
      <el-row :gutter="0" style="height:25px;font-size:14px;">
        <el-col :span="20" :offset="2">{{ resDate.park.name }}</el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px">
        <el-col :span="6" :offset="2">入场时间</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">{{ resDate.started }}</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">结束时间</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">{{ resDate.ended }}</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">停车时长</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">{{ resDate.durationText }}</el-col>
        <el-col :span="2" :offset="0" />
        <div id="lineDowm" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">总金额</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">{{ resDate.amount }}</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">优惠类型</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">{{ resDate.discountTypeText }}</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">已付费用</el-col>
        <el-col :span="14" :offset="0" style="text-align:right;color:green;font-size:1.2rem">￥{{ resDate.record.pay }}</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%">
        <el-col :span="6" :offset="2">支付时间</el-col>
        <el-col :span="14" :offset="0" style="text-align:right">{{ resDate.record.leaved }}</el-col>
        <el-col :span="2" :offset="0" />
      </el-row>
    </div>
    <div>
      <el-row :gutter="0" style="font-size:14px;margin-top:10%;color:#DBA44F">
        <el-col :span="22" :offset="2">温馨提示:
        </el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:2%;color:#DBA44F">
        <el-col :span="22" :offset="2">请核对您的车牌号，确认无误后,请在2分钟内支付。
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="0" style="font-size:14px;margin-top:5%">
      <el-col :span="20" :offset="2">
        <el-button type="primary" round style="width:100%" @click="awakeWXPay">支付</el-button>
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
import { getPayedData } from '@/api/qrcodeAccess/accessOut'
import load from '@/components/Tinymce/dynamicLoadScript'

const tinymceCDN = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js'

export default {
  data() {
    return {
      loading: false,
      parkId: '',
      carNumber: '',
      currentDate: '',
      loadDate: ''
    }
  },
  created() {
    // 取路由路径上的参数
    this.pay = this.$route.query && this.$route.query.isPay === 'true' // 路由传参
    this.parkId = this.$route.query && this.$route.query.parkId// 路由传参
    this.carNumber = this.$route.query && this.$route.query.carNumber// 路由传参

    // 查询进场数据
    this.getData()
  },
  mounted() {
    this.init()
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
    init() {
      load(tinymceCDN, () => {
        this.loadDate = new Date()
        // eslint-disable-next-line no-unused-vars
        function ready(callback) {
          if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', function() {
                callback && callback()
              }, false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', function() {
                callback && callback()
              })
              document.attachEvent('onWeixinJSBridgeReady', function() {
                callback && callback()
              })
            }
          } else {
            callback && callback()
          }
        }
      })
    },
    // awakeWXPay() {
    //   this.currentDate = new Date();
    //             const duration = this.currentDate.getTime() - this.loadDate.getTime();
    //             if (( duration / 1000 ) > 120) {
    //                 this.msgError("超过有效时间,请刷新后支付");
    //             } else {
    //                             WeixinJSBridge.invoke(
    //                                     'getBrandWCPayRequest', d.payParams,
    //                                     function(res){
    //                                         if(res.err_msg == "get_brand_wcpay_request:ok"){
    //                                             location.href = '<%=request.getContextPath()%>/pay_success_${park.id}.html?orderSn=' + d.orderSn;
    //                                         } else if(res.err_msg == "get_brand_wcpay_request:cancel"){
    //                                             $.ajax({
    //                                                 type: "POST",
    //                                                 url: "<%=request.getContextPath()%>/order_cancel.html",
    //                                                 data: {parkId: ${park.id}, orderSn: d.orderSn},
    //                                                 success: function (res) {

    //                                                 }
    //                                             });
    //                                             console.log("取消")
    //                                         } else if(res.err_msg == "get_brand_wcpay_request:fail"){
    //                                             $.ajax({
    //                                                 type: "POST",
    //                                                 url: "<%=request.getContextPath()%>/order_fail.html",
    //                                                 data: {parkId: ${park.id}, orderSn: d.orderSn},
    //                                                 success: function (res) {

    //                                                 }
    //                                             });
    //                                             alert("支付失败, 请联系管理员")
    //                                         }
    //                                     });
    //                         } else {
    //                             alert(d.message);
    //                         }
    //                     },
    //                 });
    //             }
    // },
    // 查询进场数据
    getData() {
      this.loading = true // 打开遮罩
      const query = {
        carNumber: this.carNumber,
        parkId: this.parkId
      }
      getPayedData(query).then(res => {
        this.msgSuccess(res.data)
      })
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
