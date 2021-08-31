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
              <el-select v-model="options.registerInfo.type" placeholder="请选择注册类型" clearable disabled>
                <el-option
                  v-for="item in options.categoryOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人/法人姓名">
              <el-input v-model="options.registerInfo.legalpersonname" disabled />
              <span slot="label">
                <span v-show="options.registerInfo.type===''">个人/法人姓名</span>
                <span v-show="options.registerInfo.type===1">法人姓名</span>
                <span v-show="options.registerInfo.type===2">个人姓名</span>
                <span v-show="options.registerInfo.type===3">个体工商户姓名</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="手机号码">
              <el-input v-model="options.registerInfo.legalpersonphone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码">
              <el-input v-model="options.registerInfo.idnumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="法人证件类型" prop="typeofid">
              <el-select v-model="form.typeofid" placeholder="请选择法人证件类型" clearable>
                <el-option
                  v-for="item in options.certificateTypes"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="身份证是否长期" prop="longtimeornoper">
              <el-radio-group v-model="form.longtimeornoper">
                <el-radio
                  v-for="item in options.stateOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证有效日期" prop="IDCardExpiryTime">
              <el-date-picker
                v-model="form.IDCardExpiryTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传证件照片 -->
        <el-row :gutter="50">
          <el-col :span="6">
            <el-form-item label="身份证正面照" prop="IDCardFront">
              <upload-img />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证反面照" prop="IDCardReverse">
              <upload-img />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-tooltip class="item" effect="dark" content="个人年龄若大于60岁，则必填" placement="right">
              <el-form-item label="手持身份证照片" prop="IDCardHandheld">
                <upload-img />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col v-show="options.registerInfo.type!==2" :span="6">
            <el-form-item label="开户意愿书" prop="held">
              <upload-img />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商户全称与简称 -->
        <el-row v-show="options.registerInfo.type!==2" :gutter="50">
          <el-col :span="12">
            <el-form-item label="商户全称" prop="merchantname">
              <el-input v-model="form.merchantname" placeholder="请输入商户全称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户简称" prop="merchantnamesimple">
              <el-input v-model="form.merchantnamesimple" placeholder="请输入商户简称" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商户号与统一社会信用码 -->
        <el-row v-show="options.registerInfo.type!==2" :gutter="50">
          <el-col :span="12">
            <el-form-item label="商户号">
              <el-input v-model="options.registerInfo.sonmerno" placeholder="请输入商户全称" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="businesslicenceno">
              <el-input v-model="form.businesslicenceno" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商户电话与营业地址 -->
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="商户电话" prop="merchantphone">
              <el-input v-model="form.merchantphone" placeholder="请输入商户电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入营业地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 营业执照类型与所属行业 -->
        <el-row v-show="options.registerInfo.type!==2" :gutter="50">
          <el-col :span="12">
            <el-form-item label="营业执照类型" prop="businesslicencetype">
              <el-select v-model="form.businesslicencetype" placeholder="请选择营业执照类型" clearable>
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
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="form.industry" placeholder="请选择所属行业" clearable>
                <el-option
                  v-for="item in options.industryOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 营业执照是否长期 -->
        <el-row v-show="options.registerInfo.type!==2" :gutter="50">
          <el-col :span="12">
            <el-form-item label="营业执照是否长期" prop="licenseLongtime">
              <el-radio-group v-model="form.licenseLongtime">
                <el-radio
                  v-for="item in options.stateOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照有效日期" prop="IDCardExpiryTime">
              <el-date-picker
                v-model="form.licenseExpiryTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholde="开始日期"
                end-placeholde="结束日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 注册资本与经营范围 -->
        <el-row v-show="options.registerInfo.type!==2" :gutter="50">
          <el-col :span="12">
            <el-form-item label="注册资本(万元)" prop="registeredcapital">
              <el-tooltip class="item" effect="dark" content="请输入注册资本(万元)" placement="right">
                <el-input-number v-model="form.registeredcapital" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围" prop="businessscope">
              <el-input v-model="form.businessscope" placeholder="请输入经营范围" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传企业证件照片 -->
        <el-row v-show="options.registerInfo.type!==2" :gutter="50">
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
import { getDepotRegister } from '@/api/personalCenter/depotRegister'
import UploadImg from '@/components/UploadImg/index.vue'

export default {
  name: 'IdentityAuth',
  components: {
    UploadImg
  },
  data() {
    return {
      // 用户id
      id: '',
      // 是否启用遮罩层
      loading: false,
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
        longtimeornoper: false,
        IDCardExpiryTime: [],
        merchantname: '',
        MCHID: '',
        industry: '',
        typeofid: '',
        merchantnamesimple: '',
        merchantphone: '',
        address: '',
        businesslicencetype: '',
        businesslicenceno: '',
        licenseLongtime: false,
        licenseExpiryTime: [],
        registeredcapital: undefined,
        businessscope: '',
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
        // 是否状态
        stateOptions: [],
        industryOptions: [],
        categoryOptions: [],
        businessLicense: [],
        certificateTypes: [],
        registerInfo: []
      }
    }
  },
  created() {
    // 获取是否字典数据
    this.getDataByType('yesOrNo').then(res => {
      this.options.stateOptions = res.data
    })
    // 获取所属行业字典数据
    this.getDataByType('industryInvolved').then(res => {
      this.options.industryOptions = res.data
    })
    // 获取注册类型字典数据
    this.getDataByType('SqRegisterDic').then(res => {
      this.options.categoryOptions = res.data
    })
    // 获取营业执照类型类型字典数据
    this.getDataByType('businessLicenseType').then(res => {
      this.options.categoryOptions = res.data
    })
    // 获取法人证件类型字典数据
    this.getDataByType('certificateType').then(res => {
      this.options.certificateTypes = res.data
    })
    // 获取注册信息
    this.init()
  },
  methods: {
    async init() {
      this.loading = true // 打开遮罩
      this.id = await this.getID()
      await getDepotRegister(this.id).then(res => {
        if (res.code === 200) {
          this.options.registerInfo = res.data
        }
        this.loading = false // 关闭遮罩
      })
    },
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
    },
    // 文件上传的相关方法
    // 移除回调
    handleRemove(file, fileList) {
      this.fileListJsonObj.filter(i1 => {
        if (file.response.data.url === i1.url) {
          this.fileListJsonObj.splice(this.fileListJsonObj.indexOf(i1), 1)
        }
      })
    },
    // 上传成功之后的回调
    handleUploadSuccess(response, file, fileList) {
      console.log('success', response, file, fileList)
      this.fileListJsonObj.push(response.data)
      // console.log(this.fileListJsonObj)
    },
    // 上传失败之后的回调
    handleUploadError() {
      this.msgError('上传失败')
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
