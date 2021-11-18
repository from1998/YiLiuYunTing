<template>
  <div class="app-container">
    <div v-if="getUserInfo().role === 1 || getUserInfo().role === 3 || getUserInfo().role === 4">
      <el-row :gutter="0">
        <el-col :span="6" :offset="9" style="text-align:center;font-weight:700;padding-top:5px">
          <span>{{ laneName }}</span>
        </el-col>
      </el-row>
      <!-- 表格工具按钮开始 -->
      <el-row>
        <el-col :span="8" :offset="0">
          <el-form ref="cleanForm" :model="cleanForm" :inline="true">
            <el-form-item>
              <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleLeave">清理离场车辆</el-button>
            </el-form-item>
            <el-form-item label="" prop="days">
              <el-input
                v-model.trim="cleanForm.days"
                placeholder="请输入清理天数"
                clearable
                size="small"
                style="width:140px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="text" icon="el-icon-caret-right" size="mini" style="cursor:default" />
            </el-form-item>
            <el-tooltip class="item" effect="dark" content="请在左侧输入清理天数，再点击该按钮。" placement="bottom" :disabled="cleanForm.days?true:false">
              <el-form-item>
                <el-button :disabled="cleanForm.days?false:true" type="warning" icon="el-icon-delete" size="mini" @click="handleEnter(cleanForm.days)">清理在场车辆{{ ' : '+ (cleanForm.days===undefined?'':cleanForm.days) + '天' }}</el-button>
              </el-form-item>
            </el-tooltip>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="12" style="padding-left:60px">
          <el-select
            v-show="getUserInfo().role === 1 || getUserInfo().role === 3"
            v-cloak
            v-model="queryParams.parkId"
            placeholder="请选择您要查看的车场"
            size="small"
            clearable
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
    </div>
    <el-row :gutter="0">
      <el-col :span="24" :offset="0">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="58px">
          <el-form-item label="车牌号" prop="carnumber">
            <el-input
              v-model.trim="queryParams.carnumber"
              placeholder="请输入车牌号"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="是否离场" prop="isleave" label-width="70px">
            <el-select v-cloak v-model="queryParams.isleave" style="width:180px" clearable placeholder="请选择是否离场">
              <el-option
                v-for="item in stateOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车位类型" prop="recordcartype" label-width="70px">
            <el-select v-cloak v-model="queryParams.recordcartype" style="width:180px" clearable placeholder="请选择是否离场">
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
            <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 查询条件结束 -->
      </el-col>
    </el-row>

    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="carTableList" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车牌号" align="center" width="126">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制车牌号:<el-tag type="primary" effect="dark" size="mini">{{ scope.row.carnumber }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.carNumberFlag==='临'" v-clipboard:copy="scope.row.carnumber" v-clipboard:success="clipboardSuccess" type="warning" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carnumber }}</el-tag>
              <el-tag v-else-if="scope.row.carNumberFlag==='新'" v-clipboard:copy="scope.row.carnumber" v-clipboard:success="clipboardSuccess" type="success" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carnumber }} 新</el-tag>
              <el-tag v-else v-clipboard:copy="scope.row.carnumber" v-clipboard:success="clipboardSuccess" type="primary" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carnumber }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="进场时间" width="170">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.entered }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="进场车道"
        width="80"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>进场车道: <el-tag type="primary" size="mini" effect="dark">{{ scope.row.elaneName }}</el-tag></p>
            <div v-if="scope.row.elaneName" slot="reference" class="name-wrapper">
              <el-tag size="medium" style="width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.elaneName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出场时间" width="170">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.leaved }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="出场车道"
        width="80"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>出场车道: <el-tag type="primary" size="mini" effect="dark">{{ scope.row.llaneName }}</el-tag></p>
            <div v-show="scope.row.llaneName" slot="reference" class="name-wrapper">
              <el-tag size="medium" style="width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.llaneName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- RecordCarTypeDic -->
      <el-table-column label="车位类型" align="center" prop="recordcartype" :formatter="registerTypeFormatter" />
      <!-- CarRecordStatusDic -->
      <el-table-column label="记录类型" align="center" prop="status" :formatter="recordTypeFormatter" />
      <el-table-column label="进场检查情况" align="center">
        <template slot-scope="scope">
          <el-popover v-show="scope.row.echeckmark" trigger="hover" placement="top">
            <p>进场检查情况: <el-tag type="primary" size="mini" effect="dark">{{ scope.row.echeckmark }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.echeckmark }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="出场检查情况" align="center" prop="lcheckmark">
        <template slot-scope="scope">
          <el-popover v-show="scope.row.lcheckmark" trigger="hover" placement="top">
            <p>出场检查情况: <el-tag type="primary" size="mini" effect="dark">{{ scope.row.lcheckmark }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.lcheckmark }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否进场" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.isenter===0" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 未进场</el-tag>
          <el-tag v-show="scope.row.isenter===1" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 已进场</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否出场" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.isleave===0" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 未出场</el-tag>
          <el-tag v-show="scope.row.isleave===1" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 已出场</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付时间" width="170">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.pay }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-picture-outline" size="mini" @click="handleAccessImg(scope.row)">
            查看进出场图片
          </el-button>
          <!-- <el-button v-if="scope.row.role!==1" type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button> -->
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
      :close-on-click-modal="false"
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
          <el-tag type="info" size="mini" effect="dark"><i class="el-icon-close" />暂无进场图片</el-tag>
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
          <el-tag type="info" size="mini" effect="dark"><i class="el-icon-close" />暂无出场图片</el-tag>
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
import { getRecordList, cleanLeaveRecord, cleanEnterRecord, delAccessRecord } from '@/api/monitoringCenter/accessRecord'
import { listAll } from '@/api/coupons/couponsManger'

export default {
  // 定义页面数据
  data() {
    return {
      laneName: '',
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
      // 字典表格数据
      carTableList: [],
      // 弹出层标题
      title: '',
      cleanForm: {},
      // 是否显示弹出层
      open: false,
      // 下拉列表
      // 车场类型
      parkCategory: [],
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
        leaveEnd: undefined,
        // 车场id
        parkId: ''
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
    // 获取车场列表数据
    listAll().then(res => {
      this.parkCategory = res.data
      this.queryParams.parkId = this.getUserInfo().role === 1 ? '' : res.data[0].id
    })
    // 查询表格数据
    this.getAccessList()
  },
  // 方法
  methods: {
    // 复制成功的回调函数
    clipboardSuccess(val) {
      this.msgSuccess(`复制成功！`)
    },
    // 执行删除
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('此操作将永久删除该进出场数据, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        delAccessRecord(ids).then(res => {
          this.msgSuccess(res.msg)
          this.getAccessList()// 全查询
        })
        this.loading = false
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    },
    handleParkFocus(val) {
      if (val === '') {
        this.laneName = ''
        this.getAccessList()
      } else {
        this.getAccessList()
        for (const key in this.parkCategory) {
          if (this.parkCategory[key].id === val) {
            this.laneName = this.parkCategory[key].name
          }
        }
      }
    },
    // 清理异常车辆
    handleLeave() {
      this.$confirm('确定清理离场车辆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true // 打开遮罩
        cleanLeaveRecord().then(res => {
          if (res.code === 200) {
            this.msgSuccess(res.msg)
            this.getAccessList()
          }
        })
        this.loading = false// 关闭遮罩
      }).catch(() => {
        this.msgError('清理已取消')
      })
    },
    // 清理指定天数车辆
    handleEnter(days) {
      this.$confirm(`确定清理${days}天前的在场车辆?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true // 打开遮罩
        cleanEnterRecord(days).then(() => {
          this.msgSuccess(days + '天前的在场车辆已被成功清理')
          this.getAccessList()
        })
        this.loading = false// 关闭遮罩
      }).catch(() => {
        this.msgError('清理已取消')
      })
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
      if (row.recordcartype) {
        return this.selectDictLabel(this.laneOptions, row.recordcartype.toString())
      }
    },
    // 翻译记录类型
    recordTypeFormatter(row) {
      if (row.status) {
        return this.selectDictLabel(this.recordOptions, row.status.toString())
      }
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
        this.carTableList.map(val => {
          if (val.carnumber.charAt(0) === '临') {
            val.carNumberFlag = '临'
          } else if (val.carnumber.length === 8) {
            val.carNumberFlag = '新'
          }
        })
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
      this.queryParams.enterStart = undefined
      this.queryParams.enterEnd = undefined
      this.queryParams.leaveStart = undefined
      this.queryParams.leaveEnd = undefined
      this.queryParams.page = 1
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
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
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
