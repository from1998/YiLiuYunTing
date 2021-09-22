<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <span>输入车牌号码</span>
        <el-input v-model="idnumber" placeholder="请输入持卡人身份证号码" clearable />
      </el-col>
    </el-row>

  </div>
</template>
<script>
// 引入api
import { getEnterData } from '@/api/qrcodeAccess/accessIn'
export default {
  // 定义页面数据
  data() {
    return {
      idnumber: '',
      form: {
        sn: '',
        cameraId: '',
        platFormUserId: '',
        platForm: ''
      }
    }
  },
  // 勾子
  created() {
    this.getData()
    this.sn = this.$route.params.sn
    this.cameraId = this.$route.params.cameraId
    this.platFormUserId = this.$route.params.platFormUserId
    this.platForm = this.$route.params.platForm
  },
  // 方法
  methods: {
    // 查询数据
    getData() {
      this.loading = true // 打开遮罩
      getEnterData(this.form).then(res => {
        this.userTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    }
  }
}
</script>
<style scoped>

</style>
