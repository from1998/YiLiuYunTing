<template>
  <div class="container">
    <el-header height="36px" style="padding:15px 0 45px;font-weight:700" align="center">
      车位管理
    </el-header>
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="车位层号" prop="portLevel">
        <el-input
          v-model="queryParams.portLevel"
          placeholder="请输入车位层号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="车位区域号" label-width="96px" prop="portArea">
        <el-input
          v-model="queryParams.portArea"
          placeholder="请输入车位区域号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="车位编号" label-width="96px" prop="portSerialNumber">
        <el-input
          v-model="queryParams.portSerialNumber"
          placeholder="请输入车位编号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格工具按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="portList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车位层号" align="center" prop="portLevel" />
      <el-table-column label="车位区域号" align="center" prop="portArea" />
      <el-table-column label="车位编号" align="center" prop="portSerialNumber" width="180" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="186">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top:10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="层号">
          <el-input v-model="form.securityName" placeholder="请输入车位层号" clearable size="small" />
        </el-form-item>
        <el-form-item label="区域号">
          <el-input v-model="form.securityPhone" placeholder="请输入车位区域号" clearable size="small" />
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="form.securityIdCard" placeholder="请输入车位编号" clearable size="small" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入api
// import { listRoleForPage, addRole, updateRole, getRoleById, deleteRoleByIds, saveRoleMenu } from '@/api/system/role'
// import { selectMenuTree, getMenuIdsByRoleId } from '@/api/system/menu'

export default {
  name: 'PortManger', // 和对应路由表中配置的name值一致
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
      // 表格数据
      portList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        portLevel: undefined,
        portArea: undefined,
        portSerialNumber: undefined
      },
      // 表单数据
      form: {
        portLevel: undefined,
        portArea: undefined,
        portSerialNumber: undefined,
        remark: ''
      }
    }
  },
  // 勾子
  created() {
    // 查询表格数据
    this.getSecurityList()
  },
  // 方法
  methods: {
    // 查询表格数据
    getSecurityList() {
      // this.loading = true // 打开遮罩
      // listRoleForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
      //   this.portList = res.data.list
      //   this.total = res.data.total
      //   this.loading = false// 关闭遮罩
      // })
      this.portList = [
        {
          portId: '0',
          portLevel: '地下一层',
          portArea: 'A',
          portSerialNumber: '	127',
          remark: '这是一个备注'
        },
        {
          portId: '1',
          portLevel: '地下二层',
          portArea: 'B',
          portSerialNumber: '	157',
          remark: '这是一个备注'
        },
        {
          portId: '2',
          portLevel: '地下三层',
          portArea: 'C',
          portSerialNumber: '	107',
          remark: '这是一个备注'
        },
        {
          portId: '3',
          portLevel: '地下四层',
          portArea: 'B',
          portSerialNumber: '	007',
          remark: '这是一个备注'
        },
        {
          portId: '0',
          portLevel: '地下五层',
          portArea: 'A',
          portSerialNumber: '	027',
          remark: '这是一个备注'
        }
      ]
      this.total = 5
      console.log('查询成功')
    },
    // 查询
    handleQuery() {
      this.getSecurityList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getSecurityList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.securityId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getSecurityList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getSecurityList()
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加车位'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改车位'
      const securityId = row.securityId || this.ids
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据id查询岗亭信息
      // this.loading = true
      // getRoleById(securityId).then(res => {
      //   this.form = res.data
      //   this.loading = false
      // })
      console.log(securityId)
      this.msgSuccess('修改弹出成功')
    },
    // 执行删除
    handleDelete(row) {
      const securityId = row.securityId || this.ids
      this.$confirm('此操作将永久删除该车位数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.loading = true
        // deleteRoleByIds(roleIds).then(res => {
        //   this.loading = false
        //   this.msgSuccess('删除成功')
        //   this.getSecurityList()// 全查询
        // })
        console.log(securityId)
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
          if (this.form.securityId === undefined) {
            // addRole(this.form).then(res => {
            //   this.msgSuccess('保存成功')
            //   this.loading = false
            //   this.getSecurityList()// 列表重新查询
            //   this.open = false// 关闭弹出层
            // }).catch(() => {
            //   this.loading = false
            // })
            console.log('添加')
          } else { // 做修改、
            console.log('修改')
            // updateRole(this.form).then(res => {
            //   this.msgSuccess('修改成功')
            //   this.loading = false
            //   this.getSecurityList()// 列表重新查询
            //   this.open = false// 关闭弹出层
            // }).catch(() => {
            //   this.loading = false
            // })
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
        securityName: '',
        securityPhone: '',
        securityIdCard: '',
        workTimeDur: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
width: 80%;
margin: 0 auto;
}
</style>

