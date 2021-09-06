<template>
  <div class="container">
    <el-header height="36px" style="padding:15px 0 45px;font-weight:700" align="center">
      保安管理
    </el-header>
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="保安姓名" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入保安姓名"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="保安手机号码" label-width="96px" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入保安手机号码"
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
    <el-table v-loading="loading" border :data="securityList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="realName" />
      <el-table-column label="手机号码" align="center" prop="mobile" />
      <el-table-column label="上下班时间" align="center" prop="workTimeDur" width="392">
        <template slot-scope="scope">
          <el-time-picker
            v-model="scope.row.Hours"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="HH-mm-ss"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="500">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="primary" icon="el-icon-setting" size="small" @click="handleWatchhouse(scope.row)">岗亭设置</el-button>
          <el-button type="primary" icon="el-icon-setting" size="small" @click="handleLane(scope.row)">车道设置</el-button>
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
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.realName" placeholder="请输入保安姓名" clearable size="small" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.mobile" placeholder="请输入保安手机号码" clearable size="small" />
        </el-form-item>
        <el-form-item label="上下班时间">
          <el-time-picker
            v-model="convertHours"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择上下班时间"
            value-format="HH-mm-ss"
            @change="timeChange(convertHours)"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 所属岗亭 -->
    <el-dialog
      title="所属岗亭"
      :visible.sync="openWatchhouse"
      width="500px"
      center
      append-to-body
    >
      <!-- 数据表格开始 -->
      <el-table v-loading="loading" border :data="laneList">
        <el-table-column label="车道名称" align="center" prop="name" />
        <el-table-column label="车道类型" align="center" prop="type" />
        <el-table-column label="所属岗亭" align="center" prop="workStation" />
        <el-table-column label="相机品牌" align="center" prop="cameraBrandType" />
        <el-table-column label="相机IP" align="center" prop="cameraIp" />
        <el-table-column label="是否有屏" align="center" prop="haveScreen" />
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
// 引入api
import { getBaoAnList, getBaoAnById, addBaoAn, updateBaoAn, deleteBaoAn } from '@/api/system/carSetting'

export default {
  name: 'SecManger', // 和对应路由表中配置的name值一致',
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
      securityList: [],
      // 弹出层标题
      title: '',
      // 是否显示添加修改弹出层
      open: false,
      // 是否显示所属岗亭
      openWatchhouse: false,
      // 是否显示负责车道
      openAdministerLane: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        realName: undefined,
        mobile: undefined,
        parentId: undefined
      },
      // 表单数据
      form: {
        realName: '',
        mobile: '',
        startWorkTime: '',
        endWorkTime: '',
        parentId: undefined
        // workTimeDur: [new Date(), new Date()],
        // watchhouseName: '',
        // administerLane: ''
      },
      // 所属岗亭
      watchhouse: {},
      // 负责车道
      administerLane: {},
      // 待转换的上下班时间,默认朝8晚7
      convertHours: [new Date(0, 0, 0, 8, 0), new Date(0, 0, 0, 19, 0)],
      // 遍历数据
      options: []
    }
  },
  // 勾子
  created() {
    // 取路由路径上的参数
    this.queryParams.parentId = this.manageridBak = this.form.parentId = this.$route.params && this.$route.params.id // 路由传参
    // 查询表格数据
    this.getSecurityList()
  },
  // 方法
  methods: {
    // 查询列表数据
    getSecurityList() {
      getBaoAnList(this.queryParams).then(res => {
        this.securityList = res.data.list.map(val => {
          return {
            id: val.id,
            realName: val.realName,
            mobile: val.mobile,
            Hours: [val.startWorkTime, val.endWorkTime]
          }
        })
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 查询
    handleQuery() {
      this.getSecurityList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.parentId = this.manageridBak
      this.getSecurityList()
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
      this.title = '添加保安'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改保安'
      const id = row.id || this.ids
      this.open = true
      this.reset()
      // 根据id查询保安信息
      this.loading = true
      getBaoAnById(id).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const id = row.id || this.ids
      this.$confirm('此操作将永久删除该保安数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteBaoAn(id).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getSecurityList()// 全查询
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
            addBaoAn(this.form).then(res => {
              this.msgSuccess('保存成功')
              this.loading = false
              this.getSecurityList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改、
            updateBaoAn(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.getSecurityList()// 列表重新查询
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
        realName: '',
        mobile: '',
        parentId: this.manageridBak,
        startWorkTime: '08-00-00',
        endWorkTime: '19-00-00'
      }
    },
    timeChange(val) {
      this.form.startWorkTime = val[0]
      this.form.endWorkTime = val[1]
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

