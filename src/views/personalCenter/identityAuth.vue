<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
      身份认证
      <el-button v-show="authentication" type="success" icon="el-icon-success" size="mini">已认证</el-button>
      <el-button v-show="!authentication" type="info" icon="el-icon-info" size="mini">未认证</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container class="container">

      <el-form ref="depotForm" :model="form" label-width="150px" style="width:1000px">
        <el-row :gutter="50">
          <el-col :span="12">
            <!-- 注册类型 -->
            <el-form-item label="注册类型">
              <el-input v-model="options.category.label" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人/法人姓名">
              <el-input v-model="options.name" disabled />
              <span slot="label">
                <span v-show="options.category.value===''">个人/法人姓名</span>
                <span v-show="options.category.value==='1'">法人姓名</span>
                <span v-show="options.category.value==='2'">个人姓名</span>
                <span v-show="options.category.value==='3'">个体工商户姓名</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="options.phone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="idNumber">
              <el-input v-model="options.idNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="身份证是否长期" prop="IDCardLongtime">
              <el-tooltip class="item" effect="dark" content="请选择身份证有效期状态" placement="right">
                <el-switch
                  v-model="form.IDCardLongtime"
                  :active-text="form.IDCardLongtime?'长期':'非长期'"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col v-if="!form.IDCardLongtime" :span="12">
            <el-form-item label="有效期限截至日期" prop="IDCardExpiryTime">
              <el-date-picker
                v-model="form.IDCardExpiryTime"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传证件照片 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="身份证正面照" prop="IDCardFront">
              <upload-img />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证反面照" prop="IDCardReverse">
              <upload-img />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手持身份证照片" prop="IDCardHandheld">
              <upload-img />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商户全称与简称 -->
        <el-row v-show="options.category.value!=='2'" :gutter="50">
          <el-col :span="12">
            <el-form-item label="商户全称" prop="merchantName">
              <el-input v-model="form.merchantName" placeholder="请输入商户全称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户简称" prop="merchantSname">
              <el-input v-model="form.merchantSname" placeholder="请输入商户简称" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商户电话与营业地址 -->
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="商户电话" prop="merchantPhone">
              <el-input v-model="form.merchantPhone" placeholder="请输入商户电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业地址" prop="businessAddress">
              <el-input v-model="form.businessAddress" placeholder="请输入营业地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 营业执照类型与统一社会信用代码 -->
        <el-row v-show="options.category.value!=='2'" :gutter="50">
          <el-col :span="12">
            <el-form-item label="营业执照类型" prop="licenseCategory">
              <el-select v-model="form.licenseCategory" placeholder="请选择营业执照类型" clearable>
                <el-option
                  v-for="item in licenseCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="socialCreditCode">
              <el-input v-model="form.socialCreditCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 营业执照是否长期 -->
        <el-row v-show="options.category.value!=='2'" :gutter="50">
          <el-col :span="12">
            <el-form-item label="营业执照是否长期" prop="licenseLongtime">
              <el-tooltip class="item" effect="dark" content="请选择营业执照有效期状态" placement="right">
                <el-switch
                  v-model="form.licenseLongtime"
                  :active-text="form.licenseLongtime?'长期':'非长期'"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col v-if="!form.licenseLongtime" :span="12">
            <el-form-item label="有效期限截至日期" prop="licenseExpiryTime">
              <el-date-picker
                v-model="form.licenseExpiryTime"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 注册资本与经营范围 -->
        <el-row v-show="options.category.value!=='2'" :gutter="50">
          <el-col :span="12">
            <el-form-item label="注册资本(万元)" prop="registeredCapital">
              <el-tooltip class="item" effect="dark" content="请输入注册资本(万元)" placement="right">
                <el-input-number v-model="form.registeredCapital" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围" prop="businessScope">
              <el-input v-model="form.businessScope" placeholder="请输入经营范围" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传企业证件照片 -->
        <el-row :gutter="50">
          <el-col :span="6">
            <el-form-item label="营业执照" prop="license">
              <upload-img />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="税务登记证副本" prop="taxCertificate ">
              <upload-img />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="组织结构代码证副本" prop="organizationCodeCertificate">
              <upload-img />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="银行开户许可证" prop="bankAccountPermit">
              <upload-img />
            </el-form-item>
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
import UploadImg from '@/components/UploadImg/index.vue'

export default {
  name: 'IdentityAuth',
  components: {
    UploadImg
  },
  data() {
    return {
      // 用户认证状态,
      authentication: false,
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
        handHeld: [],
        IDCardLongtime: false,
        IDCardExpiryTime: [],
        merchantName: '',
        merchantSname: '',
        merchantPhone: '',
        businessAddress: '',
        licenseCategory: '',
        socialCreditCode: '',
        licenseLongtime: false,
        licenseExpiryTime: [],
        registeredCapital: undefined,
        businessScope: '',
        license: [],
        taxCertificate: [],
        organizationCodeCertificate: [],
        bankAccountPermit: []

      },
      licenseCategoryOptions: [
        {
          label: '普通营业执照',
          value: '1'
        }, {
          label: '三证合一营业执照',
          value: '2'
        }
      ],
      options: {
        category: {
          label: '公司',
          value: '1'
        },
        name: '金仁宏',
        phone: '16655077897         ',
        idNumber: '342901197210235615'
      }
    }
  },
  methods: {
    onSubmit() {
      // console.log('submit!')
    },
    // onReset(formName) {
    //   this.resetForm(formName)
    // },
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
.verificationCode {
    el-button {
        border-radius: 0!important;
    }
}
.el-button--mini {
  padding: 0 5px!important;
  height: 17px;
}
</style>
