<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row>
      <el-col :span="10">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
        <el-button type="primary" icon="el-icon-download" size="mini" @click="handleDownload">模板下载</el-button>
        <el-button type="success" size="mini" @click="handleImport">
          <svg-icon icon-class="import" />
          导入车辆
        </el-button>
        <el-button type="warning" size="mini" @click="handleExport">
          导出车辆
          <svg-icon icon-class="export" />
        </el-button>
      </el-col>
      <el-col :span="14" :offset="0">
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
          <el-form-item label="车主姓名" prop="userName" label-width="68px">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入车主姓名"
              clearable
              size="small"
              style="width:150px"
            />
          </el-form-item>
          <el-form-item label="车主手机号" prop="mobile" label-width="85px">
            <el-input
              v-model="queryParams.mobile"
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
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="carTableList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车牌号" align="center" prop="carNumber" />
      <el-table-column label="车主姓名" align="center" prop="userName" />
      <el-table-column label="车主手机号" align="center" prop="mobile" />
      <el-table-column label="车辆类型" align="center" prop="carType" :formatter="carTypeFormatter" />
      <el-table-column label="车位类型" align="center" prop="registerType" :formatter="registerTypeFormatter" />
      <el-table-column label="是否在租" align="center">
        <template slot-scope="scope">
          <el-button v-show=" scope.row.status===1" type="success" icon="el-icon-check" size="mini" class="btnMini">在租中</el-button>
          <el-button v-show="scope.row.status===0" type="danger" icon="el-icon-close" size="mini" class="btnMini">不在租</el-button>
        </template>
      </el-table-column>
      <el-table-column label="租车时间段" align="center" prop="workTimeDur" width="392">
        <template slot-scope="scope">
          <el-row :gutter="0">
            <el-col :span="11" :offset="0">
              <el-time-picker
                v-model="scope.row.effectiveTime"
                value-format="HH-mm-ss"
                placeholder="起租时间"
                style="width:140px"
                disabled
              />
            </el-col>
            <el-col :span="2" :offset="0" style="margin-top:6px">
              --
            </el-col>
            <el-col :span="11" :offset="0">
              <el-time-picker
                v-model="scope.row.expireTime"
                value-format="HH-mm-ss"
                placeholder="到期时间"
                style="width:140px"
                disabled
              />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="车辆地址" align="center" prop="address" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-coin" size="mini" @click="handleRenew(scope.row)">
            <span>续费</span>
          </el-button>
          <router-link :to="'/carManger/index/renewHistory/' + scope.row.id" class="link-type">
            <el-button type="text" size="mini" icon="el-icon-tickets">
              <span>续费历史</span>
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
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号" clearable size="small" />
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入车主姓名" clearable size="small" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入车主手机号" clearable size="small" />
        </el-form-item>
        <el-form-item label="车辆地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入车辆地址" clearable size="small" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="carType">
          <el-select
            v-model="form.carType"
            placeholder="请选择车辆类型"
            clearable
            size="small"
            style="width:365px"
          >
            <el-option
              v-for="item in options.carCategoryOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车位类型" prop="registerType">
          <el-select
            v-model="form.registerType"
            placeholder="请选择车位类型"
            clearable
            size="small"
            style="width:365px"
          >
            <el-option
              v-for="item in options.depotCategoryOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.registerType===3" label="时长类型" prop="splitType">
          <el-select
            v-model="form.splitType"
            placeholder="请选择时长类型"
            clearable
            size="small"
            style="width:365px"
          >
            <el-option
              v-for="item in options.timeCategoryOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-row v-if="form.splitType===2" :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="开始时间" prop="startSplit">
              <el-time-picker
                v-model="form.startSplit"
                value-format="HH-mm-ss"
                placeholder="开始时间"
                style="width:140px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="结束时间" prop="endSplit">
              <el-time-picker
                v-model="form.endSplit"
                value-format="HH-mm-ss"
                placeholder="结束时间"
                style="width:140px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 续费弹出层开始 -->
    <el-dialog
      title="续费"
      :visible.sync="RenewOpen"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="renewForm" :model="renewform" :rules="rules" label-width="100px">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="renewform.carNumber" placeholder="请输入车牌号" clearable size="small" :disabled="true" />
        </el-form-item>
        <el-form-item label="车主姓名" prop="userName">
          <el-input v-model="renewform.userName" placeholder="请输入车主姓名" clearable size="small" :disabled="true" />
        </el-form-item>
        <el-form-item v-if="form.registerType===3" label="续租时间段">
          <el-row :gutter="0">
            <el-col :span="11" :offset="0">
              <el-time-picker
                v-model="renewform.effectiveTime"
                value-format="HH-mm-ss"
                placeholder="起租时间"
                style="width:140px"
              />
            </el-col>
            <el-col :span="2" :offset="0">
              --
            </el-col>
            <el-col :span="11" :offset="0">
              <el-time-picker
                v-model="renewform.expireTime"
                value-format="HH-mm-ss"
                placeholder="到期时间"
                style="width:140px"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="层号" prop="tierNumber">
          <el-select v-model="renewform.tierNumber" placeholder="请选择车位层号" size="small" style="width:350px">
            <el-option
              v-for="item in options.tierNumber"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区域号" prop="areaNumber">
          <el-select v-model="renewform.areaNumber" placeholder="请选择车位区域号" size="small" style="width:350px">
            <el-option
              v-for="item in options.areaNumber"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model="renewform.number" placeholder="请输入车位编号" clearable size="small" />
        </el-form-item>
        <el-form-item label="续费金额" prop="amount">
          <el-tooltip class="item" effect="dark" content="请输入续费金额" placement="right">
            <el-input-number v-model="renewform.amount" :precision="2" :step="1" clearable size="small" :min="0" style="width:350px" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="renewform.remark" type="textarea" placeholder="请输入备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRenewSubmit">确 定</el-button>
        <el-button @click="cancelRenew">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
// 引入api
import { getPortList, getPortType, getPortById, addPort, updatePort, deletePort, doRenew, exportRegisterCar } from '@/api/carManger'
import validate from '@/utils/validate.js'

export default {
  // 定义页面数据
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        carNumber: validate.carNumber,
        address: validate.notEmpty,
        carType: validate.notEmpty,
        registerType: validate.notEmpty,
        splitType: validate.notEmpty,
        tierNumber: validate.notEmpty,
        areaNumber: validate.notEmpty,
        number: validate.notEmpty
      },
      // 日期快捷选择
      pickerOptions: {
        shortcuts: [{
          text: '一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
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
      // 车位列表数据
      carTableList: [],
      // 续费历史列表数据
      renewTableList: [],
      // 添加修改弹出层标题
      title: '',
      // 添加修改弹出层
      open: false,
      // 续费弹出层
      RenewOpen: false,
      // 续费历史弹出层
      RenewHistoryOpen: false,
      // 下拉列表数据
      options: {
        carCategoryOptions: [],
        depotCategoryOptions: [],
        timeCategoryOptions: [],
        areaNumber: [],
        tierNumber: []
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        carName: undefined,
        userName: undefined,
        mobile: undefined
      },
      // 表单数据
      form: {},
      renewform: {
        registerId: ''
      }
    }
  },
  // 勾子
  created() {
    // 获取车辆类型字典数据
    this.getDataByType('CarTypeDic').then(res => {
      this.options.carCategoryOptions = res.data
    })
    // 获取时段类型字典数据
    this.getDataByType('RegisterSplitTypeDic').then(res => {
      this.options.timeCategoryOptions = res.data
    })
    // 获取车位层号字典数据
    this.getDataByType('TierNumberDic').then(res => {
      this.options.tierNumber = res.data
    })
    // 获取车位区域号字典数据
    this.getDataByType('AreaNumberDic').then(res => {
      this.options.areaNumber = res.data
    })
    // 获取车位类型数据
    getPortType().then(res => {
      this.options.depotCategoryOptions = res.data
    })
    // 查询车位列表数据
    this.getList()
  },
  methods: {
    // 翻译车辆类型
    carTypeFormatter(row) {
      return this.selectDictLabel(this.options.carCategoryOptions, row.carType.toString())
    },
    // 翻译车位类型
    registerTypeFormatter(row) {
      return this.selectDictLabel(this.options.depotCategoryOptions, row.registerType.toString())
    },
    // 查询车位列表数据
    getList() {
      this.loading = true // 打开遮罩
      getPortList(this.queryParams).then(res => {
        this.carTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.getList()
    },
    // 重置条件查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getList()
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
      this.getList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getList()
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
      this.open = true
      const portIds = row.id || this.ids[0]
      this.reset()
      this.getInfoById(portIds, 'form')
    },
    // 根据id查询车辆信息
    getInfoById(id, form) {
      this.loading = true
      const query = { 'id': id }
      getPortById(query).then(res => {
        this[form] = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const portIds = row.id || this.ids
      this.$confirm('此操作将永久删除该车辆数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deletePort(portIds).then(res => {
          this.msgSuccess('删除成功')
          this.getList()
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
          this.loading = true
          if (this.form.id === undefined || this.form.id === null || this.form.id === '') { // 做添加
            addPort(this.form).then(res => {
              this.msgSuccess('保存成功')
              this.loading = false
              this.getList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updatePort(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.getList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 取消添加或修改
    cancel() {
      this.open = false
      this.loading = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.resetForm('renewform')
    },
    // 打开续费弹出层
    handleRenew(row) {
      this.RenewOpen = true
      const portIds = row.id || this.ids
      this.reset()
      this.getInfoById(portIds, 'renewform')
    },
    // 续费确定操作
    handleRenewSubmit() {
      this.renewform.registerId = this.renewform.id
      this.$refs['renewForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          doRenew(this.renewform).then(res => {
            this.msgSuccess('续费成功')
            this.loading = false
            this.getList()// 列表重新查询
            this.RenewOpen = false// 关闭弹出层
          }).catch(() => {
            this.msgError('续费失败')
            this.loading = false
          })
        }
      })
    },
    // 取消续费操作
    cancelRenew() {
      this.RenewOpen = false
    },
    // 模板下载
    handleDownload() {
      this.loading = true
      exportRegisterCar(this.renewform).then(res => {
        this.loading = false
      }).catch(() => {
        this.msgError('模板下载失败')
        this.loading = false
      })
    },
    // 导入车辆
    handleImport() {
      console.log('导入成功')
    },
    // 导出车辆
    handleExport() {
      console.log('导出成功')
    }
  }
}
</script>
<style lang="scss" scoped>
  .btnMini {
    padding: 0 5px!important;
    height: 17px;
    margin-left: 0;
    cursor: default;
  }
</style>
