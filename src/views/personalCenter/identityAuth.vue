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

      <el-form ref="depotForm" :model="form" label-width="150px" style="width:750px">
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
            <el-form-item label="身份证是否长期" prop="whetherLongtime">
              <el-tooltip class="item" effect="dark" content="请选择身份证有效期状态" placement="right">
                <el-switch
                  v-model="form.whetherLongtime"
                  :active-text="form.whetherLongtime?'长期':'非长期'"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col v-if="!form.whetherLongtime" :span="12">
            <el-form-item label="有效期限截至日期" prop="expiryTime">
              <el-date-picker
                v-model="form.expiryTime"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传证件照片 -->
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="手持证件照片" prop="handHeld" />
          </el-col>
        </el-row>
        <el-form-item label="企业名称" prop="firmName">
          <el-input v-model="form.firmName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item label="验证码" prop="verificationCode">
              <el-input v-model="form.verificationCode" placeholder="请输入验证码" />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="verifyCode">
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
              <el-button type="danger" @click="resetForm('depotForm')">重置</el-button>
            </div>
          </el-form-item>
        </el-row>

      </el-form>
    </el-container>

  </el-container>

</template>
<script>
export default {
  name: 'IdentityAuth',
  data() {
    return {
      limitCount: 1,
      uploadImgVisible: false,
      // 为隐藏上传图片按钮设置的类的激活状态
      hideUpload: false,
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
        whetherLongtime: false,
        firmName: '',
        handHeld: []

      },
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
    handleChange(file, fileList) {
      this.form.handHeld = fileList
      console.log(this.form.handHeld)
      this.hideUpload = fileList.length >= this.limitCount
    },
    // 删除上传的图片
    handleRemove(file, fileList) {
      this.form.handHeld = fileList
      console.log(fileList)
      this.hideUpload = fileList.length >= this.limitCount
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
.el-button--mini {
  padding: 0 5px!important;
  height: 17px;
}
</style>
