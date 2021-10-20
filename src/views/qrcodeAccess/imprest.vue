<template>
  <div id="app-container">
    <!-- 计划将优惠券领取页面与之合并 -->
    <el-header style="text-align:center;margin-top:10%;height:50px;font-size:1.2rem">{{ parkName }}</el-header>
    <div v-if="pay">
      <el-row :gutter="0" style="font-size:1.4rem">
        <el-col :span="12" :offset="2">输入车牌号码:</el-col>
      </el-row>
      <el-row :gutter="0" style="margin-top:5%">
        <el-col :span="16" :offset="2">请输入车牌号进行缴费查询:</el-col>
      </el-row>
    </div>
    <div v-if="!pay">
      <el-row :gutter="0" style="font-size:1.4rem">
        <el-col :span="12" :offset="2">{{ merchantCouponsName }}:</el-col>
      </el-row>
      <el-row :gutter="0" style="margin-top:5%">
        <el-col :span="16" :offset="2">请输入车牌号领取优惠券:</el-col>
      </el-row>
    </div>
    <div>
      <keyboard ref="keyBoard" @confirmBtn="postCarNumber($event)" />
    </div>
    <div v-if="pay">
      <el-row v-for="item in carNumberList" :key="item.carNumber" :gutter="0" style="color:#ccc">
        <div id="lineDowm" />
        <el-col :span="2" :offset="2">
          <svg-icon icon-class="historyRecord" />
        </el-col>
        <el-col :span="10" :offset="0">
          <span style="letter-spacing:0.5em" @click="handleInput(item.carNumber)">{{ item.carNumber }}</span>
        </el-col>
        <el-col :span="3" :offset="7">
          <svg-icon icon-class="Close" @click="delHistoryopen=true" />
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="0" style="font-size:14px;margin-top:5%">
      <el-col :span="20" :offset="2">
        <el-button v-if="pay" type="primary" round style="width:100%" @click="handleQuery">查询</el-button>
        <el-button v-if="!pay" type="primary" round style="width:100%" @click="handleSubmit">领取</el-button>
      </el-col>
    </el-row>
    <div id="anbo-ad-st" />
    <div class="advwrap" />
    <!-- 删除弹出层开始 -->
    <el-dialog
      title="提示"
      :visible.sync="delHistoryopen"
      width="80%"
      center
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-row :gutter="0">
        <el-col :span="24" :offset="0" style="text-align:center;font-size:1.2rem">
          <svg-icon icon-class="info" style="color:aaa" />
          确定删除该记录？
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delHistory">确 定</el-button>
        <el-button @click="delHistoryopen=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { delCarNumberHistory, getCouponsDdata, getCoupons, getCarDetails, getLeaveData } from '@/api/qrcodeAccess/imprest'

import keyboard from '@/components/CarNumber/keyboard'

export default {
  components: {
    keyboard
  },
  data() {
    return {
      pay: '',
      parkName: '',
      merchantCouponsName: '',
      delHistoryopen: false,
      loading: false,
      parkId: '',
      mcId: '',
      // 要查询的车牌号
      carNumber: '',
      // 最近历史记录车牌号
      historyRecord: [],
      show: true,
      keyState: false,
      queryParams: {
        parkSn: '',
        couponsSn: ''
      }
    }
  },
  created() {
    // 取路由路径上的参数
    this.pay = this.$route.query && this.$route.query.pay === 'true' // 路由传参
    this.queryParams.parkSn = this.$route.query && this.$route.query.parkSn// 路由传参
    this.queryParams.sn = this.$route.query && this.$route.query.sn// 路由传参
    this.queryParams.couponsSn = this.$route.query && this.$route.query.couponsSn // 路由传参
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
      if (this.pay) {
        getLeaveData(this.queryParams).then(res => {
          this.parkId = res.data.park.id
          this.historyRecord = res.data.carNumberList
        })
      } else {
        getCouponsDdata(this.queryParams).then(res => {
          this.parkId = res.data.park.id
          this.mcId = res.data.merchantCoupons.id
          this.parkName = res.data.park.name
          this.merchantCouponsName = res.data.merchantCoupons.name
        })
      }
      this.loading = false// 关闭遮罩
    },
    handleQuery() {
      this.$refs.keyBoard.confirmBtnFn()
    },
    handleInput(val) {
      this.$refs.keyBoard.sonFun(val)
    },
    handleSubmit() {
      this.$refs.keyBoard.confirmBtnFn()
    },
    postCarNumber(val) {
      this.carNumber = val
      this.loading = true // 打开遮罩
      if (this.pay) {
        getCarDetails(this.parkId, { 'carNumber': this.carNumber }).then(res => {
          if (res.code === 200) {
            if (res.data.car) {
              if (res.data.isPay) {
                this.$router.push(`/qrcodeAccess/accessOutPayed?${res.data.url}parkName=${this.parkName}`)
              } else {
                this.$router.push(`/qrcodeAccess/accessOutNoPay?${res.data.url}parkName=${this.parkName}`)
              }
            } else {
              this.$router.push(`/qrcodeAccess/queryFails?${res.data.url}parkName=${this.parkName}`)
            }
          }
        })
      } else {
        getCoupons(this.parkId, this.mcId, { 'carNumber': this.carNumber }).then(res => {
          if (res.code === 200) {
            this.msgSuccess(res.msg)
          }
        })
      }
      this.loading = false// 关闭遮罩
    },
    delHistory() {
      delCarNumberHistory(this.parkId).then(res => {
        if (res.code === 200) {
          this.msgSuccess(res.msg)
        }
      })
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
    },
    exit() {
      this.keyState = false
    },
    getKey(val) {
      if (this.str.length >= 8 && val !== 'delete') {
        return false
      }
      if (val === 'delete') {
        this.str = this.str.slice(0, this.str.length - 1)
      } else {
        this.str += val
      }
    },
    confirm() {
      this.keyState = false
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
margin: 0 auto 5px;
height: 1px;
background-color: #dcdfe6;
}
</style>
