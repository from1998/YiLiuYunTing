<template>
  <!-- 该页面既是出场支付页面也是用户预付款查询成功页面 -->
  <div id="app-container" style="padding:30px 0 0 0">
    <div v-if="!success">
      <div class="payCard">
        <el-row :gutter="0" style="height:30px;margin-top:3%;">
          <el-col :span="20" :offset="2" style="text-align:center;">
            <span style="color:#00f" v-text="queryParams.carNumber" />
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
          <el-col :span="14" :offset="0" style="text-align:right">￥{{ resDate.amount }}</el-col>
          <el-col :span="2" :offset="0" />
        </el-row>
        <el-row :gutter="0" style="font-size:14px;margin-top:2%">
          <el-col :span="6" :offset="2">优惠类型</el-col>
          <el-col :span="14" :offset="0" style="text-align:right">{{ resDate.discountTypeText }}</el-col>
          <el-col :span="2" :offset="0" />
        </el-row>
        <el-row :gutter="0" style="font-size:14px;margin-top:2%">
          <el-col :span="6" :offset="2">优惠金额</el-col>
          <el-col :span="14" :offset="0" style="text-align:right">{{ resDate.discountAmount }}</el-col>
          <el-col :span="2" :offset="0" />
        </el-row>
        <el-row :gutter="0" style="font-size:14px;margin-top:2%">
          <el-col :span="6" :offset="2">应交金额</el-col>
          <el-col :span="14" :offset="0" style="text-align:right;color:red;font-size:1.2rem">￥{{ resDate.money }}</el-col>
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
      <el-row v-show="resDate.amount!==0" :gutter="0" style="font-size:14px;margin-top:5%">
        <el-col :span="20" :offset="2">
          <el-button type="primary" round style="width:100%" @click="handlePay">支付</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="0" style="font-size:14px;margin-top:5%">
        <el-col :span="20" :offset="2">
          <el-button type="warning" round style="width:100%" @click="handleRefresh">刷新</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="success">
      <el-row :gutter="0">
        <el-col :span="12" :offset="6" style="text-align:center;margin-top:7%;">
          <svg-icon icon-class="zhifubao" style="font-size:16vw;" />
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12" :offset="6" style="text-align:center;margin-top:6%;margin-bottom:5%;">
          <span style="color:#00A8FF;font-size:1.5em;">支付成功</span>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12" :offset="6" style="text-align:center">
          <span style="font-size:1.5em">￥ {{ resDate.money }} 元</span>
        </el-col>
      </el-row>
    </div>
    <div id="anbo-ad-st" />
    <div class="advwrap" />
  </div>
</template>
<script>
import { getNoPayData, createOrder, successedOrder, cancleOrder, failedOrder } from '@/api/qrcodeAccess/accessOut'
import load from '@/components/Tinymce/dynamicLoadScript'
const wechatJs = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
const aLiJs = 'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.inc.min.js'
export default {
  data() {
    return {
      isWx: '',
      isAli: '',
      AbParkId: '',
      loading: false,
      currentDate: '',
      loadDate: '',
      resDate: {
        park: {}
      },
      success: false,
      queryParams: {
        carNumber: '',
        couponsRecordId: '',
        parkId: ''
      }
    }
  },
  created() {
    // 取路由路径上的参数
    this.queryParams.parkId = this.$route.query && this.$route.query.parkId// 路由传参
    this.queryParams.carNumber = this.$route.query && this.$route.query.carNumber// 路由传参

    // 查询进场数据
    this.getData()
  },
  mounted() {
    // 确保dom异步加载完毕
    this.$nextTick(() => {
      getNoPayData(this.queryParams).then(res => {
        // 加载安泊广告脚本
        console.log('开始加载')
        this.loadScript('https://sdk.anbokeji.net/adv/index.js', () => {
          console.log('================' + this.AbParkId)
          const container = document.getElementById('app-container')
          // const st = document.querySelector('#anbo-ad-st')
          // if (st) {
          //   container.removeChild(st)
          // }
          const script = document.createElement('script')
          script.type = 'text/javascript'
          script.id = 'anbo-ad-st'
          script.innerHTML = '__anbo_adv_sdk__.init({appid: "ab9N879pd0ZUt1dAZh", adPosId:"3",parkId:"' + res.data.park.abId + '",})'
          container.append(script)
          document.querySelector('.advwrap').innerHTML = "<anboadv @show='advShow'></anboadv>"
          window.advShow = function() {
          }
        })
      })
      // 加载微信支付脚本
      if (this.isWx) {
        load(wechatJs, () => {
          if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', () => { })
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', () => { })

              document.attachEvent('onWeixinJSBridgeReady', () => {})
            }
          }
          console.log('wx加载')
        })
      }
      // 加载支付宝支付脚本
      if (this.isAli) {
        load(aLiJs, () => {
          if (window.AlipayJSBridge) {
            () => { }
          } else {
            document.addEventListener('AlipayJSBridgeReady', () => {})
          }
        })
      }
    })
  },
  methods: {
    // 查询进场数据
    getData() {
      this.loading = true // 打开遮罩
      getNoPayData(this.queryParams).then(res => {
        Object.assign(this.resDate, res.data)
        this.isWx = res.data.baseData.isWx
        this.isAli = res.data.baseData.isAli
        this.AbParkId = res.data.park.abId
        // 优惠券ID
        this.queryParams.couponsRecordId = res.data.couponsRecord.id
        this.queryParams.carNumber = res.data.carNumber
      })
      this.loading = false// 关闭遮罩
    },
    // 支付
    handlePay() {
      this.getData()
      const { parkId, carNumber, couponsRecordId } = this.queryParams
      const query = {
        parkId: parkId,
        carNumber: carNumber,
        couponsRecordId: couponsRecordId
      }
      createOrder(query).then(recieve => {
        this.queryParams.orderSn = recieve.data.orderSn
        if (this.isWx) {
          window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            recieve.data.payParams,
            res => {
              const { orderSn } = this.queryParams
              const resQuery = {
                parkId: parkId,
                orderSn: orderSn
              }
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                successedOrder(resQuery)
              } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                cancleOrder(resQuery)
                this.$router.go(0)
              } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                failedOrder(resQuery)
                this.msgError(res.err_code + res.err_desc + res.err_msg)
              }
            })
        }
        if (this.isAli) {
          window.AlipayJSBridge.call('tradePay', {
            tradeNO: recieve.data.payParams
          }, res => {
            const code = res.resultCode
            // 成功代码是9000
            if (code === '9000') {
              const parkId = this.queryParams.parkId
              // delete this.queryParams.parkId
              successedOrder(parkId, this.queryParams)
              this.success = true
              // 取消代码是6001
            } else if (code === '6001') {
              cancleOrder(this.queryParams)
              // 失败代码是4000
            } else if (code === '4000') {
              failedOrder(this.queryParams)
              this.msgError(code + res.memo + res.result)
            }
          })
        }
      })
    },
    // 刷新
    handleRefresh() {
      this.$message({
        message: '刷新成功! 正在重载页面...',
        type: 'success',
        center: true,
        duration: '800',
        onClose: () => {
          this.$router.go(0)
        }
      })
    },
    loadScript(xyUrl, callback) {
      console.log('调用方法')
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
          console.log('调用回调')
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
