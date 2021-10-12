<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="6" :offset="9" style="text-align:center;font-weight:700;padding:5px 0 15px 0">
        <span>{{ laneName }}</span>
      </el-col>
    </el-row>
    <!-- 表格工具按钮开始 -->
    <el-row>
      <el-col :span="18" :offset="0">
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
          <el-form-item label="订单号" prop="sn">
            <el-input
              v-model="queryParams.sn"
              placeholder="请输入订单号"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="订单状态" prop="state" label-width="68px">
            <el-select v-cloak v-model="queryParams.state" style="width:180px" clearable>
              <el-option
                v-for="(item,index) in options.ordersState"
                :key="item"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="pay" label="支付时间" label-width="68px">
            <el-date-picker
              v-model="queryParams.pay"
              value-format="yyyy-MM-dd"
              placeholder="请选择支付时间"
              style="width:175px"
              type="date"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 查询条件结束 -->
      </el-col>
      <el-col :span="4" :offset="2">
        <el-select
          v-show="getUserInfo().role === 1 || getUserInfo().role === 3"
          v-cloak
          v-model="queryParams.parkId"
          placeholder="请选择您要查看的车场"
          size="small"
          clearable
          style="padding-left:70px"
          @change="handleParkFocus"
        >
          <el-option
            v-for="item in parkCategory"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" border :data="orderTableList" stripe>
      <el-table-column label="订单号" align="center" prop="sn" width="300" />
      <el-table-column label="车牌号" align="center" prop="carNumber" />
      <el-table-column label="停车时长" align="center" prop="duration" />
      <el-table-column label="支付类目" align="center" prop="paytype" :formatter="paytypeFormatter" />
      <el-table-column label="支付时间" align="center" prop="pay" width="180px" />
      <el-table-column label="订单金额" align="center" prop="totalamount" />
      <el-table-column label="优惠金额" align="center" prop="discountableamount" />
      <el-table-column label="实付金额" align="center" prop="amount" />
      <el-table-column label="支付平台" align="center" prop="platform" :formatter="platformFormatter" />
      <el-table-column label="订单状态" align="center" prop="state" :formatter="ordersStateFormatter" />
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
  </div>
</template>
<script>
// 引入api
import { getOrderList, getOrderDict } from '@/api/recordsQuery/orderRecord'
import { listAll } from '@/api/coupons/couponsManger'

export default {
  // 定义页面数据
  data() {
    return {
      laneName: '',
      parkForm: {
        // 车场id
        id: ''
      },
      flag: false,
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      accessInSrc: '',
      accessOutSrc: '',
      stateOptions: [],
      // daysTotal: undefined,
      renewFeeTime: [],
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
      // 数据表格数据
      orderTableList: [],
      // 下拉列表
      laneOptions: [],
      recordOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        carNumber: undefined,
        sn: undefined,
        pay: undefined,
        state: undefined,
        // 车场id
        parkId: ''
      },
      // 车场类型
      parkCategory: [],
      options: {
        // 订单状态
        ordersState: [],
        // 支付平台
        payChannel: [],
        // 支付类目
        orderSkuType: []
      }
    }
  },
  // 勾子
  created() {
    // 获取数据词典
    this.getOrderDic()
    // 获取车场列表数据
    listAll().then(res => {
      this.parkCategory = res.data
      this.queryParams.parkId = this.getUserInfo().role === 1 ? '' : res.data[0].id
    })
    // 查询表格数据
    this.getOrderTable()
  },
  // 方法
  methods: {
    handleParkFocus(val) {
      if (val === '') {
        this.laneName = ''
        this.getOrderTable()
      } else {
        this.getOrderTable()
        for (const key in this.parkCategory) {
          if (this.parkCategory[key].id === val) {
            this.laneName = this.parkCategory[key].name
          }
        }
      }
    },
    // 翻译订单状态
    ordersStateFormatter(row) {
      return this.formatterDict(this.options.ordersState, row.state.toString())
    },
    // 翻译支付类目
    paytypeFormatter(row) {
      return this.formatterDict(this.options.orderSkuType, row.paytype.toString())
    },
    // 翻译支付平台
    platformFormatter(row) {
      return this.formatterDict(this.options.payChannel, row.platform.toString())
    },
    // 翻译类型
    formatterDict(datas, value) {
      const actions = []
      Object.keys(datas).map((key) => {
        if (key === value) {
          actions.push(datas[key])
          return false
        }
      })
      return actions
    },
    // 获取数据词典
    getOrderDic() {
      this.loading = true // 打开遮罩
      getOrderDict().then(res => {
        this.options.ordersState = res.data.OrdersStateDic
        this.options.payChannel = res.data.PlatformDic
        this.options.payType = res.data.PayTypeDic
        this.options.orderSkuType = res.data.OrderSkuTypeDic
        this.loading = false// 关闭遮罩
      })
    },
    // 查询表格数据
    getOrderTable() {
      this.loading = true // 打开遮罩
      getOrderList(this.queryParams).then(res => {
        this.orderTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.getOrderTable()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.getOrderTable()
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getOrderTable()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getOrderTable()
    }
  }
}
</script>
