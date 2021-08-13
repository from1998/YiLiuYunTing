<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="58px">
      <el-form-item label="车牌号" prop="carNumber">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          style="width:180px"
        />
      </el-form-item>
      <el-form-item label="车主姓名" prop="carName" label-width="68px">
        <el-input
          v-model="queryParams.carName"
          placeholder="请输入车主姓名"
          clearable
          size="small"
          style="width:150px"
        />
      </el-form-item>
      <el-form-item label="车主手机号" prop="carPhone" label-width="85px">
        <el-input
          v-model="queryParams.carPhone"
          placeholder="请输入车主手机号"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

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
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="carTableList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车牌号" align="center" prop="carNumber" />
      <el-table-column label="车主姓名" align="center" prop="carName" />
      <el-table-column label="车主手机号" align="center" prop="carPhone" />
      <el-table-column label="车辆类型" align="center" prop="carCategory" />
      <el-table-column label="车位类型" align="center" prop="depotCategory" />
      <el-table-column label="是否在租" align="center" prop="carStatus" :formatter="carStatusFormate" />
      <el-table-column label="租车时间段" align="center" prop="timeSection" />
      <el-table-column label="车辆地址" align="center" prop="carAddress" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-thumb" size="mini" @click="handleRenew(scope.row)">续费</el-button>
          <el-button type="text" icon="el-icon-thumb" size="mini" @click="handleRenewHistory(scope.row)">续费历史</el-button>
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
    >
      <el-form ref="form" :model="form" :rules="validate" label-width="100px">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号" clearable size="small" />
        </el-form-item>
        <el-form-item label="车主姓名" prop="carName">
          <el-input v-model="form.carName" placeholder="请输入车主姓名" clearable size="small" />
        </el-form-item>
        <el-form-item label="车主手机号">
          <el-input v-model="form.carPhone" placeholder="请输入车主手机号" clearable size="small" />
        </el-form-item>
        <el-form-item label="车辆地址" prop="carAddress">
          <el-input v-model="form.carAddress" placeholder="请输入车辆地址" clearable size="small" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="carCategory">
          <el-select
            v-model="form.carCategory"
            placeholder="请选择车辆类型"
            clearable
            size="small"
            style="width:240px"
          >
            <el-option
              v-for="item in carCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车位类型" prop="depotCategory">
          <el-select
            v-model="form.depotCategory"
            placeholder="请选择车位类型"
            clearable
            size="small"
            style="width:240px"
          >
            <el-option
              v-for="item in depotCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时长类型" prop="timeCategory">
          <el-select
            v-model="form.timeCategory"
            placeholder="请选择时长类型"
            clearable
            size="small"
            style="width:240px"
          >
            <el-option
              v-for="item in timeCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.timeCategory==='分时段'" label="时间范围" prop="timeSection">
          <el-time-picker
            v-model="timeSection"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="请选择时间范围"
          />
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

    <!-- 续费弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="RenewOpen"
      width="600px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="validate" label-width="100px">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号" clearable size="small" :disabled="true" />
        </el-form-item>
        <el-form-item label="车主姓名" prop="carName">
          <el-input v-model="form.carName" placeholder="请输入车主姓名" clearable size="small" :disabled="true" />
        </el-form-item>
        <el-form-item label="续费金额" prop="renewFee">
          <el-tooltip class="item" effect="dark" content="请输入续费金额" placement="right">
            <el-input-number v-model="form.renewFee" :precision="2" :step="1" clearable size="small" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="续租时间" prop="renewFeeTime">
          <el-date-picker
            v-model="renewFeeTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRenewSubmit">确 定</el-button>
        <el-button @click="cancelRenew">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 续费弹出层结束 -->
    <!-- 续费历史弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="RenewHistoryOpen"
      width="900px"
      center
      append-to-body
    >
      <el-table v-loading="loading" border :data="carTableList" @selection-change="handleSelectionChnage">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="车牌号" align="center" prop="carNumber" />
        <el-table-column label="车主姓名" align="center" prop="carName" />
        <el-table-column label="车主手机号" align="center" prop="carPhone" />
        <el-table-column label="续费时间段" align="center" prop="" />
        <el-table-column label="续费时间" align="center" prop="time" />
        <el-table-column label="续费金额" align="center" prop="renewFee" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" align="center" @click="handleRenewHistorySubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 续费历史弹出层结束 -->

  </div>
</template>
<script>
// 引入api
import { listRoleForPage, addRole, updateRole, deleteRoleByIds, saveRoleMenu } from '@/api/system/role'
// import { selectMenuTree, getMenuIdsByRoleId } from '@/api/system/menu'
import validate from '@/utils/validate'

export default {
  // 定义页面数据
  data() {
    return {
      renewFeeTime: [],
      // 日期快捷选择
      pickerOptions: {
        shortcuts: [{
          text: '一周',
          onClick(picker) {
            const end = this.moment()
            const start = this.moment().subtract(-1, 'week')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一个月',
          onClick(picker) {
            const end = this.moment()
            const start = this.moment().subtract(-1, 'month')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '三个月',
          onClick(picker) {
            const end = this.moment()
            const start = this.moment().subtract(-3, 'month')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '半年',
          onClick(picker) {
            const end = this.moment()
            const start = this.moment().subtract(-6, 'month')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一年',
          onClick(picker) {
            const end = this.moment()
            const start = this.moment().subtract(-12, 'month')
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 验证规则
      validate,
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
      carTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 下拉列表
      carCategoryOptions: [],
      depotCategoryOptions: [],
      timeCategoryOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        carName: undefined,
        carPhone: undefined,
        carNumber: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      // 是否打开分配权限的弹出层
      RenewOpen: false,
      RenewHistoryOpen: false,
      // 菜单树的数据
      menuOptions: [],
      // 当前选中持角色ID
      currentRoleId: undefined
    }
  },
  // 勾子
  created() {
    // 查询下拉列表数据
    this.getSelectData()
    // 查询表格数据
    this.getRoleList()
  },
  // 方法
  methods: {
    // 格式化是否在租
    carStatusFormate() {
      // `this` 指向 vm 实例
      if (this.carStatus === '1') {
        return '在租'
      } else {
        return '不在租'
      }
    },
    // 查询下拉列表数据
    getSelectData() {
      this.carCategoryOptions = [
        { label: '通用', value: '1' },
        { label: '大车', value: '2' },
        { label: '小车', value: '3' }
      ]
      this.depotCategoryOptions = [
        { label: '免费车', value: '1' },
        { label: '产权车', value: '2' },
        { label: '储值车', value: '3' },
        { label: '临时车', value: '4' },
        { label: '特殊车', value: '5' },
        { label: '无牌车', value: '6' }
      ]
      this.timeCategoryOptions = [
        { label: '全天', value: '1' },
        { label: '分时段', value: '2' }
      ]
    },
    // 查询表格数据
    getRoleList() {
      this.loading = true // 打开遮罩
      listRoleForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        // this.carTableList = res.data.list
        this.carTableList = [
          {
            carNumber: '皖A22333',
            carName: '赵六',
            carPhone: '13155556666',
            carStatus: '1',
            carCategory: '小车',
            depotCategory: '储值车',
            timeCategory: '全天',
            timeSection: '',
            carAddress: '安徽省合肥市蜀山区南湖春城',
            remark: '这是一个备注'
          },
          {
            carNumber: '粤C66666',
            carName: '王五',
            carPhone: '13855556666',
            carStatus: '1',
            carCategory: '小车',
            depotCategory: '临时车',
            timeCategory: '分时段',
            timeSection: '2020-09-27 16：30：27 至 2021-09-27 16：30：27',
            carAddress: '广东省深圳市南山区人民法院',
            remark: '这是另一个备注'
          }
        ]
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
      this.ids = selection.map(item => item.carId)
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
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加车辆'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改车辆'
      // const carId = row.carId || this.ids
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据dictId查询一个字典信息
      this.loading = true
      // getRoleById(carId).then(res => {
      //   this.form = res.data
      //   this.loading = false
      // })
    },
    // 执行删除
    handleDelete(row) {
      const roleIds = row.carId || this.ids
      this.$confirm('此操作将永久删除该车辆数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteRoleByIds(roleIds).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
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
          if (this.form.carId === undefined) {
            addRole(this.form).then(res => {
              this.msgSuccess('保存成功')
              this.loading = false
              this.getRoleList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updateRole(this.form).then(res => {
              this.msgSuccess('修改成功')
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
      this.loading = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      // this.form = {
      //   carId: undefined,
      //   carNumber: '0',
      //   carName: undefined,
      //   carPhone: undefined,
      //   carStatus: undefined,
      //   remark: undefined
      // }
    },
    // 打开分配权限和菜单的弹出层
    handleRenew(row) {
      this.currentRoleId = row.carId || this.ids[0]
      this.title = '续费'
      this.RenewOpen = true
      // 查询所有可用的菜单
      // selectMenuTree().then(res => {
      //   this.menuOptions = this.handleTree(res.data, 'menuId')
      // })
      // 根据角色ID查询当前角色拥有的哪些菜单权限
      // getMenuIdsByRoleId(this.currentRoleId).then(res => {
      //   this.$refs.menu.setCheckedKeys(res.data)
      // })
    },
    handleRenewHistory(row) {
      this.currentRoleId = row.carId || this.ids[0]
      this.title = '续费历史'
      this.RenewHistoryOpen = true
      console.log(row)
    },
    // 续费确定操作
    handleRenewSubmit() {
      // 获取选中的keys
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 获取半选的keys
      const halfCheckKeys = this.$refs.menu.getHalfCheckedKeys()
      // 组合成最后的keys
      const finalKey = halfCheckKeys.concat(checkedKeys)
      // console.log(finalKey)
      saveRoleMenu(this.currentRoleId, finalKey).then(res => {
        this.msgSuccess('分配成功')
      }).catch(() => {
        this.msgSuccess('分配失败')
      })
    },
    // 取消续费操作
    cancelRenew() {
      this.RenewOpen = false
      this.menuOptions = []
    },
    // 续费历史确定操作
    handleRenewHistorySubmit() {
      this.RenewHistoryOpen = false
    }
  }
}
</script>
