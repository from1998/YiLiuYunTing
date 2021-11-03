<template>
  <div class="login-container">
    <!-- 控制区域 -->
    <div v-show="false">
      <el-form ref="control" :model="controlForm" :inline="true" label-width="68px">
        <el-form-item label="动态背景" prop="menuName">
          <el-switch v-model="tagsView" class="drawer-switch" />
        </el-form-item>
        <el-form-item label="粒子效果" prop="menuName">
          <el-switch v-model="tagsView" class="drawer-switch" />
        </el-form-item>
        <span>粒子效果</span><el-switch v-model="tagsView" class="drawer-switch" />
        <!-- 选择动态背景： 默认css渐变-->
        <el-form-item label="背景样式" prop="bgStyle">
          <el-select
            v-show="getUserInfo().role === 1 || getUserInfo().role === 3"
            v-cloak
            v-model="form.parkId"
            size="small"
            clearable
            style="padding-left:55px"
            @change="handleParkFocus"
          >
            <el-option
              v-for="(item, index) in CarList"
              :key="index"
              :label="item.name"
              :value="Number(item.id)"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="logo">
      <img src="../../assets/images/logo.png" alt="一流云停后台管理系统">
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">一流云停后台管理系统</h3>
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
          <el-col :span="16">
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
      color:
      particles-color
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
import '@/assets/css/style.css'
import { v4 as uuidv4 } from 'uuid'
// uuidv4()// ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

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
      otherQuery: {}
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
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.getVerifyCode()
  },
  methods: {
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
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              if (this.getUserInfo().role === 1 || this.getUserInfo().role === 3 || this.getUserInfo().role === 4) {
                this.$router.push('/dashboard')
              } else if (this.getUserInfo().role === 6) {
                this.$router.push('/monitoringCenter/quickMonitoring')
              }
              // 强制刷新
              this.$router.go(0)
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
.login-container {
  position: relative;
  min-height: 100%;
  height: 100%;
  width: 100%;
  overflow: hidden;
.logo {
    padding-top: 10%;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  img {
    width: 100%;
  }
}
  .login-form {
    position: relative;
    z-index: 9999;
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
      margin: 0px auto 40px auto;
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
