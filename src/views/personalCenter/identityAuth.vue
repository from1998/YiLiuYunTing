<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-weight:700">
      身份认证
      <el-tag v-show="options.registerInfo.registerstatus===''" type="success" icon="el-icon-success" effect="dark" size="mini">未注册</el-tag>
      <el-tag v-show="options.registerInfo.registerstatus===1" type="success" icon="el-icon-success" effect="dark" size="mini">已认证</el-tag>
      <el-tag v-show="options.registerInfo.registerstatus===2" type="info" icon="el-icon-info" effect="dark" size="mini">未认证</el-tag>
      <el-tag v-show="options.registerInfo.registerstatus===3" type="warning" icon="el-icon-warning" effect="dark" size="mini">审核中</el-tag>
      <el-tag v-show="options.registerInfo.registerstatus===0" type="danger" icon="el-icon-error" effect="dark" size="mini">认证失败</el-tag>
    </el-header>
    <!-- 主体 -->
    <el-container class="container">

      <div v-show="resData!==0 && !resData" class="error">
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
            车场未注册，无法进行身份认证。
          </p>
          <el-button type="primary" class="goBack" @click="goDepotRegister">转到车场注册</el-button>
        </el-row>
      </div>

      <el-form v-show="resData === 0 || resData" :model="form" label-width="150px" style="width:1200px" :disabled="flag" :rules="rules">
        <el-row>
          <el-col :span="12">
            <!-- 注册类型 -->
            <el-form-item label="注册类型" prop="type">
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
            <el-form-item label="个人/法人姓名" prop="legalpersonname">
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="legalpersonphone">
              <el-input v-model="options.registerInfo.legalpersonphone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="idnumber">
              <el-input v-model="options.registerInfo.idnumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
        <el-row>
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
                v-model="IDCardExpiryTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange(IDCardExpiryTime)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传证件照片 -->
        <el-row>
          <el-col :span="options.registerInfo.type!==2?6:8">
            <el-form-item label="身份证正面照" prop="notEmpty">
              <upload-img v-if="options.registerInfo.registerstatus===2 || options.registerInfo.registerstatus===0" :title="form.idimagea" @imgagePush="imageAccept('idimagea','idimageasrc',$event)" />
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="form.idimageasrc"
                :preview-src-list="[form.idimageasrc]"
              />
              <el-input v-show="false" v-model="form.idimagea" />
              <el-input v-show="false" v-model="form.idimageasrc" />
            </el-form-item>
          </el-col>
          <el-col :span="options.registerInfo.type!==2?6:8">
            <el-form-item label="身份证反面照" prop="notEmpty">
              <upload-img v-if="options.registerInfo.registerstatus===2 || options.registerInfo.registerstatus===0" @imgagePush="imageAccept('idimageb','idimagebsrc',$event)" />
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="form.idimagebsrc"
                :preview-src-list="[form.idimagebsrc]"
              />
              <el-input v-show="false" v-model="form.idimageb" />
              <el-input v-show="false" v-model="form.idimagebsrc" />
            </el-form-item>
          </el-col>
          <el-col :span="options.registerInfo.type!==2?6:8">
            <el-tooltip class="item" effect="dark" content="个人年龄若大于60岁，则必填" placement="top">
              <el-form-item v-show="form.idimagecsrc" label="手持身份证照片" prop="IDCardHandheld">
                <upload-img v-if="options.registerInfo.registerstatus===2 || options.registerInfo.registerstatus===0" @imgagePush="imageAccept('idimagec','idimagecsrc',$event)" />
                <el-image
                  v-else
                  style="width: 100px; height: 100px"
                  :src="form.idimagecsrc"
                  :preview-src-list="[form.idimagecsrc]"
                />
                <el-input v-show="false" v-model="form.idimagec" />
                <el-input v-show="false" v-model="form.idimagecsrc" />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col v-if="options.registerInfo.type!==2" :span="6">
            <el-form-item label="开户意愿书" prop="notEmpty">
              <upload-img v-if="options.registerInfo.registerstatus===2 || options.registerInfo.registerstatus===0" @imgagePush="imageAccept('accountLicense','accountLicensesrc',$event)" />
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="form.accountLicensesrc"
                :preview-src-list="[form.accountLicensesrc]"
              />
              <el-input v-show="false" v-model="form.accountLicense" />
              <el-input v-show="false" v-model="form.accountLicensesrc" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商户全称与简称 -->
        <el-row v-if="options.registerInfo.type!==2">
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户号" prop="sonmerno">
              <el-input v-model="options.registerInfo.sonmerno" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="options.registerInfo.type!==2" :span="12">
            <el-form-item label="统一社会信用代码" prop="businesslicenceno">
              <el-input v-model="form.businesslicenceno" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商户电话与营业地址 -->
        <el-row>
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
        <el-row v-if="options.registerInfo.type!==2">
          <el-col :span="12">
            <el-form-item label="营业执照类型" prop="businesslicencetype">
              <el-select v-model="form.businesslicencetype" placeholder="请选择营业执照类型" clearable>
                <el-option
                  v-for="item in options.businessLicense"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
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
        <el-row v-if="options.registerInfo.type!==2">
          <el-col :span="12">
            <el-form-item label="营业执照是否长期" prop="longtimeorno">
              <el-radio-group v-model="form.longtimeorno">
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
            <el-form-item label="营业执照有效日期" prop="businesslicencevalidity">
              <el-date-picker
                v-model="form.businesslicencevalidity"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 注册资本与经营范围 -->
        <el-row v-if="options.registerInfo.type!==2">
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
        <el-row v-if="options.registerInfo.type!==2">
          <el-col :span="6">
            <el-form-item label="营业执照" prop="notEmpty">
              <upload-img v-if="options.registerInfo.registerstatus===2 || options.registerInfo.registerstatus===0" @imgagePush="imageAccept('businesslicencecopy','businesslicencecopysrc',$event)" />
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="form.businesslicencecopysrc"
                :preview-src-list="[form.businesslicencecopysrc]"
              />
              <el-input v-show="false" v-model="form.businesslicencecopy" />
              <el-input v-show="false" v-model="form.businesslicencecopysrc" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.businesslicencetype === 0" :span="6">
            <el-form-item label="税务登记证副本" prop="notEmpty">
              <upload-img v-if="options.registerInfo.registerstatus===2 || options.registerInfo.registerstatus===0" @imgagePush="imageAccept('taxregistrationcopy','taxregistrationcopysrc',$event)" />
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="form.taxregistrationcopysrc"
                :preview-src-list="[form.taxregistrationcopysrc]"
              />
              <el-input v-show="false" v-model="form.taxregistrationcopy" />
              <el-input v-show="false" v-model="form.taxregistrationcopysrc" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.businesslicencetype === 0" :span="6">
            <el-form-item label="组织结构代码证副本" prop="notEmpty">
              <upload-img v-if="options.registerInfo.registerstatus===2 || options.registerInfo.registerstatus===0" @imgagePush="imageAccept('organizationcodecopy','organizationcodecopysrc',$event)" />
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="form.organizationcodecopysrc"
                :preview-src-list="[form.organizationcodecopysrc]"
              />
              <el-input v-show="false" v-model="form.organizationcodecopy" />
              <el-input v-show="false" v-model="form.organizationcodecopysrc" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="银行开户许可证" prop="notEmpty">
              <upload-img v-if="options.registerInfo.registerstatus===2 || options.registerInfo.registerstatus===0" @imgagePush="imageAccept('licenceforopeningaccounts','licenceforopeningaccountssrc',$event)" />
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="form.licenceforopeningaccountssrc"
                :preview-src-list="[form.licenceforopeningaccountssrc]"
              />
              <el-input v-show="false" v-model="form.licenceforopeningaccounts" />
              <el-input v-show="false" v-model="form.licenceforopeningaccountssrc" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="container">
          <el-form-item>
            <el-button type="primary" class="btn" :disabled="options.registerInfo.registerstatus===1 || options.registerInfo.registerstatus===3?true:false" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-container>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="0" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </el-container>

</template>
<script>
import { getDepotRegister } from '@/api/personalCenter/depotRegister'
import { identityAuth } from '@/api/personalCenter/identityAuth'
import BackToTop from '@/components/BackToTop'

import UploadImg from '@/components/UploadImg/index.vue'

import validate from '@/utils/validate'

export default {
  name: 'IdentityAuth',
  components: {
    UploadImg,
    BackToTop
  },
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        legalpersonphone: validate.phone,
        merchantphone: validate.phone,
        idnumber: validate.idNumber,
        address: validate.notEmpty,
        type: validate.notEmpty,
        legalpersonname: validate.notEmpty,
        longtimeornoper: validate.notEmpty,
        typeofid: validate.notEmpty,
        merchantname: validate.notEmpty,
        sonmerno: validate.notEmpty,
        businesslicenceno: validate.notEmpty,
        merchantnamesimple: validate.notEmpty,
        businesslicencetype: validate.notEmpty,
        businessscope: validate.notEmpty,
        registeredcapital: validate.notEmpty,
        notEmpty: validate.notEmpty
      },
      // 个人信息查询返回值
      resData: false,
      flag: false,
      // 用户id
      id: '',
      // 是否启用遮罩层
      loading: false,
      // 获取验证码按钮显示
      codeShow: true,
      //   计数器
      count: '',
      //   定时器
      timer: null,
      // 身份证有效日期
      IDCardExpiryTime: [],
      form: {
        // 身份证正面
        idimagea: '',
        idimageasrc: '',
        // 身份证反面
        idimageb: '',
        idimagebsrc: '',
        // 手持身份证
        idimagec: '',
        idimagecsrc: '',
        // 开户意愿书
        accountLicense: '',
        accountLicensesrc: '',
        // 营业执照
        businesslicencecopy: '',
        businesslicencecopysrc: '',
        // 营业执照有效日期
        businesslicencevalidity: '',
        // 税务登记证副本
        taxregistrationcopy: '',
        taxregistrationcopysrc: '',
        // 组织结构代码证副本
        organizationcodecopy: '',
        organizationcodecopysrc: '',
        // 银行开户许可证
        licenceforopeningaccounts: '',
        licenceforopeningaccountssrc: '',
        // 身份证是否长期
        longtimeornoper: 0,
        // 身份证有效期开始与结束日期
        idvalidity: '',
        idvaliditybegin: '',
        // 营业执照是否长期
        longtimeorno: 1,
        // 商户全称
        merchantname: '',
        // 商户简称
        merchantnamesimple: '',
        // 所属行业
        industry: 14,
        // 法人证件类型
        typeofid: 0,
        // 商户电话
        merchantphone: '',
        // 营业地址
        address: '',
        // 营业执照类型
        businesslicencetype: '',
        // 统一社会信用代码
        businesslicenceno: '',
        // 注册资本(万元)
        registeredcapital: undefined,
        // 经营范围
        businessscope: ''
      },
      options: {
        // 是否状态
        stateOptions: [],
        industryOptions: [],
        categoryOptions: [],
        businessLicense: [],
        certificateTypes: [],
        registerInfo: []
      },
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
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
      this.options.businessLicense = res.data
    })
    // 获取法人证件类型字典数据
    this.getDataByType('certificateType').then(res => {
      this.options.certificateTypes = res.data
    })
    // 获取个人信息
    this.init()
  },
  methods: {
    goDepotRegister() {
      this.$router.push('/personalCenter/depotRegister')
    },
    // 表单字段赋值函数
    imageAccept: function(sqImageId, src, val) {
      this.form[sqImageId] = val.sqImageId
      this.form[src] = val.src
    },
    handletime() {
      this.IDCardExpiryTime = [this.form.idvaliditybegin, this.form.idvalidity]
    },
    timeChange(val) {
      this.form.idvaliditybegin = val[0]
      this.form.idvalidity = val[1]
    },
    async init() {
      this.loading = true // 打开遮罩
      this.id = await this.getUserInfo().id
      await getDepotRegister(this.id).then(res => {
        this.resData = res.data.registerstatus
        if (res.code === 200 && res.data !== null) {
          this.options.registerInfo = res.data
          this.form = Object.assign(this.form, res.data)
          if (res.data.idvaliditybegin && res.data.idvalidity) {
            this.handletime()
          }
          if (res.data.registerstatus === 1 || res.data.registerstatus === 3) {
            this.flag = true
          }
          window.sessionStorage.setItem('sonmerno', res.data.sonmerno)
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      this.loading = true // 打开遮罩
      identityAuth(this.form).then(res => {
        this.msgSuccess(res.msg)
        this.init()
        this.loading = false // 关闭遮罩
      })
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
    .btn {
      display: block;
      margin:30px 0 0 -100%;
    }
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
