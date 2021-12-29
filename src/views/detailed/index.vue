<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row :gutter="0" style="margin-bottom: 8px;">
      <el-col :span="15" :offset="9">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="分润对象" prop="parkId">
            <el-select
              v-model="queryParams.managerId"
              placeholder="请选择分润对象"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in userList"
                :key="dict.realName"
                :label="dict.realName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车场" prop="parkId">
            <el-select
              v-model="queryParams.parkId"
              placeholder="请选择车场"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in parkList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="分润类型" prop="profitCat">
            <el-select
              v-model="queryParams.profitCat"
              placeholder="请选择分润类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in list"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
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
      <el-table-column align="center" label="订单编号">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制订单编号：<el-tag type="primary" effect="dark" size="mini">{{ scope.row.sn }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="scope.row.sn" v-clipboard:success="clipboardSuccess" size="medium"> {{ scope.row.sn }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="停车场名称" align="center" prop="name" />
      <el-table-column label="分润对象" width="180" align="center" prop="realName" />
      <el-table-column label="分润类型" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.profitCat===1" type="success" size="mini" effect="dark"> 手续费</el-tag>
          <el-tag v-show="scope.row.profitCat===4" type="danger" size="mini" effect="dark">停车分成</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分润金额" width="180">
        <template slot-scope="scope">
          <el-tag size="mini" type="warning" effect="dark"> <i class="el-icon-coin" /> {{ scope.row.amount }}</el-tag>
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
  </div>
</template>
<script>
// 引入api
import { getListByPage } from '@/api/detailed/index'
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
        parkId: '',
        profitCat: '',
        managerId: ''
      },
      parkList: [],
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
      roleId: '',
      list: [
        {
          label: '手续费',
          value: '1'
        },
        {
          label: '停车分成',
          value: '4'
        }
      ],
      userList: []
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据  2禁用 1正常
    // this.getDataByType('sys_normal_disable').then(res => {
    //   this.stateOptions = res.data
    // })
    // selectAllRole().then(res => {
    //   this.roleOptions = res.data
    //   res.data.map(item => {
    //     if (item.roleId === 1 || item.roleId === 3 || item.roleId === 4) {
    //       this.roleOptionsDue.push(item)
    //     }
    //   })
    // })
    // 查询所有用户信息
    // selectNeedSchedulingUsers().then(res => {
    //   this.userOptions = res.data
    //   console.log(this.userOptions)
    // })
    // 查询表格数据
    this.getUserList()
  },
  // 方法
  methods: {
    // 获取车场
    // getParklist() {
    //   listAll().then(res => {
    //     this.parkList = res.data
    //   })
    // },
    // 复制成功的回调函数
    clipboardSuccess() {
      this.msgSuccess('复制成功！')
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
      getListByPage(this.queryParams).then(res => {
        this.userTableList = res.data.list.list
        this.parkList = res.data.park
        this.userList = res.data.user
        this.total = res.data.list.total
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
      this.queryParams.page = 1
      this.queryParams.size = 10
      this.dateRange = []
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
    // handleUpdate(row) {
    //   this.title = '修改用户'
    //   const id = row.id || this.ids
    //   this.open = true
    //   this.reset()
    //   // 根据dictId查询一个字典信息
    //   this.loading = true
    //   getUserById(id).then(res => {
    //     this.form.state = res.data.state + ''
    //     this.form.id = res.data.id
    //     this.form.username = res.data.username
    //     this.form.realName = res.data.realName
    //     this.form.mobile = res.data.mobile
    //     this.form.role = res.data.role
    //     this.form.email = res.data.email
    //     this.form.parentId = res.data.parentId
    //     this.loading = false
    //   })
    // },
    // 执行删除
    // handleDelete(row) {
    //   const userIds = row.id || this.ids
    //   this.$confirm('此操作将永久删除该用户数据, 是否继续?', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.loading = true
    //     deleteUserByIds(userIds).then(res => {
    //       this.msgSuccess(res.msg)
    //       this.getUserList()// 全查询
    //     })
    //     this.loading = false
    //   }).catch(() => {
    //     this.msgError('删除已取消')
    //     this.loading = false
    //   })
    // },
    // 保存
    // handleSubmit() {
    //   this.$refs['form'].validate((valid) => {
    //     if (valid) {
    //       // 做添加
    //       this.loading = true
    //       if (this.form.id === undefined || this.form.id === null || this.form.id === '') {
    //         addUser(this.form).then(res => {
    //           if (res.code === 200) {
    //             this.msgSuccess(res.msg)
    //             this.getUserList()// 列表重新查询
    //             this.open = false// 关闭弹出层
    //           } else {
    //             this.$set(this.form, 'username', '')
    //           }
    //         })
    //         this.loading = false
    //       } else { // 做修改
    //         updateUser(this.form).then(res => {
    //           this.msgSuccess(res.msg)
    //           this.getUserList()// 列表重新查询
    //           this.open = false// 关闭弹出层
    //         })
    //         this.loading = false
    //       }
    //     }
    //   })
    // },
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
    }
    // 重置密码
    // handleResetPwd() {
    //   const userIds = this.ids
    //   const tx = this
    //   tx.$confirm('是否确认重置用户ID为:' + userIds + '的密码?', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(function() {
    //     resetPwd(userIds).then(res => {
    //       tx.msgSuccess(res.msg)
    //     })
    //   }).catch(function() {
    //     tx.msgError('重置已取消')
    //   })
    // }
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

