<template>
  <div id="app-container">
    <el-header style="text-align:center;margin-top:10%;height:50px;font-size:1.2rem">多威尔车场</el-header>
    <el-row :gutter="0" style="font-size:1.4rem">
      <el-col :span="12" :offset="2">输入车牌号码:</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:5%">
      <el-col :span="16" :offset="2">请输入车牌号进行缴费查询</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:10%;margin-left:-3%;border-radius: 4px!important;" border="true">
      <el-col :span="3" :offset="2" style="text-align:center">
        <el-input v-model="carNumber.carNumber1" class="inputClass" @focus="keyState = true" />
      </el-col>
      <el-col :span="3" :offset="0">
        <el-input v-model="carNumber.carNumber2" @focus="keyState = true" />
      </el-col>
      <el-col :span="3" :offset="0">
        <el-input v-model="carNumber.carNumber3" @focus="keyState = true" />
      </el-col>
      <el-col :span="3" :offset="0">
        <el-input v-model="carNumber.carNumber4" @focus="keyState = true" />
      </el-col>
      <el-col :span="3" :offset="0">
        <el-input v-model="carNumber.carNumber5" @focus="keyState = true" />
      </el-col>
      <el-col :span="3" :offset="0">
        <el-input v-model="carNumber.carNumber6" @focus="keyState = true" />
      </el-col>
      <el-col :span="3" :offset="0">
        <el-input v-model="carNumber.carNumber7" @focus="keyState = true" />
      </el-col>
    </el-row>
    <div id="anbo-ad-st" />
    <div class="advwrap" />
    <keyword :is-show="keyState" @exit="exit" @inputchange="getKey" @ok="confirm" />
  </div>
</template>
<script>
import keyword from '@/components/CarNumber/keyword'

export default {
  components: {
    keyword
  },
  data() {
    return {
      carNumber: {
        carNumber1: '',
        carNumber2: '',
        carNumber3: '',
        carNumber4: '',
        carNumber5: '',
        carNumber6: '',
        carNumber7: ''
      },
      keyState: false,
      str: ''
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
      if (this.str.length >= 7 && val !== 'delete') {
        return false
      }
      if (val === 'delete') {
        this.str = this.str.slice(0, this.str.length - 1)
        // this.carNumber['carNumber' + this.str.length + 1] = ''
        this.$set(this.carNumber, 'carNumber' + this.str.length, '')
      } else {
        this.str += val
        this.carNumber['carNumber' + this.str.length] = val
      }
    },
    confirm(e) {
      this.keyState = false
    }
  }
}
</script>
<style scoped>
.advwrap {
  height: 200px;
}
.el-input__inner{
    padding-left: 100px!important;
}

</style>
