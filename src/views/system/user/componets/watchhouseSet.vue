<template>
  <div class="container">
    <el-header height="36px" style="padding:15px 0 45px;font-weight:700" align="center">
      岗亭设置
    </el-header>
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="岗亭名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入岗亭名称"
          clearable
          size="small"
          style="width:240px"
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
    <el-table v-loading="loading" border :data="watchhouseList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="岗亭ID" align="center" prop="id" />
      <el-table-column label="车场名称" align="center" prop="parkName" />
      <el-table-column label="岗亭名称" align="center" prop="name" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="岗亭名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入岗亭名称" clearable size="small" />
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
import { deleteWorkStationById, updateWorkStation, addWorkStation, getWorkStationByMid, getWorkStationById, getWorkStationLikeName } from '@/api/system/carSetting'

export default {
  name: 'WatchhouseSet',
  // 定义页面数据
  data() {
    return {
      // 用户id备份
      manageridBak: '',
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
      watchhouseList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        name: '',
        managerid: ''
      },
      // 表单数据
      form: {
        managerid: ''
      },
      // 表单校验
      rules: {
        watchhouseName: [
          { required: true, message: '岗亭名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 勾子
  created() {
    // 取路由路径上的参数
    this.queryParams.managerid = this.manageridBak = this.form.managerid = this.$route.params && this.$route.params.id // 路由传参
    // 查询表格数据
    this.getWatchhouseList()
  },
  // 方法
  methods: {
    // 传递岗亭数据给车道设置
    handle() {
      // 2、传递数据方，通过一个事件触发bus.$emit(方法名，传递的数据)   触发兄弟组件的事件
      const watchHouse = this.watchhouseList.map(val => {
        return {
          id: val.id,
          name: val.name
        }
      })
      this.bus.$emit('watchHouse', watchHouse)
    },
    getWatchhouseList() {
      this.loading = true // 打开遮罩
      getWorkStationByMid(this.queryParams).then(res => {
        this.watchhouseList = res.data.list
        this.total = res.data.total
        // 调用岗亭数据传递函数
        this.handle()
        this.loading = false// 关闭遮罩
      })
    },
    // 查询
    handleQuery() {
      getWorkStationLikeName()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getWatchhouseList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getWatchhouseList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getWatchhouseList()
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加岗亭'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改岗亭'
      const id = row.id || this.ids
      this.open = true
      this.reset()
      // 根据id查询岗亭信息
      this.loading = true
      getWorkStationById(id).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm('此操作将永久删除该用户数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteWorkStationById(userIds).then(() => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getWatchhouseList()// 全查询
        }).catch(() => {
          this.msgError('删除失败')
          this.loading = false
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
          if (this.form.id === undefined) {
            addWorkStation(this.form).then(res => {
              this.msgSuccess('保存成功')
              this.loading = false
              this.getWatchhouseList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updateWorkStation(this.form).then(() => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.getWatchhouseList()// 列表重新查询
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
        name: undefined,
        managerid: this.manageridBak
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
