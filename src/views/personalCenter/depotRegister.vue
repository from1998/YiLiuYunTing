<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
      车场注册
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <el-form ref="registerForm" :model="form" label-width="150px" style="width:500px">
        <!-- 注册类型 -->
        <el-form-item label="注册类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择注册类型" clearable>
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
          <el-input v-model="form.legalpersonname" placeholder="请输入个人/法人姓名" />
        </el-form-item>
        <!-- 身份证号码 -->
        <el-form-item label="身份证号码" prop="idnumber">
          <el-input v-model="form.idnumber" placeholder="请输入身份证号码" />
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机号码" prop="legalpersonphone">
          <el-input v-model="form.legalpersonphone" placeholder="请输入手机号码" />
        </el-form-item>
        <!-- 企业名称 -->
        <el-form-item v-if="form.type===1" label="企业名称" prop="merchantname">
          <el-input v-model="form.merchantname" placeholder="请输入企业名称" />
        </el-form-item>
        <!-- 用户协议 -->
        <el-form-item prop="userProtocolState">
          <span slot="label">确认<el-link type="primary" :underline="false" @click="ConfirmAgreementOpen = true">用户协议</el-link></span>
          <el-switch
            v-model="form.userProtocol"
            :active-text="form.userProtocol?'同意':'暂不接受'"
          />
        </el-form-item>
        <!-- 验证码 -->
        <el-row>
          <el-col :span="16">
            <el-form-item label="验证码" prop="registersmscode">
              <el-input v-model="form.registersmscode" placeholder="请输入验证码" />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="verifyCode">
            <el-button type="primary" size="medium" :disabled="codeShow?false:true" @click="getVerificationCode">
              <span v-if="codeShow">获取验证码</span>
              <span v-if="!codeShow" class="count">{{ count }}秒后重试</span>
            </el-button>
          </el-col>
        </el-row>

        <el-row>
          <div class="footer">
            <el-button type="primary" :disabled="!form.userProtocol" @click="onSubmit">提交</el-button>
            <el-button type="danger" @click="resetForm('registerForm')">重置</el-button>
            <el-button type="primary">
              <router-link to="/personalCenter/identityAuth">
                去认证
              </router-link>
            </el-button>
          </div>
        </el-row>

      </el-form>
      <!-- 确认协议对话框 -->
      <el-dialog
        title="用户协议"
        :visible.sync="ConfirmAgreementOpen"
        width="900px"
        center
      >
        <p>
          这里是用户协议
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ConfirmAgreementOpen = false">关 闭</el-button>
        </span>
      </el-dialog>
    </el-container>
  </el-container>

</template>
<script>
import { getDepotRegister, addDepotRegister, registerSmsCode } from '@/api/personalCenter/depotRegister'

export default {
  legalpersonname: 'DepotRegister',
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 用户协议弹窗
      ConfirmAgreementOpen: false,
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
        userProtocol: true,
        registersmscode: ''
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
      await getDepotRegister(this.form.managerid).then(res => {
        this.resdata = res.data
        if (res.data !== null) {
          this.form = res.data
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      this.loading = true // 打开遮罩
      addDepotRegister(this.form).then(res => {
        this.msgSuccess('注册成功')
        this.init()
        console.log(this.form)
        this.loading = false // 关闭遮罩
      }).catch(() => {
        this.msgError('注册失败')
        this.loading = false // 关闭遮罩
      })
    },
    // onReset(formName) {
    //   this.resetForm(formName)
    // },
    handleChange(value) {
      // console.log(value)
    },
    getVerificationCode() {
      registerSmsCode(this.form).then(res => {
        this.msgSuccess(res.msg)
      }).catch(() => {
        this.msgError('获取验证码失败')
      })
      const TIME_COUNT = 6
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
    el-button {
        border-radius: 0!important;
    }
}
.count {
    cursor:not-allowed;
}
</style>
