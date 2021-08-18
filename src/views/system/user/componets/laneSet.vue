<template>
  <div class="container">
    <el-header height="36px" style="padding:15px 0 45px;font-weight:700" align="center">
      车道设置
    </el-header>
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="车道名称">
        <el-input
          v-model="queryParams.laneName"
          placeholder="请输入车道名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="所属岗亭">
        <el-input
          v-model="queryParams.watchhouseName"
          placeholder="请输入所属岗亭名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="车道类型">
        <el-select
          v-model="queryParams.laneCategory"
          placeholder="请选择车道类型"
          clearable
          size="small"
        >
          <el-option
            v-for="item in options.laneCategory"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
    <el-table v-loading="loading" border :data="laneList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="ID" width="50" align="center" prop="laneId" />
      <el-table-column label="车道名称" align="center" prop="laneName" />
      <el-table-column label="车道类型" align="center" prop="laneCategory" />
      <el-table-column label="所属岗亭" align="center" prop="watchhouseName" />
      <el-table-column label="相机状态" align="center">
        <template slot-scope="scope">
          <!-- <el-result icon="scope.row.cameraState==='在线'?success:error" /> -->
          <el-result icon="success" title="成功提示" sub-title="请根据提示进行操作" />
          <span>{{ scope.row.cameraState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="相机品牌" align="center" prop="cameraBrand" />
      <el-table-column label="相机识别码" align="center" prop="cameraUDID" />
      <el-table-column label="相机IP" align="center" prop="cameraIP" />
      <el-table-column label="控制卡类型" align="center" prop="controlCardType" />
      <el-table-column label="是否有屏" align="center" prop="hasScreen" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">开闸</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">关闸</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">无牌进场二维码</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">出场支付二维码</el-button>
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
        <el-form-item label="车场名称" prop="parkinglotName">
          <el-input v-model="form.parkinglotName" placeholder="请输入车场名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="岗亭名称" prop="watchhouseName">
          <el-input v-model="form.watchhouseName" placeholder="请输入岗亭名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入岗亭备注" clearable size="small" />
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
  name: 'LaneSet',
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
      LaneList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        laneName: undefined,
        watchhouseName: undefined,
        laneCategory: undefined

      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        parkinglotName: [
          { required: true, message: '车场名称不能为空', trigger: 'blur' }
        ],
        watchhouseName: [
          { required: true, message: '岗亭名称不能为空', trigger: 'blur' }
        ]
      },
      options: []
    }
  },
  // 勾子
  created() {
    // 查询表格数据
    this.getlaneList()
  },
  // 方法
  methods: {
    // 查询表格数据
    getlaneList() {
      // this.loading = true // 打开遮罩
      // listRoleForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
      //   this.LaneList = res.data.list
      //   this.total = res.data.total
      //   this.loading = false// 关闭遮罩
      // })
      this.options = {
        laneCategory: [
          {
            value: 1,
            label: '入口'
          }, {
            value: 0,
            label: '出口'
          }
        ]
      }
      this.laneList = [
        {
          laneId: '0',
          laneName: 'A车道',
          laneCategory: '出口',
          watchhouseName: '一号岗亭',
          cameraState: '在线',
          cameraBrand: '索尼',
          cameraUDID: '18030007835d',
          cameraIP: '	192.168.1.230',
          controlCardType: '一流云停-RTK-1.7-TTS',
          hasScreen: '是'
        },
        {
          laneId: '0',
          laneName: 'B车道',
          laneCategory: '出口',
          watchhouseName: '二号岗亭',
          cameraState: '不在线',
          cameraBrand: '康佳',
          cameraUDID: '09F5103100152146',
          cameraIP: '	192.168.1.30',
          controlCardType: '一流云停-RTK-1.7-TTS',
          hasScreen: '否'
        },
        {
          laneId: '0',
          laneName: 'C车道',
          laneCategory: '出口',
          watchhouseName: '三号岗亭',
          cameraState: '不在线',
          cameraBrand: '爱立信',
          cameraUDID: '96603100152146',
          cameraIP: '	192.168.1.226',
          controlCardType: '一流云停-RTK-1.7-TTS',
          hasScreen: '是'
        },
        {
          laneId: '0',
          laneName: 'D车道',
          laneCategory: '出口',
          watchhouseName: '四号岗亭',
          cameraState: '在线',
          cameraBrand: 'TCL',
          cameraUDID: '045103100152146',
          cameraIP: '	192.168.1.158',
          controlCardType: '一流云停-RTK-1.7-TTS',
          hasScreen: '否'
        }
      ]
      this.total = this.laneList.length
      console.log('查询成功')
    },
    // 查询
    handleQuery() {
      this.getlaneList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getlaneList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.watchhouseId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getlaneList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getlaneList()
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加车道'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改车道'
      const watchhouseId = row.watchhouseId || this.ids
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据id查询岗亭信息
      // this.loading = true
      // getRoleById(watchhouseId).then(res => {
      //   this.form = res.data
      //   this.loading = false
      // })
      console.log(watchhouseId)
      this.msgSuccess('修改弹出成功')
    },
    // 执行删除
    handleDelete(row) {
      const watchhouseId = row.watchhouseId || this.ids
      this.$confirm('此操作将永久删除该车道数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.loading = true
        // deleteRoleByIds(roleIds).then(res => {
        //   this.loading = false
        //   this.msgSuccess('删除成功')
        //   this.getlaneList()// 全查询
        // })
        console.log(watchhouseId)
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
          if (this.form.watchhouseId === undefined) {
            // addRole(this.form).then(res => {
            //   this.msgSuccess('保存成功')
            //   this.loading = false
            //   this.getlaneList()// 列表重新查询
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
            //   this.getlaneList()// 列表重新查询
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
        watchhouseId: undefined,
        watchhouseName: undefined,
        parkinglotName: undefined,
        remark: undefined
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
