<template>
  <div id="app-container">
    <!-- 计划将优惠券领取页面与之合并 -->
    <el-header style="text-align:center;margin-top:10%;height:50px;font-size:1.2rem">多威尔车场</el-header>
    <!-- <el-row :gutter="0" style="font-size:1.4rem">
      <el-col :span="12" :offset="2">输入车牌号码:</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:5%">
      <el-col :span="16" :offset="2">请输入车牌号进行缴费查询:</el-col>
    </el-row> -->
    <el-row :gutter="0" style="font-size:1.4rem">
      <el-col :span="12" :offset="2">全免费:</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:5%">
      <el-col :span="16" :offset="2">请输入车牌号领取优惠券:</el-col>
    </el-row>
    <div>
      <keyboard ref="keyBoard" @confirmBtn="postCarNumber($event)" />
    </div>
    <el-row :gutter="0" style="color:#ccc">
      <div id="lineDowm" />
      <el-col :span="2" :offset="2">
        <svg-icon icon-class="historyRecord" />
      </el-col>
      <el-col :span="10" :offset="0">
        <span style="letter-spacing:0.5em" @click="handleInput(historyRecord)">{{ historyRecord }}</span>
      </el-col>
      <el-col :span="3" :offset="7">
        <svg-icon icon-class="Close" @click="delHistoryopen=true" />
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:5%">
      <el-col :span="20" :offset="2">
        <!-- <el-button type="primary" round style="width:100%" @click="handleQuery">查询</el-button> -->
        <el-button type="primary" round style="width:100%" @click="handleQuery">领取</el-button>
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
import { delCarNumberHistory, getCouponsDdata } from '@/api/qrcodeAccess/imprest'

import keyboard from '@/components/CarNumber/keyboard'

export default {
  components: {
    keyboard
  },
  data() {
    return {
      delHistoryopen: false,
      loading: false,
      parkId: '',
      // 要查询的车牌号
      carNumber: '临NF00365',
      // 最近历史记录车牌号
      historyRecord: '皖A88888',
      show: true,
      keyState: false,
      queryParams: {
        parkSn: '',
        couponsSn: ''
      }
    }
  },
  created() {
    this.parkId = '340100202107124653'
    // 取路由路径上的参数
    // this.queryParams.cameraId = this.encode64(this.$route.params && this.$route.params.cameraId) // 路由传参
    this.queryParams.parkSn = this.$route.query && this.$route.query.parkSn// 路由传参
    this.queryParams.couponsSn = this.$route.query && this.$route.query.sn // 路由传参
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
      this.msgSuccess(this.queryParams)
      getCouponsDdata(this.queryParams).then(res => {
        this.msgSuccess(res.data)
      })
      this.loading = false// 关闭遮罩
    },
    handleQuery() {
      this.$refs.keyBoard.confirmBtnFn()
    },
    handleInput(val) {
      this.$refs.keyBoard.sonFun(val)
    },
    postCarNumber(val) {
      console.log(val)
    },
    delHistory() {
      delCarNumberHistory(this.queryParams).then(res => {
        // this.carNumber = res.data.carNumber
        // this.parkId = res.data.parkId
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
