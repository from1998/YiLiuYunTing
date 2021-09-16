<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row>
      <el-col :span="18" :offset="6">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="58px">
          <el-form-item label="姓名" prop="userName" label-width="68px">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入车主姓名"
              clearable
              size="small"
              style="width:150px"
            />
          </el-form-item>
          <el-form-item label="车牌号" prop="carNumber">
            <el-input
              v-model="queryParams.carNumber"
              placeholder="请输入车牌号"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="层号" prop="tierNumber">
            <el-select v-model="queryParams.tierNumber" placeholder="请选择车位层号" size="small" clearable>
              <el-option
                v-for="item in options.tierNumber"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区域号" prop="areaNumber">
            <el-select v-model="queryParams.areaNumber" placeholder="请选择车位区域号" size="small" clearable>
              <el-option
                v-for="item in options.areaNumber"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="renewTableList" @selection-change="handleSelectionChnage">
      <el-table-column label="车主姓名" align="center" prop="userName" />
      <el-table-column label="车牌号" align="center" prop="carNumber" />
      <el-table-column label="层号" align="center" prop="tierNumber" :formatter="tierNumberFormatter" />
      <el-table-column label="区域号" align="center" prop="areaNumber" :formatter="areaNumberFormatter" />
      <el-table-column label="编号" align="center" prop="number" />
      <el-table-column label="起租时间" align="center" prop="effectiveTime" />
      <el-table-column label="到期时间" align="center" prop="expireTime" />
      <el-table-column label="费用" align="center" prop="amount" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
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

    <!-- 修改弹出层 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入车主姓名" clearable size="small" disabled />
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号" clearable size="small" disabled />
        </el-form-item>
        <el-form-item v-if="form.registerType===3" label="续租时间段">
          <el-row :gutter="0">
            <el-col :span="12" :offset="0">
              <el-form-item label="" prop="startSplit">
                <el-time-picker
                  v-model="form.startSplit"
                  value-format="HH-mm-ss"
                  placeholder="开始时间"
                  style="width:140px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="" prop="endSplit">
                <el-time-picker
                  v-model="form.endSplit"
                  value-format="HH-mm-ss"
                  placeholder="结束时间"
                  style="width:140px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="续费金额" prop="amount">
          <el-input-number v-model="form.amount" :precision="2" :step="1" clearable size="small" :min="0" style="width:370px" placeholder="请输入续费金额" />
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
import { getPortRenewHistory, delRenewHistory } from '@/api/carManger'
import validate from '@/utils/validate.js'

export default {
  // 定义页面数据
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        userName: validate.notEmpty,
        carNumber: validate.carNumber,
        tierNumber: validate.notEmpty,
        areaNumber: validate.notEmpty,
        amount: validate.notEmpty
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
        userName: undefined,
        tierNumber: undefined,
        areaNumber: undefined,
        registerId: undefined,
        mobile: undefined
      },
      // 表单数据
      form: {
        registerId: ''
      }
    }
  },
  // 勾子
  created() {
    // 取路由路径上的参数
    this.queryParams.registerId = this.form.registerId = this.$route.params && this.$route.params.id // 路由传参
    // 获取车位层号字典数据
    this.getDataByType('TierNumberDic').then(res => {
      this.options.tierNumber = res.data
    })
    // 获取车位区域号字典数据
    this.getDataByType('AreaNumberDic').then(res => {
      this.options.areaNumber = res.data
    })
    // 查询续费历史记录列表数据
    this.getList()
  },
  methods: {
    // 翻译车位层号
    tierNumberFormatter(row) {
      return this.selectDictLabel(this.options.tierNumber, row.tierNumber.toString())
    },
    // 翻译车位区域号
    areaNumberFormatter(row) {
      return this.selectDictLabel(this.options.areaNumber, row.areaNumber.toString())
    },
    // 查询续费历史记录列表数据
    getList() {
      this.loading = true // 打开遮罩
      getPortRenewHistory(this.queryParams).then(res => {
        this.renewTableList = res.data.list
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
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改续费记录'
      this.open = true
      this.reset()
      this.form = {
        userName: row.userName,
        carNumber: row.carNumber,
        amount: row.amount
      }
    },
    // 打开删除的弹出层
    handleDelete(row) {
      delRenewHistory(row.id).then(res => {
        this.msgSuccess('删除成功')
        this.getList()
      })
    },
    // 保存
    handleSubmit() {
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      //     this.loading = true
      //     if (this.form.id === undefined || this.form.id === null || this.form.id === '') { // 做添加
      //       addPort(this.form).then(res => {
      //         this.msgSuccess('保存成功')
      //         this.loading = false
      //         this.getList()// 列表重新查询
      //         this.open = false// 关闭弹出层
      //       }).catch(() => {
      //         this.loading = false
      //       })
      //     } else { // 做修改
      //       updatePort(this.form).then(res => {
      //         this.msgSuccess('修改成功')
      //         this.loading = false
      //         this.getList()// 列表重新查询
      //         this.open = false// 关闭弹出层
      //       }).catch(() => {
      //         this.loading = false
      //       })
      //     }
      //   }
      // })
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
    }
  }
}
</script>
