<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="36px" style="padding:15px 0 45px;font-weight:700">
      完善资料
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <el-form ref="depotForm" :model="form" label-width="150px" style="width:750px">
        <!-- 名称 简称 -->
        <el-form-item label="注册类型" prop="category">
          <el-select v-model="form.category" placeholder="请选择注册类型">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="个人/法人姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入个人/法人姓名" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idNumber">
          <el-input v-model="form.idNumber" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="企业名称" prop="firmName">
          <el-input v-model="form.firmName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="验证码" prop="verificationCode">
              <el-input v-model="form.verificationCode" placeholder="验证码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="default" @click="getVerificationCode">
              获取验证码
              <el-button />
            </el-button></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-form-item>
            <div class="footer">
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button type="danger" @click="resetForm('depotForm')">重置</el-button>
            </div>
          </el-form-item>
        </el-row>

      </el-form>
    </el-container>

  </el-container>

</template>
<script>
export default {
  name: 'DepotInfo',
  data() {
    return {
      form: {
        name: '',
        sName: '',
        region: [],
        detailAddress: '',
        category: '',
        phone: '',
        remain: '',
        longitude: '',
        latitude: '',
        allPort: '',
        freePort: '',
        status: '1',
        connectMethod: '1',
        feeStatus: '1',
        procedureFee: '',
        parkingFee: '',
        chargingPile: '1',
        pertainRole: '',
        usable: '1',
        uploadMonitorPlatform: '1',
        monitorPlatform: '',
        PlatformIdentification: '',
        businessHours: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        remark: ''
      },
      categoryOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
    }
  },
  methods: {
    onSubmit() {
      // console.log('submit!')
    },
    // onReset(formName) {
    //   this.resetForm(formName)
    // },
    handleChange(value) {
      // console.log(value)
    },
    getVerificationCode() {
      this.$message('成功')
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
    display: -webkit-box;
     -webkit-box-pack:center;
}
.footer {
    margin-left: 50%;
    transform: translateX(-50%);
}
</style>
