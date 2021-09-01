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

        <el-row>
          <el-col :span="19">
            <el-form-item label="验证码" prop="seqno">
              <el-input v-model="form.seqno" placeholder="请输入验证码" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="verifyCode">
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
    el-button {
        border-radius: 0!important;
    }
}
.count {
    cursor:not-allowed;
}
</style>
