<template>
  <div id="app-container">
    <el-header style="text-align:center;margin-top:10%;height:50px;font-size:1.2rem">多威尔车场</el-header>
    <el-row :gutter="0" style="font-size:1.4rem">
      <el-col :span="12" :offset="2">输入车牌号码:</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:5%">
      <el-col :span="16" :offset="2">请输入车牌号进行缴费查询</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:10%;">
      <el-col :span="20" :offset="2">
        <div id="home_input">
          <el-input v-model="str" @focus="keyState = true" />
          <!-- 边框1-6 -->
          <div id="fixedBorder1" class="fixedBorder" />
          <div id="fixedBorder2" class="fixedBorder" />
          <div id="fixedBorder3" class="fixedBorder" />
          <div id="fixedBorder4" class="fixedBorder" />
          <div id="fixedBorder5" class="fixedBorder" />
          <div id="fixedBorder6" class="fixedBorder" />
        </div>
      </el-col>
    </el-row>
    <div id="anbo-ad-st" />
    <div class="advwrap" />
    <div>
      <keyboard />
    </div>
  </div>
</template>
<script>
import keyboard from '@/components/CarNumber/keyboard'

export default {
  components: {
    keyboard
  },
  data() {
    return {
      show: true,
      keyState: false
    }
  },
  watch: {
    carNumber: {
      handler(val) {
        console.log(val)
        // console.log(this.resdata)
        if (val !== this.resdata) {
          this.SubmitTitle = '提交'
        }
      },
      deep: true
    }
  },
  mounted() {
    // http://anbo-test.anbokeji.net/engine/init
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
    },
    exit() {
      this.keyState = false
    },
    getKey(val) {
      console.log(val)
      if (this.str.length >= 7 && val !== 'delete') {
        return false
      }
      if (val === 'delete') {
        this.str = this.str.slice(0, this.str.length - 1)
        // this.carNumber['carNumber' + this.str.length + 1] = ''
        // this.$set(this.carNumber, 'carNumber' + this.str.length, '')
        // val = ''
      } else {
        this.str += val
      }
    },
    confirm(e) {
      this.keyState = false
    }
  }
}
</script>
<style css>
.advwrap {
  height: 200px;
}
#home_input {
  position: relative;
}
#home_input .el-input__inner{
  /* padding-left: 0!important; */
    letter-spacing: 2.53em!important;
}
#home_input .fixedBorder {
  width: 0.08rem;
  height: 2.2rem;
  background-color: #dcdfe6;
  position: absolute;
  top: 0%;
  left: 12vw;
}
#home_input #fixedBorder2 {
  left: 24vw;
}
#home_input #fixedBorder3 {
  left: 36vw;
}
#home_input #fixedBorder4 {
  left: 48vw;
}
#home_input #fixedBorder5 {
  left: 60vw;
}
#home_input #fixedBorder6 {
  left: 72vw;
}
</style>
