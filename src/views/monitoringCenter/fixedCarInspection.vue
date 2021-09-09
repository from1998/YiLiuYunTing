<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row>
      <el-col :span="14" :offset="10">
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
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="carTableList" stripe>
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
          <el-button type="primary" size="mini" @click="handleRenewHistory(scope.row)">
            <svg-icon icon-class="money" />
            查看续费历史
          </el-button>
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

    <!-- 续费历史弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="RenewHistoryOpen"
      width="900px"
      center
      append-to-body
    >
      <el-table v-loading="loading" border :data="carTableList">
        <el-table-column label="车牌号" align="center" prop="carNumber" />
        <el-table-column label="车主姓名" align="center" prop="carName" />
        <el-table-column label="车主手机号" align="center" prop="carPhone" />
        <el-table-column label="续费时间段" align="center" prop="" />
        <el-table-column label="续费时间" align="center" prop="time" />
        <el-table-column label="续费金额" align="center" prop="renewFee" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" align="center" @click="RenewHistoryOpen=false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 续费历史弹出层结束 -->

  </div>
</template>
<script>
// 引入api
// import { listRoleForPage } from '@/api/system/role'
import validate from '@/utils/validate.js'

export default {
  // 定义页面数据
  data() {
    return {
      // daysTotal: undefined,
      renewFeeTime: [],
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
      // listRoleForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
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
      // this.total = res.data.total
      this.loading = false// 关闭遮罩
      // })
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
    handleRenewHistory(row) {
      this.currentRoleId = row.carId || this.ids[0]
      this.title = '续费历史'
      this.RenewHistoryOpen = true
    }
  }
}
</script>
