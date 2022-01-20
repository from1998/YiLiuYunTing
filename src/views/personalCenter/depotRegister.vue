<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
      车场注册
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <el-form ref="registerForm" :model="form" label-width="150px" style="width:500px" label-position="left" :rules="rules">
        <!-- 注册类型 -->
        <el-form-item label="注册类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择注册类型" clearable style="width:350px" :disabled="flag">
            <el-option
              v-for="item in categoryOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <!-- 个人/法人姓名 -->
        <el-form-item prop="legalpersonname">
          <span slot="label">
            <span v-show="form.type===''">个人/法人姓名</span>
            <span v-show="form.type===1">法人姓名</span>
            <span v-show="form.type===2">个人姓名</span>
            <span v-show="form.type===3">个体工商户姓名</span>
          </span>
          <el-input v-model="form.legalpersonname" placeholder="请输入个人/法人姓名" :disabled="flag" />
        </el-form-item>
        <!-- 身份证号码 -->
        <el-form-item label="身份证号码" prop="idnumber">
          <el-input v-model="form.idnumber" placeholder="请输入身份证号码" :disabled="flag" />
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机号码" prop="legalpersonphone">
          <el-input v-model="form.legalpersonphone" placeholder="请输入手机号码" :disabled="flag" />
        </el-form-item>
        <!-- 企业名称 -->
        <el-form-item v-if="form.type===1" label="企业名称" prop="merchantname">
          <el-input v-model="form.merchantname" placeholder="请输入企业名称" :disabled="flag" />
        </el-form-item>
        <!-- 验证码 -->
        <el-row v-show="form.registerstatus !== 2">
          <el-col :span="19">
            <el-form-item label="验证码" prop="registersmscode">
              <el-input v-model="form.registersmscode" placeholder="请输入验证码" :disabled="flag" />
            </el-form-item>
          </el-col>

          <el-col v-show="form.registerstatus !== 1" :span="5" class="verifyCode">
            <el-button type="primary" size="medium" :disabled="codeShow?false:true" @click="getVerificationCode">
              <span v-if="codeShow">获取验证码</span>
              <span v-if="!codeShow" class="count">{{ count }}秒后重试</span>
            </el-button>
          </el-col>
        </el-row>

        <el-row class="footer">
          <el-button v-show="form.registerstatus === null" type="primary" @click="onSubmit">提交</el-button>
          <el-button v-show="form.registerstatus !== null" disabled type="primary">已提交{{ form }}</el-button>
          <el-button v-show="form.registerstatus === 2 && form.isconfirmprotocol !== 1" type="primary" @click="confirmAgreement">确认协议</el-button>
          <el-button v-show="form.registerstatus === 2 && form.isconfirmprotocol !== 1" type="primary" @click="syncAgreement">同步协议</el-button>
          <el-button v-show="form.isconfirmprotocol === 1" type="primary" disabled>已确认协议</el-button>
          <el-button v-show="form.registerstatus === 1" type="primary" disabled>已认证</el-button>
          <el-button v-show="form.isconfirmprotocol === 1 && form.registerstatus === 2" type="primary">
            <router-link to="/personalCenter/identityAuth">
              去认证
            </router-link>
          </el-button>
        </el-row>

      </el-form>
      <!-- 隐藏表单 -->
      <form id="confirmForm" action="" method="post" target="_blank">
        <input id="confirmVersion" name="version" style="display: none">
        <input id="confirmNotifyUrl" name="notifyUrl" style="display: none">
        <input id="confirmTimestamp" name="timestamp" style="display: none">
        <input id="confirmApiContent" name="apiContent" style="display: none">
        <input id="confirmSignType" name="signType" style="display: none">
        <input id="confirmSign" name="sign" style="display: none">
        <input id="confirmMerNo" name="merNo" style="display: none">
      </form>
    </el-container>
  </el-container>

</template>
<script>
import { getDepotRegister, addDepotRegister, registerSmsCode, getConfirmPage, getConfirmStatus } from '@/api/personalCenter/depotRegister'
import validate from '@/utils/validate'

export default {
  legalpersonname: 'DepotRegister',
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        legalpersonphone: validate.phone,
        idnumber: validate.idNumber,
        type: validate.notEmpty,
        legalpersonname: validate.notEmpty,
        merchantname: validate.notEmpty,
        registersmscode: validate.notEmpty
      },
      flag: false,
      id: '',
      // 是否启用遮罩层
      loading: false,
      // 获取验证码按钮显示
      codeShow: true,
      //   计数器
      count: '',
      //   定时器
      timer: null,
      form: {
        type: '',
        legalpersonname: '',
        idnumber: '',
        legalpersonphone: '',
        merchantname: '',
        registersmscode: '',
        registerstatus: null
      },
      categoryOptions: []
    }
  },
  created() {
    // 获取注册类型字典数据
    this.getDataByType('SqRegisterDic').then(res => {
      this.categoryOptions = res.data
    })
    // 获取注册信息
    this.init()
  },
  methods: {
    async init() {
      this.loading = true // 打开遮罩
      this.id = await this.getUserInfo().id
      await getDepotRegister(this.id).then(res => {
        this.resdata = res.data
        if (res.data !== null) {
          this.form = res.data
          if (res.data.registerstatus !== null) {
            this.flag = true
            this.codeShow = true
          }
        }
        console.log(this.form)
        this.loading = false // 关闭遮罩
      })
    },
    confirmAgreement() {
      getConfirmPage(this.id).then(res => {
        if (res.code === 200) {
          this.confirmForm = res.params
          document.getElementById('confirmForm').action = res.actionUrl
          document.getElementById('confirmVersion').value = res.params.version
          document.getElementById('confirmMerNo').value = res.params.merNo
          document.getElementById('confirmSign').value = res.params.sign
          document.getElementById('confirmSignType').value = res.params.signType
          document.getElementById('confirmApiContent').value = res.params.apiContent
          document.getElementById('confirmTimestamp').value = res.params.timestamp
          document.getElementById('confirmNotifyUrl').value = res.params.notifyUrl
          document.getElementById('confirmForm').submit()
        }
      })
    },
    // 同步协议状态
    syncAgreement() {
      getConfirmStatus(this.id).then(res => {
        this.init()
      })
    },
    onSubmit() {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          this.loading = true // 打开遮罩
          addDepotRegister(this.form).then((res) => {
            this.msgSuccess(res.msg)
            this.init()
          })
          this.loading = false // 关闭遮罩
        }
      })
    },
    getVerificationCode() {
      registerSmsCode(this.form).then(res => {
        this.msgSuccess(res.msg)
      })
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
  margin-bottom: 5%;
    margin-left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
        el-button {
        flex: 1;
    }
}
.verifyCode {
  padding: 0;
    el-button {
        border-radius: 0!important;
    }
}
.count {
    cursor:not-allowed;
}
</style>
