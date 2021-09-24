<template>
  <div id="app-container">
    <el-header style="margin:10% 0 0 0;height:45px;font-size:1.2rem">
      <el-row :gutter="0">
        <el-col :span="12" :offset="1">无牌车</el-col>
      </el-row>
    </el-header>
    <el-row :gutter="0">
      <el-col :span="12" :offset="2">临时车牌号码:</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:30px">
      <el-col v-for="(item,index) in carNumber.split('')" :key="index" :span="2" :offset="index===0?5:0">
        <div class="carNumberWrap">
          <span>
            {{ item }}
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:10%">
      <el-col :span="22" :offset="2">温馨提示:离开时请在出口处扫码缴费。
      </el-col>
    </el-row>
    <el-row :gutter="0" style="font-size:14px;margin-top:3%">
      <el-col :span="22" :offset="2">
        <span>如有疑问请拨打客服电话:</span>
        <a href="tel:0551—65521987">0551—65521987</a>
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
      carNumber: '皖A88888'
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
.carNumberWrap {
  border: 1px solid #dcdfe6;
  text-align:center;
}
</style>
