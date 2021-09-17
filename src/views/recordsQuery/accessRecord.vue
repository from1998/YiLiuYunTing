<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row>
      <el-col :span="7" :offset="18">
        <el-form ref="cleanForm" :model="cleanForm" :inline="true">
          <el-form-item>
            <el-button type="danger" icon="el-icon-close" size="mini" @click="handleLeave">清理离场车辆</el-button>
          </el-form-item>
          <el-form-item label="" prop="days">
            <el-input
              v-model="cleanForm.days"
              placeholder="请输入清理天数"
              clearable
              size="small"
              style="width:140px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-delete" size="mini" @click="handleEnter(cleanForm.days)">清理在场车辆</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24" :offset="0">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="58px">
          <el-form-item label="车牌号" prop="carnumber">
            <el-input
              v-model="queryParams.carnumber"
              placeholder="请输入车牌号"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="是否离场" prop="isleave" label-width="70px">
            <el-select v-cloak v-model="queryParams.isleave" style="width:180px" clearable>
              <el-option
                v-for="item in stateOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车位类型" prop="recordcartype" label-width="70px">
            <el-select v-cloak v-model="queryParams.recordcartype" style="width:180px" clearable>
              <el-option
                v-for="item in laneOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="进场时间范围" label-width="96px">
            <el-date-picker
              v-model="dateRangeIn"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholde="开始日期"
              end-placeholde="结束日期"
              style="width:240px"
              clearable
              @change="timeChange('enterStart','enterEnd',dateRangeIn)"
            />
          </el-form-item>
          <el-form-item label="出场时间范围" label-width="96px">
            <el-date-picker
              v-model="dateRangeOut"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholde="开始日期"
              end-placeholde="结束日期"
              style="width:240px"
              clearable
              @change="timeChange('leaveStart','leaveEnd',dateRangeOut)"
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
      <el-table-column label="车牌号" align="center" prop="carnumber" width="120" />
      <el-table-column label="进场时间" align="center" prop="entered" width="180" />
      <el-table-column label="进场车道" align="center" prop="elaneName" width="80" />
      <el-table-column label="出场时间" align="center" prop="leaved" width="180" />
      <el-table-column label="出场车道" align="center" prop="llaneName" width="80" />
      <!-- RecordCarTypeDic -->
      <el-table-column label="车位类型" align="center" prop="recordcartype" :formatter="registerTypeFormatter" width="80" />
      <!-- CarRecordStatusDic -->
      <el-table-column label="记录类型" align="center" prop="status" :formatter="recordTypeFormatter" width="80" />
      <el-table-column label="进场检查情况" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>进场检查情况: {{ scope.row.echeckmark }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="small">{{ scope.row.echeckmark }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="出场检查情况" align="center" prop="lcheckmark">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>出场检查情况: {{ scope.row.lcheckmark }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="small">{{ scope.row.lcheckmark }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否进场" align="center" width="90">
        <template slot-scope="scope">
          <el-button v-show=" scope.row.isenter===1" type="success" icon="el-icon-check" size="mini" class="btnMini">已进场</el-button>
          <el-button v-show="scope.row.isenter===0" type="danger" icon="el-icon-close" size="mini" class="btnMini">未进场</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否出场" align="center" width="90">
        <template slot-scope="scope">
          <el-button v-show=" scope.row.isleave===1" type="success" icon="el-icon-check" size="mini" class="btnMini">已出场</el-button>
          <el-button v-show="scope.row.isleave===0" type="danger" icon="el-icon-close" size="mini" class="btnMini">未出场</el-button>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" prop="pay" width="168" />
      <el-table-column label="操作" align="center" width="200">
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

    <!-- 查看图片弹出层开始 -->
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
            <el-button type="success" round size="mini" style="cursor:default;height:18px;line-height:17px;padding-top:0">
              进场图片
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <!-- 图片 -->
      <el-image v-show="accessInSrc!==null" :src="accessInSrc!==null?accessInSrc:src" :preview-src-list="[accessInSrc!==null?accessInSrc:src]">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <el-row v-show="accessInSrc===null" :gutter="0">
        <el-col :span="6" :offset="9">
          <el-button type="info" icon="el-icon-close" size="mini" class="btnMini">暂无进场图片</el-button>
        </el-col>
      </el-row>
      <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
        <el-row :gutter="0">
          <el-col :span="4" :offset="0" :gutter="0">
            <el-button type="warning" round size="mini" style="cursor:default;height:18px;line-height:17px;padding-top:0">
              出场图片
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <!-- 图片 -->
      <el-image v-show="accessOutSrc!==null" :src="accessOutSrc!==null?accessOutSrc:src" :preview-src-list="[accessOutSrc!==null?accessOutSrc:src]">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <el-row v-show="accessOutSrc===null" :gutter="0">
        <el-col :span="6" :offset="9">
          <el-button type="info" icon="el-icon-close" size="mini" class="btnMini">暂无出场图片</el-button>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" align="center" @click="RenewHistoryOpen=false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入api
import { getRecordList, cleanLeaveRecord, cleanEnterRecord } from '@/api/monitoringCenter/accessRecord'

export default {
  // 定义页面数据
  data() {
    return {
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
      // 字典表格数据
      carTableList: [],
      // 弹出层标题
      title: '',
      cleanForm: {},
      // 是否显示弹出层
      open: false,
      // 下拉列表
      laneOptions: [],
      recordOptions: [],
      dateRangeIn: [],
      dateRangeOut: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        carnumber: undefined,
        isleave: undefined,
        recordcartype: undefined,
        enterStart: undefined,
        enterEnd: undefined,
        leaveStart: undefined,
        leaveEnd: undefined
      },
      // 表单校验
      // 是否打开分配权限的弹出层
      RenewOpen: false,
      RenewHistoryOpen: false,
      // 菜单树的数据
      menuOptions: []
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
    // 获取车位类型字典数据
    this.getDataByType('RecordCarTypeDic').then(res => {
      this.laneOptions = res.data
    })
    // 获取记录类型字典数据
    this.getDataByType('CarRecordStatusDic').then(res => {
      this.recordOptions = res.data
    })
    // 查询表格数据
    this.getAccessList()
  },
  // 方法
  methods: {
    // 清理异常车辆
    handleLeave() {
      this.loading = true // 打开遮罩
      cleanLeaveRecord().then(res => {
        if (res.code === 200) {
          this.msgSuccess('清理离场车辆成功')
          this.getAccessList()
        }
      })
      this.loading = false// 关闭遮罩
    },
    // 清理指定天数车辆
    handleEnter(days) {
      console.log(days)
      this.loading = true // 打开遮罩
      cleanEnterRecord(days).then(() => {
        this.msgSuccess(days + '天前的在场车辆已被成功清理')
        this.getAccessList()
      })
      this.loading = false// 关闭遮罩
    },
    timeChange(start, end, val) {
      if (val === null) {
        this.queryParams[start] = undefined
        this.queryParams[end] = undefined
      } else {
        this.queryParams[start] = val[0]
        this.queryParams[end] = val[1]
      }
    },
    // 翻译车位类型
    registerTypeFormatter(row) {
      return this.selectDictLabel(this.laneOptions, row.recordcartype.toString())
    },
    // 翻译记录类型
    recordTypeFormatter(row) {
      return this.selectDictLabel(this.recordOptions, row.status.toString())
    },
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
    getAccessList() {
      this.loading = true // 打开遮罩
      getRecordList(this.queryParams).then(res => {
        this.carTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.getAccessList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRangeIn = []
      this.dateRangeOut = []
      this.getAccessList()
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getAccessList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getAccessList()
    },
    handleAccessImg(row) {
      this.title = '进出场图片'
      this.RenewHistoryOpen = true
      this.accessInSrc = row.epicture
      this.accessOutSrc = row.lpicture
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
