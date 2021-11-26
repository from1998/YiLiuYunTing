<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row>
      <el-col :span="7" :offset="17">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" align="right">
          <el-form-item label="车牌号" prop="carNumber">
            <el-input
              v-model.trim="queryParams.carNumber"
              placeholder="请输入车牌号"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="tblCouponsList"
      stripe
      @selection-change="handleSelectionChnage"
    >
      <el-table-column label="车牌号" align="center">
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
      <el-table-column align="center" label="进场异常次数">
        <template slot-scope="scope">
          <el-tag type="warning" size="mini" effect="dark">{{ scope.row.accessInMum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出场异常次数">
        <template slot-scope="scope">
          <el-tag type="warning" size="mini" effect="dark">{{ scope.row.accessOutMum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.carnumber,'in')"> <i class="el-icon-d-arrow-left" /> 查看进场异常</el-button>
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.carnumber,'out')"> <i class="el-icon-d-arrow-right" /> 查看出场异常</el-button>
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
      @size-change="handleSizeChange('queryParams',$event)"
      @current-change="handleCurrentChange('queryParams',$event)"
    />
    <!-- 查看详情 -->
    <el-dialog
      title="详情"
      :visible.sync="userListOpen"
      width="1000px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <!-- 数据表格开始 -->
      <el-table ref="pickUserTable" v-loading="loading" border :data="appUserList" stripe @selection-change="handleUserSelectionChnage">
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column label="车牌号" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.carNumberFlag==='临'" type="warning" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carnumber }}</el-tag>
            <el-tag v-else-if="scope.row.carNumberFlag==='新'" type="success" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carnumber }} 新</el-tag>
            <el-tag v-else type="primary" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carnumber }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="检查情况" align="center">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.checkStatus" trigger="hover" placement="top">
              <p>检查情况: <el-tag type="primary" size="mini" effect="dark">{{ scope.row.checkStatus }}</el-tag></p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.checkStatus }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.file" type="success" icon="el-icon-picture-outline" size="mini" @click="handleAccessImg(scope.row)">
              查看图片
            </el-button>
            <el-button v-else type="info" icon="el-icon-picture-outline-round" size="mini">暂无图片</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <el-tag size="medium" type="primary"> <i class="el-icon-time" /> {{ scope.row.time }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeletes(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页控件开始 -->
      <el-pagination
        v-show="userTotal>0"
        :current-page="queryUserParams.page"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryUserParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal"
        @size-change="handleSizeChange('queryUserParams',$event)"
        @current-change="handleCurrentChange('queryUserParams',$event)"
      />
    </el-dialog>
    <!-- 查看图片弹出层开始 -->
    <el-dialog
      :title="srcTitle"
      :visible.sync="carImgOpen"
      width="500px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <!-- 图片 -->
      <el-image :src="carImgSrc" :preview-src-list="[carImgSrc]" />
      <span slot="footer" class="dialog-footer">
        <!-- <el-button :loading="loading" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button> -->
        <el-button type="primary" align="center" @click="carImgOpen=false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入api
import {
  getErrorCarList,
  deleteTblCoupon,
  getErrorCarByCarNumber,
  getErrorLeavedCarByCarNumber
} from '@/api/recordsQuery/errorRecord'
export default {
  // 定义页面数据
  data() {
    return {
      carnumber: undefined,
      type: undefined,
      carImgSrc: null,
      carImgOpen: false,
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      userIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      userTotal: 0,
      // 表格数据
      tblCouponsList: [],
      appUserList: [],
      // 弹出层标题
      title: '',
      srcTitle: '',
      // 是否显示弹出层
      open: false,
      userListOpen: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10
      },
      queryUserParams: {
        page: 1,
        size: 10
      }
    }
  },
  // 勾子
  created() {
    // 查询表格数据
    this.getTblCouponsList()
  },
  // 方法
  methods: {
    // 复制成功的回调函数
    clipboardSuccess() {
      this.msgSuccess(`复制成功！`)
    },
    // 查询表格数据
    getTblCouponsList() {
      this.loading = true // 打开遮罩
      getErrorCarList(
        this.queryParams
      ).then((res) => {
        this.tblCouponsList = res.data.list
        this.tblCouponsList.map(val => {
          if (val.carnumber.charAt(0) === '临') {
            val.carNumberFlag = '临'
          } else if (val.carnumber.length === 8) {
            val.carNumberFlag = '新'
          }
        })
        this.total = res.data.total
        this.loading = false // 关闭遮罩
      })
    },
    // 查看详情图片
    handleAccessImg(row) {
      this.srcTitle = row.carnumber
      this.carImgOpen = true
      this.carImgSrc = row.file
    },
    // 查看详情
    handleDetail(carnumber, type) {
      this.userListOpen = true
      this.carnumber = carnumber
      this.type = type
      this.getAppUsersList(carnumber, type)
    },
    // 获取详情表格
    getAppUsersList(carnumber, type) {
      this.loading = true // 打开遮罩
      this.queryUserParams.carnumber = carnumber
      if (type === 'in') {
        getErrorCarByCarNumber(
          this.queryUserParams
        ).then((res) => {
          this.appUserList = res.data.list
          this.appUserList.map(val => {
            val.checkStatus = val.echeckmark
            val.file = val.epicture
            val.time = val.entered
            if (val.carnumber.charAt(0) === '临') {
              val.carNumberFlag = '临'
            } else if (val.carnumber.length === 8) {
              val.carNumberFlag = '新'
            }
          })
          this.userTotal = res.data.total
        })
      } else {
        getErrorLeavedCarByCarNumber(
          this.queryUserParams
        ).then((res) => {
          this.appUserList = res.data.list
          this.appUserList.map(val => {
            val.checkStatus = val.lcheckmark
            val.file = val.lpicture
            val.time = val.leaved
            if (val.carnumber.charAt(0) === '临') {
              val.carNumberFlag = '临'
            } else if (val.carnumber.length === 8) {
              val.carNumberFlag = '新'
            }
          })
          this.userTotal = res.data.total
        })
      }
      this.loading = false // 关闭遮罩
    },
    // 条件查询
    handleQuery() {
      this.getTblCouponsList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.getTblCouponsList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleUserSelectionChnage(selection) {
      this.options.usersName = selection.map((item) => {
        return {
          'id': item.id,
          'name': item.userName
        }
      })
    },
    // 分页size变化时触发
    handleSizeChange(src, val) {
      this[src].size = val
      // 重新查询
      if (src === 'queryParams') {
        this.getTblCouponsList()
      } else {
        this.getAppUsersList(this.carnumber, this.type)
      }
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(src, val) {
      this[src].page = val
      // 重新查询
      if (src === 'queryParams') {
        this.getTblCouponsList()
      } else {
        this.getAppUsersList(this.carnumber, this.type)
      }
    },
    // 执行删除
    handleDeletes(row) {
      const userIds = row.id || this.ids
      this.$confirm('此操作将永久删除该异常记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteTblCoupon(userIds)
            .then((res) => {
              this.loading = false
              this.msgSuccess(res.msg)
              this.getTblCouponsList() // 全查询
            })
          this.loading = false
        })
        .catch(() => {
          this.msgError('删除已取消')
          this.loading = false
        })
    },
    // 取消
    cancel() {
      this.open = false
      // 清空列表选择项
      this.$refs.pickUserTable.clearSelection()
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.form = {}
    }
  }
}
</script>
