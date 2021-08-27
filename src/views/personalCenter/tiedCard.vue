<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
      绑卡设置
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <el-form ref="depotForm" :model="form" label-width="150px" style="width:750px">
        <el-form-item label="绑卡商户号" prop="name">
          <el-input v-model="form.name" placeholder="请输入绑卡商户号" />
        </el-form-item>
        <!-- 银行卡类型 -->
        <el-form-item label="银行卡类型" prop="category">
          <el-select v-model="form.category" placeholder="请选择银行卡类型">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 开户银行 -->
        <el-form-item label="开户银行" prop="category">
          <el-select v-model="form.category" placeholder="请选择开户银行">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号码" prop="idNumber">
          <el-input v-model="form.idNumber" placeholder="请输入银行卡号码" />
        </el-form-item>

        <el-tooltip class="item" effect="dark" content="我们会往您的账户打款0.5元以下的金额，请务必在确认到账后输入收款金额后 点击绑卡!" placement="bottom-start">
          <el-form-item label="收款金额" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入收款金额" />
          </el-form-item>
        </el-tooltip>

        <el-row :gutter="20">
          <el-form-item>
            <div class="footer">
              <el-button type="primary" @click="onSubmit">绑卡</el-button>
            </div>
          </el-form-item>
        </el-row>

      </el-form>
    </el-container>

  </el-container>

</template>
<script>
export default {
  name: 'TiedCard',
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
