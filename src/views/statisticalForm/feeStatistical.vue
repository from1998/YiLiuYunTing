<template>
  <div class="app-container">
    <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
      <el-row :gutter="0">
        <el-col :span="6" :offset="9" style="text-align:center;font-weight:700;padding:5px 0 15px 0">
          <span>{{ laneName }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="2" :offset="1" :gutter="0" style="margin-top:7px">
          <span>收费曲线图</span>
        </el-col>
        <el-col :span="11" :offset="10">
          <el-form ref="form" :model="form" :inline="true" label-width="44px">
            <el-form-item label="日期" prop="created">
              <el-date-picker
                v-model="form.created"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="month"
                placeholder="请选择月份"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
            <el-select
              v-show="getUserInfo().role === 1 || getUserInfo().role === 3"
              v-cloak
              v-model="form.parkId"
              placeholder="请选择您要查看的车场"
              size="small"
              clearable
              style="padding-left:55px"
              @change="handleParkFocus"
            >
              <el-option
                v-for="(item, index) in CarList"
                :key="index"
                :label="item.name"
                :value="Number(item.id)"
              />
            </el-select>
          </el-form>
          <!-- 查询条件结束 -->
        </el-col>
      </el-row>
    </el-header>
    <div class="lineStack">
      <lineStack ref="linestack" :leave-map="time" :leave-data="gfMap" :enter-map="wxMap" :park-name="park" :zfb-map="zfbMap" />
    </div>

    <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
      <el-row :gutter="0">
        <el-col :span="4" :offset="0" :gutter="0" style="margin-top:7px">
          <span>收费报表</span>
        </el-col>
        <el-col :span="2" :offset="18" :gutter="0">
          <el-button type="success" size="mini" style="margin-left:56px">
            导出表格
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <!-- 数据表格 -->
    <el-table v-loading="loading" border :data="feeTableList" stripe>
      <el-table-column label="日期" align="center" prop="created" />
      <el-table-column label="微信" align="center" prop="wx" />
      <el-table-column label="支付宝" align="center" prop="zfb" />
      <el-table-column label="官方" align="center" prop="gf" />
      <el-table-column label="车场名称" align="center" prop="parkName" />
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      v-show="total>0"
      :current-page="form.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
// 引入api
import { getOrderList, getOrders } from '@/api/monitoringCenter/accessRecord'
import lineStack from '@/views/statisticalForm/lineStack.vue'
import { listAll } from '@/api/coupons/couponsManger'

export default {
  components: {
    lineStack
  },
  // 定义页面数据
  data() {
    return {
      laneName: '',
      // 所属月份
      feeMonth: '',
      // 是否启用遮罩层
      loading: false,
      // 分页数据总条数
      total: 0,
      // 收费列表数据
      feeTableList: [],
      // 查询参数
      form: {
        page: 1,
        size: 10,
        created: '',
        parkId: ''
      },
      time: [],
      gfMap: [],
      wxMap: [],
      zfbMap: [],
      park: ['微信', '官方', '支付宝'],
      CarList: [],
      roleId: ''
    }
  },
  // 勾子
  created() {
    // 查询收费列表数据
    this.getFeeList()
    this.getOrdersList()
    this.roleId = this.getUserInfo().role
    this.getCarList()
  },
  // 方法
  methods: {
    handleParkFocus(val) {
      if (val === '') {
        this.laneName = ''
      } else {
        this.getTimeList()
        for (const key in this.CarList) {
          if (this.CarList[key].id === val) {
            this.laneName = this.CarList[key].name
          }
        }
      }
    },
    // 获取车厂信息
    getCarList() {
      listAll().then(res => {
        this.CarList = res.data
        this.form.parkId = this.roleId === 1 ? '' : res.data[0].id
      })
    },
    getOrdersList() {
      getOrders(this.form).then(res => {
        this.listData2 = res.data
        this.getleaveMap()
      })
    },
    getleaveMap() {
      for (var p in this.listData2.gfMap) {
        this.time.push(p) // 时间
        this.gfMap.push(this.listData2.gfMap[p]) // gfMap 值
      }
      for (var e in this.listData2.wxMap) {
        this.wxMap.push(this.listData2.wxMap[e]) // 微信 值
      }
      for (var item in this.listData2.zfbMap) {
        this.zfbMap.push(this.listData2.zfbMap[item]) // 支付宝 值
      }
      this.$refs.linestack.renderChart()
    },
    // 查询表格数据
    getFeeList() {
      this.loading = true // 打开遮罩
      getOrderList(this.form).then(res => {
        this.feeTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    getTimeList() {
      this.zfbMap = []
      this.wxMap = []
      this.gfMap = []
      this.time = []
      this.listData2 = []
      this.getOrdersList()
      this.getFeeList()
    },
    // 条件查询
    handleQuery() {
      this.getTimeList()
      // this.getOrdersList()
      // this.getFeeList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('form')
      this.dateRangeIn = []
      this.dateRangeOut = []
      this.getTimeList()
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.form.size = val
      // 重新查询
      this.getFeeList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.form.page = val
      // 重新查询
      this.getFeeList()
    }
  }
}
</script>
