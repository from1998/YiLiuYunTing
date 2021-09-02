<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
      绑卡设置
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <el-form :model="form" label-width="150px" style="width:550px" label-position="left">
        <el-form-item label="绑卡商户号" prop="name">
          <el-input v-model="form.sonmerno" placeholder="请输入绑卡商户号" disabled />
        </el-form-item>
        <!-- 银行卡类型 -->
        <el-form-item label="银行卡类型" prop="cardtype">
          <el-select v-model="form.cardtype" placeholder="请选择银行卡类型" style="width:400px">
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
          <el-select v-model="form.bankno" placeholder="请选择开户银行" style="width:400px">
            <el-option
              v-for="item in bankList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号码" prop="cardno">
          <el-input v-model="form.cardno" placeholder="请输入银行卡号码" />
        </el-form-item>
        <el-row>
          <el-col :span="20">
            <el-tooltip class="item" effect="dark" content="我们会往您的账户打款0.5元以下的金额，请务必在确认到账后输入收款金额后 点击绑卡!" placement="bottom-start">
              <el-form-item label="收款金额" prop="account">
                <el-input v-model="form.account" placeholder="请输入收款金额" :disabled="cardBindState===1?true:false" />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="4" class="verifyCode">
            <el-button v-show="cardBindState===null" type="primary" size="medium" :disabled="codeShow?false:true" @click="getAccount">
              <span v-if="codeShow">发起打款</span>
              <span v-if="!codeShow" class="count">{{ count }}秒后重试</span>
            </el-button>
            <el-button v-show="cardBindState===1" type="primary" disabled>发起打款</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <div class="footer">
              <el-button v-show="cardBindState===null" type="primary" @click="onSubmit">绑卡</el-button>
              <el-button v-show="cardBindState===1" type="primary" disabled>已绑卡</el-button>
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

export default {
  name: 'TiedCard',
  data() {
    return {
      // 用户id
      id: '',
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
        sonmerno: '',
        cardtype: '',
        bankno: '',
        cardno: '',
        account: ''
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
    async init() {
      this.loading = true // 打开遮罩
      this.id = await this.getID()
      await getDepotRegister(this.id).then(res => {
        if (res.code === 200) {
          this.form.sonmerno = res.data.sonmerno
          this.cardBindState = res.data.isbind
          this.registerstatus = res.data.registerstatus
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      // console.log(this.form)
      this.loading = true // 打开遮罩
      bindCard(this.form).then(res => {
        this.msgSuccess(res.msg)
        this.init()
        this.loading = false // 关闭遮罩
      }).catch((res) => {
        this.msgError(res.msg)
        this.loading = false // 关闭遮罩
      })
    },
    getAccount() {
      sponsorRemit(this.form).then(res => {
        this.msgSuccess(res.msg)
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
