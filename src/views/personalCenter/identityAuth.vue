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
            <el-form-item label="身份证有效日期">
              <el-date-picker
                v-model="IDCardExpiryTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                @change="timeChange(IDCardExpiryTime)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传证件照片 -->
        <el-row :gutter="50">
          <el-col :span="6">
            <el-form-item label="身份证正面照">
              <upload-img @imgagePush="imageAccept('idimagea','idimageasrc',$event)" />
              <el-input v-show="false" v-model="form.idimagea" />
              <el-input v-show="false" v-model="form.idimageasrc" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证反面照" prop="IDCardReverse">
              <upload-img @imgagePush="imageAccept('idimageb','idimagebsrc',$event)" />
              <el-input v-show="false" v-model="form.idimageb" />
              <el-input v-show="false" v-model="form.idimagebsrc" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-tooltip class="item" effect="dark" content="个人年龄若大于60岁，则必填" placement="right">
              <el-form-item label="手持身份证照片" prop="IDCardHandheld">
                <upload-img @imgagePush="imageAccept('idimagec','idimagecsrc',$event)" />
                <el-input v-show="false" v-model="form.idimagec" />
                <el-input v-show="false" v-model="form.idimagecsrc" />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col v-if="options.registerInfo.type!==2" :span="6">
            <el-form-item label="开户意愿书" prop="held">
              <upload-img @imgagePush="imageAccept('accountLicense','accountLicensesrc',$event)" />
              <el-input v-show="false" v-model="form.accountLicense" />
              <el-input v-show="false" v-model="form.accountLicensesrc" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商户全称与简称 -->
        <el-row v-if="options.registerInfo.type!==2" :gutter="50">
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
        <el-row v-if="options.registerInfo.type!==2" :gutter="50">
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
        <el-row v-if="options.registerInfo.type!==2" :gutter="50">
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
        <el-row v-if="options.registerInfo.type!==2" :gutter="50">
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
            <el-form-item label="营业执照有效日期">
              <el-date-picker
                v-model="form.businesslicencevalidity"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 注册资本与经营范围 -->
        <el-row v-if="options.registerInfo.type!==2" :gutter="50">
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
        <el-row v-if="options.registerInfo.type!==2" :gutter="50">
          <el-col :span="6">
            <el-form-item label="营业执照">
              <upload-img @imgagePush="imageAccept('businesslicencecopy','businesslicencecopysrc',$event)" />
              <el-input v-show="false" v-model="form.businesslicencecopy" />
              <el-input v-show="false" v-model="form.businesslicencecopysrc" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="税务登记证副本">
              <upload-img @imgagePush="imageAccept('taxregistrationcopy','taxregistrationcopysrc',$event)" />
              <el-input v-show="false" v-model="form.taxregistrationcopy" />
              <el-input v-show="false" v-model="form.taxregistrationcopysrc" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="组织结构代码证副本">
              <upload-img @imgagePush="imageAccept('organizationcodecopy','organizationcodecopysrc',$event)" />
              <el-input v-show="false" v-model="form.organizationcodecopy" />
              <el-input v-show="false" v-model="form.organizationcodecopysrc" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="银行开户许可证">
              <upload-img @imgagePush="imageAccept('licenceforopeningaccounts','licenceforopeningaccountssrc',$event)" />
              <el-input v-show="false" v-model="form.licenceforopeningaccounts" />
              <el-input v-show="false" v-model="form.licenceforopeningaccountssrc" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-form-item>
            <div class="footer">
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <!-- <el-button type="danger" @click="resetForm('depotForm')">重置</el-button> -->
            </div>
          </el-form-item>
        </el-row>

      </el-form>
    </el-container>

  </el-container>

</template>
<script>
import { getDepotRegister } from '@/api/personalCenter/depotRegister'
import { identityAuth } from '@/api/personalCenter/identityAuth'

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
        longtimeornoper: 1,
        // 身份证有效期开始与结束日期
        idvalidity: '',
        idvaliditybegin: '',
        // 营业执照是否长期
        licenseLongtime: 1,
        // 商户全称
        merchantname: '',
        // 商户简称
        merchantnamesimple: '',
        // 所属行业
        industry: '',
        // 法人证件类型
        typeofid: '',
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
    // 获取注册信息
    this.init()
  },
  methods: {
    // 表单字段赋值函数
    imageAccept: function(src, sqImageId, val) {
      this.form[src] = val.src
      this.form[sqImageId] = val.sqImageId
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
      this.id = await this.getID()
      await getDepotRegister(this.id).then(res => {
        if (res.code === 200) {
          this.options.registerInfo = res.data
          this.form = Object.assign(this.form, res.data)
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      // console.log(this.form)
      this.loading = true // 打开遮罩
      identityAuth(this.form).then(res => {
        this.msgSuccess(res.msg)
        this.init()
        this.loading = false // 关闭遮罩
      }).catch((res) => {
        this.msgError(res.msg)
        this.loading = false // 关闭遮罩
      })
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
