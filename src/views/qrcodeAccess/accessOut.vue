<template>
  <div>
    <el-header style="text-align:center;margin-top:10%;height:50px;font-size:1.2rem">多威尔车场</el-header>
    <el-row :gutter="0" style="font-size:1.4rem">
      <el-col :span="12" :offset="2">输入车牌号码</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:5%">
      <el-col :span="16" :offset="2">请输入车牌号进行缴费查询</el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:10%;border-radius: 4px!important;" border="true">
      <el-col :span="2" :offset="5">
        <el-input v-model="carNumber1" @focus="keyState = true" />
      </el-col>
      <el-col :span="2" :offset="0">
        <el-input v-model="carNumber2" @focus="keyState = true" />
      </el-col>
      <el-col :span="2" :offset="0">
        <el-input v-model="carNumber3" @focus="keyState = true" />
      </el-col>
      <el-col :span="2" :offset="0">
        <el-input v-model="carNumber4" @focus="keyState = true" />
      </el-col>
      <el-col :span="2" :offset="0">
        <el-input v-model="carNumber5" @focus="keyState = true" />
      </el-col>
      <el-col :span="2" :offset="0">
        <el-input v-model="carNumber6" @focus="keyState = true" />
      </el-col>
      <el-col :span="2" :offset="0">
        <el-input v-model="carNumber7" @focus="keyState = true" />
      </el-col>
    </el-row>
    <keyword :is-show="keyState" :oinp="str" @exit="exit" @inputchange="getKey" @ok="confirm" />
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
      carNumber1: '',
      carNumber2: '',
      carNumber3: '',
      carNumber4: '',
      carNumber5: '',
      carNumber6: '',
      carNumber7: '',
      keyState: false,
      str: ''
    }
  },
  methods: {
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
    confirm(e) {
      this.keyState = false
    }
  }
}
</script>
