<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
      自动到账设置
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <el-form :model="form" label-width="100px" style="width:500px" label-position="left">
        <el-row>
          <el-form-item label="手机号码" prop="legalpersonphone">
            <el-input v-model="form.legalpersonphone" placeholder="请输入手机号码" disabled />
          </el-form-item>
        </el-row>
        <!-- 如果自动到账未设置或状态不存在，则允许设置 -->
        <el-row v-show="!isautowithdraw || isautowithdraw===null">
          <el-col :span="19">
            <el-form-item label="验证码" prop="smscode">
              <el-input v-model="form.smscode" placeholder="请输入验证码" clearable />
            </el-form-item>
          </el-col>
          <!-- 如果已绑卡，则验证码可用 -->
          <el-col v-show="cardBindState===1" :span="5" class="verifyCode">
            <el-button type="primary" size="medium" :disabled="codeShow?false:true" @click="getVerificationCode">
              <span v-if="codeShow">获取验证码</span>
              <span v-if="!codeShow" class="count">{{ count }}秒后重试</span>
            </el-button>
          </el-col>
          <!-- 如果未绑卡或绑卡状态不存在，则验证码禁用并提示用户绑卡 -->
          <el-tooltip class="item" effect="dark" content="绑定银行卡后才可以进行到账设置！" placement="right">
            <el-col v-show="!cardBindState || cardBindState===null" :span="5" class="verifyCode">
              <el-button type="primary" size="medium" disabled>
                获取验证码
              </el-button>
            </el-col>
          </el-tooltip>
        </el-row>

        <el-row :gutter="20">
          <el-form-item>
            <div class="footer">
              <el-button v-show="!isautowithdraw || isautowithdraw===null" type="primary" :disabled="cardBindState===1?false:true" @click="onSubmit">提交</el-button>
              <el-button v-show="isautowithdraw===1" type="primary" disabled>已设置</el-button>
            </div>
          </el-form-item>
        </el-row>

      </el-form>
    </el-container>

  </el-container>

</template>
<script>
import { getDepotRegister } from '@/api/personalCenter/depotRegister'
import { autoWithdraw, autoWithdrawSms } from '@/api/personalCenter/intoAccountSet'

export default {
  name: 'IntoAccountSet',
  data() {
    return {
      // 到账设置状态
      isautowithdraw: '',
      // 绑卡状态 1代表已绑卡
      cardBindState: '',
      // 获取验证码按钮显示
      codeShow: true,
      //   计数器
      count: '',
      //   定时器
      timer: null,
      form: {
        // 用户id
        id: '',
        legalpersonphone: '',
        // 验证码
        smscode: '',
        seqno: ''
      }
    }
  },
  created() {
    // 获取个人信息
    this.init()
  },
  methods: {
    async init() {
      this.loading = true // 打开遮罩
      this.form.id = await this.getID()
      await getDepotRegister(this.form.id).then(res => {
        if (res.code === 200) {
          this.form.legalpersonphone = res.data.legalpersonphone
          this.cardBindState = res.data.isbind
          this.isautowithdraw = res.data.isautowithdraw
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      this.loading = true // 打开遮罩
      autoWithdraw(this.form).then(res => {
        this.msgSuccess(res.msg)
        this.init()
        this.loading = false // 关闭遮罩
      }).catch((res) => {
        this.msgError(res.msg)
        this.loading = false // 关闭遮罩
      })
    },
    getVerificationCode() {
      autoWithdrawSms(this.form.id).then(res => {
        this.msgSuccess(res.msg)
        this.form.seqno = res.data
      }).catch((res) => {
        this.msgError(res.msg)
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
    margin-left: 50%;
    transform: translateX(-50%);
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
