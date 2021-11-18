<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row :gutter="0" style="margin-bottom: 8px;">
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="13" :offset="5">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model.trim="queryParams.roleName"
              placeholder="请输入角色名称"
              clearable
              size="small"
              style="width:160px"
            />
          </el-form-item>
          <el-form-item label="权限字符" prop="roleCode">
            <el-input
              v-model.trim="queryParams.roleCode"
              placeholder="请输入权限字符"
              clearable
              size="small"
              style="width:160px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status" label-width="40px">
            <el-select
              v-model="queryParams.status"
              placeholder="可用状态"
              clearable
              size="small"
              style="width:160px"
            >
              <el-option
                v-for="dict in statusOptions"
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
    <el-table v-loading="loading" border :data="roleTableList" stripe @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="角色ID">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制角色ID:<el-tag type="primary" effect="dark" size="mini">{{ scope.row.roleId }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="scope.row.roleId" v-clipboard:success="clipboardSuccess" size="medium"> <svg-icon icon-class="peoples" /> {{ scope.row.roleId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制角色名称:<el-tag type="primary" effect="dark" size="mini">{{ scope.row.roleName }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="scope.row.roleName" v-clipboard:success="clipboardSuccess" size="medium"><i class="el-icon-user-solid" /> {{ scope.row.roleName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.status==='1'" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 正常</el-tag>
          <el-tag v-show="scope.row.status==='2'" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column align="center" label="创建时间" width="180">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.createTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="180">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.updateTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="primary" icon="el-icon-thumb" size="mini" @click="handleSelectMenu(scope.row)">分配权限</el-button>
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="form.roleName" placeholder="请输入角色名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleCode">
          <el-input v-model.trim="form.roleCode" placeholder="请输入权限字符" clearable size="small" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" clearable size="small" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" placeholder="请输入字典备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改弹出层结束 -->

    <!-- 分配权限和菜单弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="selectMenuOpen"
      width="400px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-tree
        ref="menu"
        :data="menuOptions"
        show-checkbox
        node-key="menuId"
        highlight-current
        empty-text="加载中，请稍后"
        :props="{id:'menuId',children:'children',label:'menuName'}"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSelectMenuSubmit">确 定</el-button>
        <el-button @click="cancelSelectMenu">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限和菜单弹出层结束 -->
  </div>
</template>
<script>
// 引入api
import { listRoleForPage, addRole, updateRole, getRoleById, deleteRoleByIds, saveRoleMenu } from '@/api/system/role'
import { selectMenuTree, getMenuIdsByRoleId } from '@/api/system/menu'

import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  directives: {
    clipboard
  },
  // 定义页面数据
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
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
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        roleName: undefined,
        status: undefined
      },
      // 表单数据
      form: {
        status: '1'
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      // 是否打开分配权限的弹出层
      selectMenuOpen: false,
      // 菜单树的数据
      menuOptions: [],
      // 当前选中持角色ID
      currentRoleId: undefined
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 查询表格数据
    this.getRoleList()
  },
  // 方法
  methods: {
    // 复制成功的回调函数
    clipboardSuccess() {
      this.msgSuccess('复制成功！')
    },
    // 查询表格数据
    getRoleList() {
      this.loading = true // 打开遮罩
      listRoleForPage(this.addDateRange(this.queryParams)).then(res => {
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
      this.queryParams.page = 1
      this.queryParams.size = 10
      this.getRoleList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.roleId)
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
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加角色信息'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改角色信息'
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
      this.$confirm('此操作将永久删除该角色数据, 是否继续?', '提示', {
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
        roleId: undefined,
        roleName: undefined,
        roleSort: 0,
        remark: undefined,
        status: '0'
      }
    },
    // 打开分配权限和菜单的弹出层
    handleSelectMenu(row) {
      this.currentRoleId = row.roleId || this.ids[0]
      this.title = '分配权限和菜单'
      this.selectMenuOpen = true
      // 查询所有可用的菜单
      selectMenuTree().then(res => {
        this.menuOptions = this.handleTree(res.data, 'menuId')
      })
      // 根据角色ID查询当前角色拥有的哪些菜单权限
      getMenuIdsByRoleId(this.currentRoleId).then(res => {
        this.$refs.menu.setCheckedKeys(res.data)
      })
    },
    // 保存角色和菜单权限的关系
    handleSelectMenuSubmit() {
      // 获取选中的keys
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 获取半选的keys
      const halfCheckKeys = this.$refs.menu.getHalfCheckedKeys()
      // 组合成最后的keys
      const finalKey = halfCheckKeys.concat(checkedKeys)
      // console.log(finalKey)
      saveRoleMenu(this.currentRoleId, finalKey).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          center: true,
          duration: '800',
          onClose: () => {
            this.$router.go(0)
          }
        })
      })
      this.selectMenuOpen = false
    },
    // 关闭分配权限和菜单的弹出层
    cancelSelectMenu() {
      this.selectMenuOpen = false
      this.menuOptions = []
    }
  }
}
</script>
