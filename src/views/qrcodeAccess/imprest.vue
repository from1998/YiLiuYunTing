<template>
  <div id="app-container">
    <el-header style="text-align:center;margin-top:10%;height:50px;font-size:1.2rem">多威尔车场</el-header>
    <el-row :gutter="0" style="font-size:1.4rem">
      <el-col :span="12" :offset="2">输入车牌号码:</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:5%">
      <el-col :span="16" :offset="2">请输入车牌号进行缴费查询:</el-col>
    </el-row>
    <div>
      <keyboard />
    </div>
    <el-row :gutter="0" style="">
      <div id="lineDowm" />
      <el-col :span="2" :offset="2">
        <svg-icon icon-class="historyRecord" />
      </el-col>
      <el-col :span="8" :offset="2">
        <svg-icon icon-class="historyRecord" />
      </el-col>
    </el-row>
    <div id="anbo-ad-st" />
    <div class="advwrap" />
  </div>
</template>
<script>
// import { delCarNumberHistory } from '@/api/qrcodeAccess/imprest'

import keyboard from '@/components/CarNumber/keyboard'

export default {
  components: {
    keyboard
  },
  data() {
    return {
      loading: false,
      parkId: '',
      // 要查询的车牌号
      carNumber: '临NF00365',
      // 最近历史记录车牌号
      historyRecord: '皖A88888',
      show: true,
      keyState: false
    }
  },
  created() {
    this.parkId = '340100202107124653'
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
