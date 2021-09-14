<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row>
      <el-col :span="24" :offset="0">
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
          <el-form-item label="是否离场" prop="isLeave" label-width="70px">
            <el-select v-cloak v-model="queryParams.isLeave" style="width:180px">
              <el-option
                v-for="item in stateOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否支付" prop="isPayed" label-width="70px">
            <el-select v-cloak v-model="queryParams.isPayed" style="width:180px">
              <el-option
                v-for="item in stateOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="进场时间范围" label-width="96px">
            <el-date-picker
              v-model="queryParams.dateRangeIn"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholde="开始日期"
              end-placeholde="结束日期"
              style="width:240px"
            />
          </el-form-item>
          <el-form-item label="出场时间范围" label-width="96px">
            <el-date-picker
              v-model="queryParams.dateRangeOut"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholde="开始日期"
              end-placeholde="结束日期"
              style="width:240px"
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
      <el-table-column label="进场时间" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.time"
            type="datetime"
            placeholder="暂无"
          />
        </template>
      </el-table-column>
      <el-table-column label="进场车道" align="center" prop="carPhone" />
      <el-table-column label="出场时间" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.time"
            type="datetime"
            placeholder="暂无"
          />
        </template>
      </el-table-column>
      <el-table-column label="出场车道" align="center" prop="carPhone" />
      <el-table-column label="车位类型" align="center" prop="depotCategory" />
      <el-table-column label="记录类型" align="center" prop="carCategory" />
      <el-table-column label="进场检查情况" align="center" prop="carStatus" :formatter="carStatusFormate" />
      <el-table-column label="出场检查情况" align="center" prop="timeSection" />
      <el-table-column label="是否进场" align="center" prop="carAddress" />
      <el-table-column label="是否出场" align="center" prop="remark" />
      <el-table-column label="支付时间" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-picture-outline" size="mini" @click="handleAccessImg(scope.row)">
            查看进出场图片
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
      width="500px"
      center
      append-to-body
    >
      <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
        <el-row :gutter="0">
          <el-col :span="4" :offset="0" :gutter="0">
            进场图片
          </el-col>
          <el-col :span="2" :offset="18" :gutter="0">
            <el-button type="success" round size="mini" icon="el-icon-d-arrow-left" style="cursor:default;height:18px;line-height:18px;padding-top:0" />
          </el-col>
        </el-row>
      </el-header>
      <!-- 图片 -->
      <el-image :src="src" :preview-src-list="[src]">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
        <el-row :gutter="0">
          <el-col :span="4" :offset="0" :gutter="0">
            出场图片
          </el-col>
          <el-col :span="2" :offset="18" :gutter="0">
            <el-button type="warning" round size="mini" icon="el-icon-d-arrow-right" style="cursor:default;height:18px;line-height:18px;padding-top:0" />
          </el-col>
        </el-row>
      </el-header>
      <!-- 图片 -->
      <el-image :src="src" :preview-src-list="[src]">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
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
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      stateOptions: [],
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
        dateRangeIn: [],
        dateRangeOut: [],
        isPayed: undefined,
        isLeave: undefined,
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
    // this.getSelectData()
    // 获取是否字典数据
    this.getDataByType('yesOrNo').then(res => {
      this.stateOptions = res.data
    })
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
    // 查询表格数据
    getRoleList() {
      this.loading = true // 打开遮罩
      // listRoleForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
      // this.carTableList = res.data.list
      this.carTableList = [
        // {
        //   carNumber: '皖A22333',
        //   carName: '赵六',
        //   carPhone: '13155556666',
        //   carStatus: '1',
        //   carCategory: '小车',
        //   depotCategory: '储值车',
        //   timeCategory: '全天',
        //   timeSection: '',
        //   carAddress: '安徽省合肥市蜀山区南湖春城',
        //   remark: '这是一个备注'
        // },
        // {
        //   carNumber: '粤C66666',
        //   carName: '王五',
        //   carPhone: '13855556666',
        //   carStatus: '1',
        //   carCategory: '小车',
        //   depotCategory: '临时车',
        //   timeCategory: '分时段',
        //   timeSection: '2020-09-27 16：30：27 至 2021-09-27 16：30：27',
        //   carAddress: '广东省深圳市南山区人民法院',
        //   remark: '这是另一个备注'
        // }
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
    handleAccessImg(row) {
      this.currentRoleId = row.carId || this.ids[0]
      this.title = '进出场图片'
      this.RenewHistoryOpen = true
    }
  }
}
</script>
