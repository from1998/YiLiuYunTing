<template>
  <div class="login-container">
    <!-- 云彩 -->
    <div class="dynamic-area1" />
    <div class="dynamic-area2" />
    <!-- 萤火之森 -->
    <div id="background" class="wall" />
    <div id="midground" class="wall" />
    <div id="foreground" class="wall" />
    <div id="top" class="wall" />
    <!-- 银河 -->
    <div class="stars" />
    <!-- 光影年华 -->
    <div class="background">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    <div v-show="true" @click="handleStyleOpen">
      <el-popover
        placement="top-start"
        title="提示："
        width="188"
        trigger="hover"
        content="点击打开样式控制台。"
      >
        <dv-decoration-9 slot="reference" class="styleControlForm" style="width:50px;height:50px;"><span style="color:#F00"><i class="el-icon-loading" /></span></dv-decoration-9>
      </el-popover>
    </div>
    <!-- 控制区域 -->
    <el-dialog
      title="样式控制台"
      :visible.sync="controlFormOpen"
      width="21%"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="controlForm" :model="controlForm" label-width="80px" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="粒子效果" prop="particle">
              <el-switch v-model="controlForm.particle" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="背景类型" prop="bgType">
              <!-- true为动态，false为静态 -->
              <el-switch v-model="controlForm.bgType" inactive-color="#13ce66" :active-text="controlForm.bgType?'动态':'静态'" @change="bgTypeChange" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-tooltip content="提示：背景样式确定后生效。" placement="bottom" effect="dark">
          <el-form-item label="背景样式" prop="bgStyle">
            <el-select
              v-model="controlForm.bgStyle"
              size="small"
              clearable
              style="width:265px"
            >
              <el-option
                v-for="item in bgStyleList"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-tooltip>
        <el-form-item v-if="controlForm.bgStyle === 'diy'" label="图片链接" prop="url">
          <el-input v-model="controlForm.url" placeholder="请粘贴图片链接(URL)" clearable style="width:265px" />
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="controlFormOpen = false">关 闭</el-button>
        <el-button type="primary" @click="handleStyleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <div class="logo">
      <img src="../../assets/images/logo.png" alt="一流云停|停车管理系统">
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">一流云停|停车管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          clearable
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="已开启大写键盘" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            clearable
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="verifyCode">
        <el-row>
          <el-col :span="16" style="white-space:nowrap;">
            <span class="svg-container">
              <i class="el-icon-info" />
            </span>
            <el-input
              ref="verifyCode"
              v-model="loginForm.verifyCode"
              placeholder="验证码"
              name="verifyCode"
              type="text"
              tabindex="3"
              autocomplete="on"
              clearable
              @keyup.enter.native="handleLogin"
            />
          </el-col>
          <el-col :span="8" class="verifyCode">
            <img id="verifyCodeImage" :src="image_verify_code" alt="" @click="getVerifyCode">
          </el-col>
        </el-row>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>
    </el-form>
    <vue-particles
      v-if="controlForm.particle"
      color:particles-color
      :particle-opacity="0.7"
      :particles-number="100"
      shape-type="circle"
      :particle-size="4"
      lines-color="#fff"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="3"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
      class="lizi"
    />
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import validate from '@/utils/validate.js'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入正确的用户名或密码'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('请输入正确的用户名或密码'))
      } else {
        callback()
      }
    }
    const validateVerifyCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      // 验证规则
      validate,
      rules: {
        bgStyle: validate.notEmpty,
        url: validate.notEmpty
      },
      controlFormOpen: false,
      controlForm: {},
      dynamicBgStyleList: [{
        id: 1,
        name: '流光溢彩',
        value: 'gradientRamp'
      },
      {
        id: 2,
        name: '云之秘境',
        value: 'cloud'
      },
      {
        id: 3,
        name: '萤火之森',
        value: 'fireworm'
      },
      {
        id: 4,
        name: '银河之星',
        value: 'milkyWay'
      },
      {
        id: 5,
        name: '光影年华',
        value: 'lightLife'
      }
      ],
      staticBgStyleList: [{
        id: 1,
        name: '极光之境',
        value: 'aurora'
      },
      {
        id: 2,
        name: '樱花小镇',
        value: 'town'
      },
      {
        id: 3,
        name: '湖光秋色',
        value: 'autumn'
      }, {
        id: 4,
        name: '硰之岛屿',
        value: 'island'
      },
      {
        id: 5,
        name: '可爱萝莉',
        value: 'loi'
      },
      {
        id: 6,
        name: '军装御姐',
        value: 'uniformSister'
      },
      {
        id: 7,
        name: '自定义',
        value: 'diy'
      },
      {
        id: 8,
        name: '随机美图',
        value: 'random'
      }],
      image_verify_code: '',
      loginForm: {
        username: '',
        password: '',
        verifyCode: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'blur', validator: validateVerifyCode }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      bgStyleList: []
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  async created() {
    this.controlForm = await JSON.parse(localStorage.getItem('styleConfig')) || {
      bgType: true,
      bgStyle: 'cloud',
      particle: false,
      url: ''
    }
    this.importCSS(this.controlForm.bgType, this.controlForm.bgStyle)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.getVerifyCode()
  },
  methods: {
    importCSS(type, path) {
      if (type) {
        switch (path) {
          case 'gradientRamp':
    import('@/assets/css/gradientRamp.css')
            break
          case 'cloud':
    import('@/assets/css/cloud.css')
            break
          case 'fireworm':
    import('@/assets/css/fireworm.css')
            break
          case 'milkyWay':
    import('@/assets/css/milkyWay.css')
            break
          case 'lightLife':
    import('@/assets/css/lightLife.css')
            break
          default:
    import('@/assets/css/cloud.css')
            break
        }
      } else {
        switch (path) {
          case 'aurora':
    import('@/assets/css/aurora.css')
            break
          case 'island':
    import('@/assets/css/island.css')
            break
          case 'loi':
    import('@/assets/css/loi.css')
            break
          case 'autumn':
    import('@/assets/css/autumn.css')
            break
          case 'town':
    import('@/assets/css/town.css')
            break
          case 'uniformSister':
    import('@/assets/css/uniformSister.css')
            break
          case 'diy':
            this.$nextTick(() => {
              document.getElementsByClassName('login-container')[0].style.backgroundImage = `url(${this.controlForm.url})`
            })
            break
          case 'random':
            this.$nextTick(() => {
              document.getElementsByClassName('login-container')[0].style.backgroundImage = 'url(https://bing.ioliu.cn/v1/rand?w=1920&h=1080)'
            })
            break
          default:
            break
        }
      }
    },
    handleStyleOpen() {
      this.controlFormOpen = true
      this.bgTypeChange(this.controlForm.bgType, 'add')
    },
    handleStyleSubmit() {
      this.$refs['controlForm'].validate((valid) => {
        if (valid) {
          localStorage.setItem('styleConfig', JSON.stringify(this.controlForm))
          this.controlFormOpen = false
          this.$router.go(0)
        }
      })
    },
    bgTypeChange(val, type) {
      if (!type) {
        this.$set(this.controlForm, 'bgStyle', '')
      }
      if (val) {
        this.bgStyleList = this.dynamicBgStyleList
      } else {
        // 将引入的css地址存在cookie中，然后刷新页面，在created函数中取到cookie值加载相应的css文件。这就避免了无法消除css文件的尴尬。当然，如何消除css文件，依然需要找寻办法。
        this.bgStyleList = this.staticBgStyleList
      }
    },
    getVerifyCode() {
      this.loginForm.verifyCode = ''
      this.loginForm.uuid = uuidv4().split('-')[0] // ⇨ '9b1deb4d'
      this.image_verify_code = process.env.VUE_APP_BASE_API + '/login/verificationCode?creationTime=' + this.loginForm.uuid
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 做登陆
    handleLogin() {
      // 做验证 验证用户名和密码是否合法   前端验证
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // 调用登陆的方法
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // 带查询参数的编程式导航，query是一个对象，是查询
              // 保安跳转到快捷监控
              if (this.getUserInfo().role === 6) {
                this.$router.push({ path: '/monitoringCenter/quickMonitoring', query: this.otherQuery })
              } else {
                this.$router.push({ path: '/', query: this.otherQuery })
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
              this.getVerifyCode()
            })
        } else {
          this.getVerifyCode()
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bgStyle:path;
$bg:#283443;
$light_gray:aqua;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.verifyCode {
#verifyCodeImage {
  width: 100%;
}
  background-color: #fff!important;
  padding: 0.3vw 0.8vw;
}
/* reset element-ui css */
.login-container {
  user-select: none;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: aqua;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form {
  .el-form-item {
    &:nth-child(-n+3){
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: aqua;
    }
  }
}
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#fff;
$light_gray:#eee;
#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
.styleControlForm {
  position: fixed;
  top: 1%;
  right: 1%;
  z-index: 999;
}
.login-container {
  position: relative;
  background-size: cover;
  min-height: 100%;
  height: 100%;
  width: 100%;
  overflow: hidden;
.logo {
    padding-top: 10%;
    position: relative;
    z-index: 999;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  img {
    width: 100%;
  }
}
  .login-form {
    position: relative;
    z-index: 999;
    width: 520px;
    max-width: 100%;
    padding: 0 35px;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: aqua;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: #fff;
      margin: 15px auto 40px auto;
      text-align: center;
      letter-spacing: 0.3em;
      font-family: sans-serif;

    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
    .el-col {
    height: 47px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
