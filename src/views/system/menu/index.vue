<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="105px">
      <el-row>
        <el-col :span="6" :offset="0">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
        </el-col>
        <el-col :span="12" :offset="6">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input
              v-model="queryParams.menuName"
              placeholder="请输入菜单名称"
              clearable
              size="small"
              style="width:240px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status" label-width="40px">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              size="small"
              style="width:200px"
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
        </el-col>
      </el-row>
    </el-form>
    <!-- 查询条件结束 -->
    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="menuTableList"
      row-key="menuId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      stripe
    >
      <el-table-column label="菜单名称" align="left" prop="menuName" />
      <el-table-column label="菜单类型" align="center" prop="menuType">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.menuType==='M'?'info':scope.row.menuType==='C'?'primary':'danger'"
            size="mini"
            effect="dark"
          >
            {{ scope.row.menuType==='M'?'目录':scope.row.menuType==='C'?'菜单':'权限' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组件路径" width="280">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>点击跳转到：{{ scope.row.path }}</p>
            <router-link
              v-show="scope.row.menuType==='C'"
              slot="reference"
              type="primary"
              :to="scope.row.path"
              class="name-wrapper"
            >
              <span style="color:#409EFF"><i class="el-icon-s-promotion" /> {{ scope.row.path }}</span>
            </router-link>
          </el-popover>
          <span v-show="scope.row.menuType!=='C'">{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormatter" />
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.createTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="备注"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>备注: {{ scope.row.remark }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;"><i class="el-icon-notebook-2" /> {{ scope.row.remark }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd(scope.row)">添加</el-button>
          <el-button type="success" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 数据表格结束 -->

    <!-- 添加和修改的弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentName">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :show-count="true"
                :normalizer="normalizer"
                placeholder="请选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType==='F'" label="权限标识" prop="percode">
              <el-input v-model="form.percode" placeholder="请输入权限标识" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :value="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加和修改的弹出层结束 -->

  </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listAllMenus, selectMenuTree, getMenuById, addMenu, updateMenu, deleteMenuById } from '@/api/system/menu'
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 菜单表的数据
      menuTableList: [],
      // 菜单树的数据
      menuOptions: [],
      // 弹出层的title
      title: '',
      // 是否打开弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', tirgger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 查询状态字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 初始加载菜单和权限数据
    this.getMenuList()
  },
  methods: {
    // 查询菜单数据
    getMenuList() {
      this.loading = true
      listAllMenus(this.queryParams).then(res => {
        this.menuTableList = this.handleTree(res.data, 'menuId')
        this.loading = false
      })
    },
    // 翻译登陆状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 查询
    handleQuery() {
      this.getMenuList()
    },
    // 重置
    resetQuery() {
      this.resetForm('queryForm')
      this.getMenuList()
    },
    // 添加
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null) {
        this.form.parentId = row.menuId
        if (row.menuType === 'M') {
          this.form.menuType = 'C'
        } else if (row.menuType === 'C') {
          this.form.menuType = 'F'
        }
      }
      this.open = true
      this.title = '添加菜单权限'
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      getMenuById(row.menuId).then(res => {
        this.form = res.data
        this.open = true
        this.title = '修改菜单权限'
      })
    },
    // 查询菜单下拉树的数据
    getTreeselect() {
      selectMenuTree().then(res => {
        this.menuOptions = []
        const menu = { menuId: 0, menuName: '主类目', children: [] }
        menu.children = this.handleTree(res.data, 'menuId')
        this.menuOptions.push(menu)
      })
    },
    // 自定义键名
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    },
    // 提交
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 做添加
          this.loading = true
          if (this.form.menuId === undefined) {
            addMenu(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.open = false// 关闭弹出层
              this.$router.go(0)
            })
            this.loading = false
          } else { // 做修改
            updateMenu(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.open = false// 关闭弹出层
              this.$router.go(0)
            })
            this.loading = false
          }
        }
      })
    },
    cancel() {
      this.open = false
    },
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        percode: undefined,
        path: undefined,
        menuType: 'M',
        remark: undefined,
        status: '0'
      }
    },
    // 删除
    handleDelete(row) {
      const menuId = row.menuId
      this.$confirm('此操作将永久删除该菜单权限数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteMenuById(menuId).then(res => {
          this.loading = false
          this.msgSuccess(res.msg)
          this.getMenuList()// 全查询
        })
        this.loading = false
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    }
  }
}
</script>
