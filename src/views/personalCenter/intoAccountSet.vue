<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
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
        <el-row>
          <el-col :span="16">
            <el-form-item label="验证码" prop="verificationCode">
              <el-input v-model="form.verificationCode" placeholder="请输入验证码" />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="verifyCode">
            <el-button type="primary" size="medium" :disabled="codeShow?false:true" @click="getVerificationCode">
              <span v-if="codeShow">获取验证码</span>
              <span v-if="!codeShow" class="count">{{ count }}秒后重试</span>
            </el-button>
          </el-col>
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
  name: 'IntoAccountSet',
  data() {
    return {
      // 获取验证码按钮显示
      codeShow: true,
      //   计数器
      count: '',
      //   定时器
      timer: null,
      form: {
        category: '',
        name: '',
        idNumber: '',
        phone: '',
        firmName: '',
        verificationCode: ''

      },
      categoryOptions: [{
        value: '1',
        label: '公司'
      }, {
        value: '2',
        label: '个人'
      }, {
        value: '3',
        label: '个体工商户'
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
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.codeShow = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.codeShow = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
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
.verifyCode {
    el-button {
        border-radius: 0!important;
    }
}
.count {
    cursor:not-allowed;
}
</style>
