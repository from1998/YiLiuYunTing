<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row :gutter="0" style="margin-bottom: 8px;">
      <el-col v-if="getUserInfo().role === 1" :span="7">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleResetPwd">重置密码</el-button>
      </el-col>
      <el-col :span="15" :offset="getUserInfo().role === 1?2:9">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="用户姓名" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户姓名"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="queryParams.mobile"
              placeholder="请输入手机号"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="queryParams.state"
              placeholder="请选择状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in stateOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 查询条件结束 -->
      </el-col>
    </el-row>

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="userTableList" stripe @selection-change="handleSelectionChange">
      <el-table-column v-if="getUserInfo().role === 1 || getUserInfo().role=== 3" type="selection" width="55" align="center" />
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="擅长">
              <span>{{ props.row.strong }}</span>
            </el-form-item>
            <el-form-item label="荣耀">
              <span>{{ props.row.honor }}</span>
            </el-form-item>
            <el-form-item label="简介">
              <span>{{ props.row.introduction }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="登陆名称">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制登陆名称{{ scope.row.username }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="scope.row.username" v-clipboard:success="clipboardSuccess" size="medium"> <i class="el-icon-user-solid" /> {{ scope.row.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center" prop="realName" />
      <el-table-column label="手机号码" width="180" align="center" prop="mobile" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.state===1" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 正常</el-tag>
          <el-tag v-show="scope.row.state===2" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.role===1" type="success" size="mini" effect="dark"><svg-icon icon-class="admin" /> 超管</el-tag>
          <el-tag v-show="scope.row.role===3" type="warning" size="mini" effect="dark"><svg-icon icon-class="agent" /> 代理商</el-tag>
          <el-tag v-show="scope.row.role===4" type="primary" size="mini" effect="dark"><svg-icon icon-class="park" /> 车场</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="180">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.createTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上次登陆时间" width="180">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.lastLoginTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <span v-if="getUserInfo().role === 1 || getUserInfo().role=== 3">
            <el-button type="success" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="scope.row.role!==1" type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </span>
          <router-link v-if="scope.row.role===4" :to="'/user/carSetting/' + scope.row.id" class="link-type">
            <el-button type="primary" size="mini">
              <svg-icon icon-class="car" />
              车场配置
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据表格结束 -->
    <!-- 分页控件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 分页控件结束 -->

    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录名称" prop="username">
              <el-input v-model="form.username" style="width:240px" placeholder="请输入登录名称" clearable size="small" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName" style="width:240px" placeholder="请输入真实姓名" clearable size="small" />
            </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" style="width:240px" placeholder="请输入手机号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" style="width:240px" placeholder="请输入用户邮箱" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item label="状态" prop="state">
              <el-select
                v-model="form.state"
                placeholder="状态"
                clearable
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="d in stateOptions"
                  :key="d.dictValue"
                  :label="d.dictLabel"
                  :value="d.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="getUserInfo().role === 1 || getUserInfo().role === 3 || getUserInfo().role === 4 " :span="12">
            <el-form-item label="角色" prop="role">
              <el-select
                v-model="form.role"
                placeholder="角色"
                clearable
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="(item, index) in roleOptionsDue"
                  :key="index"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item v-if="form.role === 4" label="选择父级账号">
              <el-select
                v-model="form.parentId"
                placeholder="父级账号"
                clearable
                size="small"
                style="width:240px"
                @change="change()"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel('open')">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改弹出层结束 -->
  </div>
</template>
<script>
// 引入api
import { listUserForPage, selectNeedSchedulingUsers, addUser, updateUser, getUserById, deleteUserByIds, resetPwd } from '@/api/system/user'
import { selectAllRole } from '@/api/system/role'

import validate from '@/utils/validate'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  directives: {
    clipboard
  },
  // 定义页面数据
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        mobile: validate.phone,
        username: validate.notEmpty,
        state: validate.notEmpty,
        role: validate.notEmpty
      },
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 字典表格数据
      userTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      shareBenefitOpen: false,
      // 角色数据字典
      roleOptions: [],
      roleOptionsDue: [],
      // 用户信息
      userOptions: [],
      // 状态数据字典
      stateOptions: [],
      // 级别数据字典
      userRankOptions: [],
      // 背景数据字典
      backgroundOptions: [],
      // 是否参与排班
      schedulingFlagOptions: [],
      // 性别数据字典
      sexOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        username: undefined,
        mobile: undefined,
        state: undefined
      },
      // 表单数据
      form: {},
      benefitForm: {},
      // roleIds 分配角色列表选择状态
      roleIds: [],
      // 角色数据
      carSettingList: [],
      // 当前选中的用户
      currentUserId: undefined,
      // 添加车场选中的用户
      currentParkUserId: undefined,
      roleId: ''
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据  2禁用 1正常
    this.getDataByType('sys_normal_disable').then(res => {
      this.stateOptions = res.data
    })
    selectAllRole().then(res => {
      this.roleOptions = res.data
      res.data.map(item => {
        if (item.roleId === 1 || item.roleId === 3 || item.roleId === 4) {
          this.roleOptionsDue.push(item)
        }
      })
    })
    // 查询所有用户信息
    selectNeedSchedulingUsers().then(res => {
      this.userOptions = res.data
      console.log(this.userOptions)
    })
    // 查询表格数据
    this.getUserList()
  },
  // 方法
  methods: {
    // 复制成功的回调函数
    clipboardSuccess() {
      this.msgSuccess('复制成功')
    },
    encode64(input) {
      const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/_' + '='
      let output = ''
      let chr1 = ''
      let chr2 = ''
      let chr3 = ''
      let enc1 = ''
      let enc2 = ''
      let enc3 = ''
      let enc4 = ''
      var i = 0
      do {
        chr1 = input.charCodeAt(i++)
        chr2 = input.charCodeAt(i++)
        chr3 = input.charCodeAt(i++)
        enc1 = chr1 >> 2
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
        enc4 = chr3 & 63
        if (isNaN(chr2)) {
          enc3 = enc4 = 64
        } else if (isNaN(chr3)) {
          enc4 = 64
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4)
        chr1 = chr2 = chr3 = ''
        enc1 = enc2 = enc3 = enc4 = ''
      } while (i < input.length)
    },
    // 解决页面v-for中修改item属性值后页面页面值不改变的问题
    change() {
      this.$forceUpdate()
    },
    // 查询表格数据
    getUserList() {
      this.loading = true // 打开遮罩
      listUserForPage(this.queryParams, this.dateRange).then(res => {
        this.userTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },

    // 条件查询
    handleQuery() {
      this.getUserList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.queryParams.page = 1
      this.getUserList()
    },
    // 手机号校验
    validatorPhone(rule, value, callback) {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getUserList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getUserList()
    },
    // 打开添加的弹出层
    handleAdd() {
      this.reset()
      this.open = true
      this.form.state = '1'
      this.form.id = ''
      this.form.username = ''
      this.form.realName = ''
      this.form.mobile = ''
      this.form.role = ''
      this.form.email = ''
      this.title = '添加用户'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改用户'
      const id = row.id || this.ids
      this.open = true
      this.reset()
      // 根据dictId查询一个字典信息
      this.loading = true
      getUserById(id).then(res => {
        this.form.state = res.data.state + ''
        this.form.id = res.data.id
        this.form.username = res.data.username
        this.form.realName = res.data.realName
        this.form.mobile = res.data.mobile
        this.form.role = res.data.role
        this.form.email = res.data.email
        this.form.parentId = res.data.parentId
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm('此操作将永久删除该用户数据, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteUserByIds(userIds).then(res => {
          this.msgSuccess(res.msg)
          this.getUserList()// 全查询
        })
        this.loading = false
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 做添加
          this.loading = true
          if (this.form.id === undefined || this.form.id === null || this.form.id === '') {
            addUser(this.form).then(res => {
              if (res.code === 200) {
                this.msgSuccess(res.msg)
                this.getUserList()// 列表重新查询
                this.open = false// 关闭弹出层
              } else {
                this.$set(this.form, 'username', '')
              }
            })
            this.loading = false
          } else { // 做修改
            updateUser(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.getUserList()// 列表重新查询
              this.open = false// 关闭弹出层
            })
            this.loading = false
          }
        }
      })
    },
    // 取消
    cancel(val) {
      this[val] = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.form = {
        state: '1',
        id: undefined,
        username: undefined,
        realName: undefined,
        mobile: undefined,
        role: undefined,
        email: undefined
      }
    },
    // 重置密码
    handleResetPwd() {
      const userIds = this.ids
      const tx = this
      tx.$confirm('是否确认重置用户ID为:' + userIds + '的密码?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(function() {
        resetPwd(userIds).then(res => {
          tx.msgSuccess(res.msg)
        })
      }).catch(function() {
        tx.msgError('重置已取消')
      })
    }
  }
}
</script>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
