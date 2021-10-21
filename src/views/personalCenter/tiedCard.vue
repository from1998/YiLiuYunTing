<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
      绑卡设置
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <div v-if="registerstatus!==1" class="error">
        <el-row :gutter="20">
          <el-button
            type="warning"
            circle
            class="warningBtn"
            style="max-height: 66px"
          >
            <i class="el-icon-warning-outline" style="font-size: 40px;" />
          </el-button>
          <p>
            身份认证未通过，无法进行绑卡设置。
          </p>
          <el-button type="primary" class="goBack" @click="goIdentityAuth">转到身份认证</el-button>
        </el-row>
      </div>
      <el-form v-if="registerstatus===1" ref="form" :model="form" label-width="150px" style="width:550px" label-position="left" :disabled="cardBindState===1?true:false" :rules="rules">
        <el-form-item label="绑卡商户号" prop="sonmerno">
          <el-input v-model="form.sonmerno" placeholder="请输入绑卡商户号" disabled />
        </el-form-item>
        <!-- 银行卡类型 -->
        <el-form-item label="银行卡类型" prop="cardtype">
          <el-select v-model="form.cardtype" placeholder="请选择银行卡类型" style="width:400px" clearable @change="submitTitleChange">
            <el-option
              v-for="item in cardOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <!-- 开户银行 -->
        <el-form-item label="开户银行" prop="bankno">
          <el-select v-model="form.bankno" placeholder="请选择开户银行" style="width:400px" clearable>
            <el-option
              v-for="item in bankList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号码" prop="cardno">
          <el-input v-model="form.cardno" placeholder="请输入银行卡号码" clearable />
        </el-form-item>
        <div v-if="form.cardtype===0">
          <el-form-item label="银行预留手机号码" prop="legalpersonphone">
            <el-input v-model="form.legalpersonphone" placeholder="请输入银行预留手机号码" clearable />
          </el-form-item>
          <el-form-item label="持卡人姓名" prop="legalpersonname">
            <el-input v-model="form.legalpersonname" placeholder="请输入持卡人姓名" clearable />
          </el-form-item>
          <el-form-item label="持卡人身份证号码" prop="idnumber">
            <el-input v-model="form.idnumber" placeholder="请输入持卡人身份证号码" clearable />
          </el-form-item>
        </div>
        <el-row>
          <el-col :span="20">
            <el-tooltip v-if="form.cardtype===1" class="item" effect="dark" content="我们会往您的账户打款0.5元以下的金额，请务必在确认到账后输入收款金额后 点击绑卡!" placement="bottom-start">
              <el-form-item label="收款金额" prop="account">
                <el-input v-model="form.account" placeholder="请输入收款金额" :disabled="cardBindState===1?true:false" clearable />
              </el-form-item>
            </el-tooltip>
            <el-form-item v-if="form.cardtype===0" label="验证码" prop="smscode">
              <el-input v-model="form.smscode" placeholder="请输入验证码" :disabled="cardBindState===1?true:false" clearable />
            </el-form-item>
          </el-col>
          <el-col v-if="form.cardtype!==null" :span="4" class="verifyCode">
            <el-button v-if="cardBindState===null" type="primary" size="medium" :disabled="codeShow?false:true" @click="getAccount">
              <span v-if="codeShow">
                {{ submitTitle }}
              </span>
              <span v-if="!codeShow" class="count">{{ count }}秒后重试</span>
            </el-button>
            <el-button v-if="cardBindState===1" type="primary">
              {{ submitTitle }}
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <div class="footer">
              <el-button v-if="cardBindState===null" type="primary" @click="onSubmit">绑卡</el-button>
              <el-button v-if="cardBindState===1" type="primary" disabled>已绑卡</el-button>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </el-container>

  </el-container>

</template>
<script>
import { getDepotRegister } from '@/api/personalCenter/depotRegister'
import { getBankList, bindCard, sponsorRemit } from '@/api/personalCenter/tiedCard'

import validate from '@/utils/validate'

export default {
  name: 'TiedCard',
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        legalpersonphone: validate.phone,
        idnumber: validate.idNumber,
        sonmerno: validate.notEmpty,
        legalpersonname: validate.notEmpty,
        cardno: validate.notEmpty,
        bankno: validate.notEmpty,
        smscode: validate.notEmpty,
        cardtype: validate.notEmpty,
        account: validate.notEmpty
      },
      submitTitle: '发起打款',
      // 认证状态
      registerstatus: '',
      // 绑卡状态
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
        sonmerno: '',
        cardtype: '',
        bankno: '',
        cardno: '',
        legalpersonphone: '',
        idnumber: '',
        legalpersonname: '',
        // 企业打款金额
        account: '',
        // 个人验证码
        smscode: '',
        seqno: ''
      },
      cardOptions: [],
      bankList: []
    }
  },
  created() {
    // 获取银行卡类型字典数据
    this.getDataByType('CardTypeDic').then(res => {
      this.cardOptions = res.data
    })
    // 获取银行列表
    getBankList().then(res => {
      this.bankList = res.data
    })
    // 获取个人信息
    this.init()
  },
  methods: {
    goIdentityAuth() {
      this.$router.push('/personalCenter/identityAuth')
    },
    async init() {
      this.loading = true // 打开遮罩
      this.form.id = await this.getUserInfo().id
      await getDepotRegister(this.form.id).then(res => {
        if (res.code === 200 && res.data !== null) {
          this.form = res.data
          this.cardBindState = res.data.isbind
          this.registerstatus = res.data.registerstatus
          this.submitTitleChange(res.data.cardtype)
        }
        this.loading = false // 关闭遮罩
      })
    },
    submitTitleChange(val) {
      if (val === 0) {
        this.submitTitle = '获取验证码'
      } else {
        this.submitTitle = '发起打款'
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        this.msgSuccess(valid)
        if (valid) {
          this.loading = true // 打开遮罩
          bindCard(this.form).then(res => {
            this.msgSuccess(res.msg)
            this.init()
          })
          this.loading = false // 关闭遮罩
        }
      })
    },
    getAccount() {
      sponsorRemit(this.form).then(res => {
        this.msgSuccess(res.msg)
        this.form.seqno = res.data
      }).catch((res) => {
        this.msgError(res.msg)
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
  display: inline-block;
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
.error {
display: flex;
margin-top: 50px;
height: 100px;
font-size: 20px;
    .warningBtn {
      margin: 0 auto 50px;
      width: 66px;
      display: block;
      min-height: 66px;
      min-width: 66px;
      cursor: default;
    }
    .goBack {
      margin: 30px auto 0;
      display: block;
    }
}
</style>
