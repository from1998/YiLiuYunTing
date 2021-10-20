<template>
  <div id="app-container">
    <el-row :gutter="0" style="height:45px;margin-top:10%;font-size:1.2rem">
      <el-col :span="20" :offset="2" style="color:#E6A23C">无牌车</el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="12" :offset="2">临时车牌号码:</el-col>
    </el-row>
    <el-row :gutter="0" style="margin:30px 0 0 4%">
      <el-col v-for="(item,index) in carNumber.split('')" :key="index" :span="3" :offset="index===0?1:0">
        <div class="carNumberWrap">
          <span :class="`carNumber${index}`">
            {{ item }}
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:10%">
      <el-col :span="22" :offset="2">{{ `进场信息：${message}` }}
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:10%">
      <el-col :span="22" :offset="2">温馨提示:离开时请在出口处扫码缴费。
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:3%">
      <el-col :span="22" :offset="2">
        <span>如有疑问请拨打客服电话:</span>
        <a href="tel:0551—65521987" style="color:#409EFF">0551—65521987</a>
      </el-col>
    </el-row>
    <div id="anbo-ad-st" />
    <div class="advwrap" />
  </div>
</template>
<script>
import { getEnterData } from '@/api/qrcodeAccess/accessIn'

export default {

  data() {
    return {
      loading: false,
      parkId: '',
      message: '',
      carNumber: '皖A12345',
      queryParams: {
        cameraId: '',
        sn: ''
      }
    }
  },
  created() {
    // 取路由路径上的参数
    // this.queryParams.cameraId = this.encode64(this.$route.params && this.$route.params.cameraId) // 路由传参
    this.queryParams.cameraId = this.$route.query && this.$route.query.cameraId// 路由传参
    this.queryParams.sn = this.$route.query && this.$route.query.sn // 路由传参
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
      getEnterData(this.queryParams).then(res => {
        this.carNumber = res.data.carNumber
        this.parkId = res.data.parkId
        this.message = res.data.message
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
    margin:auto;
    margin-top: 50px;
  width: 90%;
}
.carNumberWrap {
  height:5vh;
  line-height: 5vh;
  border: 1px solid #dcdfe6;
  text-align:center;
  background-color: #002DAA;
  color: #fff;
}
.carNumber1 {
  display: inline-block;
  border-right: 1px solid #fff;
}
</style>
