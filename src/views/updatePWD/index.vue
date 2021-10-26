<template>
  <el-container>
    <el-header class="container" height="56px" style="padding:25px 0 45px;font-weight:700">
      修改密码
    </el-header>
    <el-form ref="form" :model="form" label-width="80px" style="width:500px;margin:0 auto" :rules="rules">
      <el-form-item label="当前密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入当前密码" auto-complete="new-password" />
      </el-form-item>
      <el-tooltip class="item" effect="dark" content="密码长度介于8-16位之间。" placement="right">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" placeholder="请设置新密码" show-password type="password" auto-complete="new-password" minlength="8" maxlength="16" />
        </el-form-item>
      </el-tooltip>
      <el-form-item label="确认密码" prop="newPassword2">
        <el-input v-model="form.newPassword2" placeholder="请确认新密码" show-password type="password" auto-complete="new-password" minlength="8" maxlength="16" />
      </el-form-item>
      <el-form-item style="margin:0 90px">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-container>

</template>
<script>
import { updatePWD } from '@/api/updatePWD'

export default {
  data() {
    return {
      form: {
        password: '',
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: this.validateNewPassword, trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: this.validateNewPassword2, trigger: 'blur' }
        ]
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    validateNewPassword(rule, value, callback) {
      console.log(value)
      console.log(this.form.password)
      if (value === this.form.password) {
        callback(new Error('新密码不能与当前密码相同!'))
      } else {
        callback()
      }
    },
    validateNewPassword2(rule, value, callback) {
      if (value !== this.form.newPassword) {
        callback(new Error('新密码两次输入不一致!'))
      } else {
        callback()
      }
    },
    onSubmit() {
      this.loading = true // 打开遮罩
      this.$refs.form.validate(valid => {
        if (valid) {
          const { newPassword, password } = this.form
          updatePWD({ newPassword, password }).then(async res => {
            if (res.code === 200) {
              this.timer = setInterval(async() => {
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                this.$router.go(0)
              }, 5000)
              this.$confirm('系统将在五秒后跳转到登录页, 是否立即跳转?', '密码更改成功', {
                confirmButtonText: '确定',
                type: 'success',
                center: true,
                showCancelButton: false,
                showClose: false
              }).then(async() => {
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              })
            }
            this.loading = false// 关闭遮罩
          }).catch(() => {
            this.loading = false// 关闭遮罩
          })
        } else {
          this.$message.error('请正确填写表单')
          return false
        }
      })
    },
    onReset() {
      this.form = {
        password: '',
        newPassword: '',
        newPassword2: ''
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
</style>
