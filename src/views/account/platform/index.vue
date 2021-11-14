<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="账号名称" prop="accountName">
        <el-input
          v-model="queryParams.accountName"
          placeholder="请输入账号名称"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneCode">
        <el-input
          v-model="queryParams.phoneCode"
          placeholder="请输入手机号码"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item label="权限设置" prop="power">
        <el-select v-model="queryParams.power" placeholder="请选择">
          <el-option
            v-for="item in powerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="修改时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width:240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholde="开始日期"
          end-placeholde="结束日期"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

    <!-- 表格工具按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-thumb" size="mini" :disabled="single" @click="handleSelectMenu">分配权限</el-button>
      </el-col> -->
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="roleTableList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="账号" align="center" prop="account" />
      <el-table-column label="账号名称" align="center" prop="accountName" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="手机号码" align="center" prop="phoneCode" />
      <el-table-column label="权限设置" prop="power" align="center" :formatter="statusFormatter" />
      <el-table-column align="center" label="修改时间" width="200">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.createTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <!-- <el-button type="text" icon="el-icon-thumb" size="mini" @click="handleSelectMenu(scope.row)">分配权限</el-button> -->
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
      width="500px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.accountName" placeholder="请输入账号" clearable size="small" />
        </el-form-item>
        <el-form-item label="账号名称" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入账号名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.accountName" placeholder="请输入姓名" clearable size="small" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneCode">
          <el-input v-model="form.phoneCode" placeholder="请输入手机号码" clearable size="small" />
        </el-form-item>
        <el-form-item label="权限设置" prop="power">
          <el-select v-model="form.power" placeholder="请选择">
            <el-option
              v-for="item in powerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改弹出层结束 -->
  </div>
</template>
<script>
// 引入api
import { listRoleForPage, addRole, updateRole, getRoleById, deleteRoleByIds } from '@/api/system/role'
// import { selectMenuTree, getMenuIdsByRoleId } from '@/api/system/menu'

export default {
  // 定义页面数据
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 字典表格数据
      roleTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 权限下拉列表
      powerOptions: [
        {
          value: '1',
          label: '超级管理员'
        }, {
          value: '2',
          label: '财务'
        }, {
          value: '3',
          label: '会计'
        }
      ],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        accountName: '',
        phoneCode: undefined,
        power: ''
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        accountName: [
          { required: true, message: '账号名称不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
        ],
        power: [
          { required: true, message: '权限设置不能为空', trigger: 'blur' }
        ]
      },
      // 是否打开分配权限的弹出层
      // selectMenuOpen: false,
      // 菜单树的数据
      menuOptions: [],
      // 当前选中持角色ID
      currentAccountId: undefined
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据
    // this.getDataByType('sys_normal_disable').then(res => {
    //   this.powerOptions = res.data
    // })
    // 查询表格数据
    this.getRoleList()
  },
  // 方法
  methods: {
    // 查询表格数据
    getRoleList() {
      this.loading = true // 打开遮罩
      listRoleForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.roleTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.getRoleList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getRoleList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getRoleList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getRoleList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.powerOptions, row.status)
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加账号'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改账号'
      const roleId = row.roleId || this.ids
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据dictId查询一个字典信息
      this.loading = true
      getRoleById(roleId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const roleIds = row.roleId || this.ids
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteRoleByIds(roleIds).then(res => {
          this.loading = false
          this.msgSuccess(res.msg)
          this.getRoleList()// 全查询
        })
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
          if (this.form.roleId === undefined) {
            addRole(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getRoleList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updateRole(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getRoleList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 取消
    cancel() {
      this.open = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.form = {
        account: '',
        accountName: '',
        name: '',
        phoneCode: null,
        power: null
      }
    }
    // 打开分配权限和菜单的弹出层
    // handleSelectMenu(row) {
    //   this.currentAccountId = row.roleId || this.ids[0]
    //   this.title = '分配权限和菜单'
    //   this.selectMenuOpen = true
    //   // 查询所有可用的菜单
    //   selectMenuTree().then(res => {
    //     this.menuOptions = this.handleTree(res.data, 'menuId')
    //   })
    //   // 根据角色ID查询当前角色拥有的哪些菜单权限
    //   getMenuIdsByRoleId(this.currentAccountId).then(res => {
    //     this.$refs.menu.setCheckedKeys(res.data)
    //   })
    // },
    // 保存角色和菜单权限的关系
    // handleSelectMenuSubmit() {
    //   // 获取选中的keys
    //   const checkedKeys = this.$refs.menu.getCheckedKeys()
    //   // 获取半选的keys
    //   const halfCheckKeys = this.$refs.menu.getHalfCheckedKeys()
    //   // 组合成最后的keys
    //   const finalKey = halfCheckKeys.concat(checkedKeys)
    //   console.log(finalKey)
    //   saveRoleMenu(this.currentAccountId, finalKey).then(res => {
    //     this.msgSuccess('分配成功')
    //   }).catch(() => {
    //     this.msgSuccess('分配失败')
    //   })
    // },
    // // 关闭分配权限和菜单的弹出层
    // cancelSelectMenu() {
    //   this.selectMenuOpen = false
    //   this.menuOptions = []
    // }
  }
}
</script>
