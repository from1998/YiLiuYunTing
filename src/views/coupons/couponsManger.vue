<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="6" :offset="9" style="text-align:center;font-weight:700;padding-top:5px">
        <span>{{ laneName }}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <!-- 表格工具按钮开始 -->
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >添加优惠券</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDeletes"
        >删除</el-button>
      </el-col>
      <!-- 查询条件开始 -->
      <el-col
        :span="14"
        :offset="0"
      >
        <el-form
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="45px"
        >
          <el-form-item
            label="名称"
            prop="name"
          >
            <el-input
              v-model="queryParams.name"
              placeholder="请输入优惠券名称"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item
            label="类型"
            prop="category"
          >
            <el-select
              v-cloak
              v-model="queryParams.category"
              style="width:180px"
              placeholder="请选择优惠券类型"
              clearable
            >
              <el-option
                v-for="item in stateOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否开放"
            prop="isActive"
            label-width="70px"
          >
            <el-select
              v-cloak
              v-model="queryParams.isActive"
              style="width:180px"
              placeholder="请选择是否开放"
              clearable
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >搜索</el-button>
            <el-button
              type="danger"
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
            >重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 查询条件结束 -->
      </el-col>
      <el-col :span="4" :offset="3">
        <el-select
          v-show="getUserInfo().role === 1 || getUserInfo().role=== 3"
          v-cloak
          v-model="queryParams.parkId"
          placeholder="请选择车场"
          size="small"
          style="width:220px;margin-left:55px"
          clearable
          @change="handleLaneName"
        >
          <el-option
            v-for="(item, index) in CarList"
            :key="index"
            :label="item.name"
            :value="Number(item.id)"
          />
        </el-select>
      </el-col>

    </el-row>

    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="couponsTableList"
      stripe
      @selection-change="handleSelectionChnage"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        align="center"
        label="名称"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>名称: {{ scope.row.name }}</p>
            <div v-show="scope.row.name" slot="reference" class="name-wrapper">
              <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.category===1" type="warning" size="mini" effect="dark"><i class="el-icon-coin" /> 代金券</el-tag>
          <el-tag v-show="scope.row.category===2" type="danger" size="mini" effect="dark"><i class="el-icon-time" /> 时间券</el-tag>
          <el-tag v-show="scope.row.category===3" type="primary" size="mini" effect="dark"><i class="el-icon-money" /> 折扣券</el-tag>
          <el-tag v-show="scope.row.category===4" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 全免券</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否开放"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isActive"
            :active-text="scope.row.isActive === 1?'开放':'关闭'"
            :active-value="1"
            :inactive-value="0"
            @change="gateStateChanged($event,scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="280"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
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
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="65px"
        :rules="rules"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-row :span="5">
            <el-input
              v-model="form.name"
              placeholder="请输入优惠劵名称"
              clearable
              size="small"
            />
          </el-row>
        </el-form-item>
        <el-form-item label="优惠劵" prop="category">
          <el-select
            v-model="form.category"
            style="width:100%"
            placeholder="请选择优惠劵类型"
            clearable
            size="small"
          >
            <el-option
              v-for="d in stateOptions"
              :key="d.dictValue"
              :label="d.dictLabel"
              :value="Number(d.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="title === '添加优惠券信息' && roleId === 1 "
          label="车场"
          prop="parkId"
          label-width="70px"
        >
          <el-select
            v-model="form.parkId"
            style="width:100%"
            placeholder="请选择车场"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in CarList"
              :key="index"
              :label="item.name"
              :value="Number(item.id)"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handleSubmit"
        >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入api
// import { listRoleForPage } from '@/api/system/role'
import {
  addCoupons,
  listCouponsForPage,
  openCoupons,
  getCouponsById,
  updateCoupons,
  deleteCouponsId,
  listAll
} from '@/api/coupons/couponsManger'
import validate from '@/utils/validate.js'
export default {
  // 定义页面数据
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        category: validate.notEmpty,
        name: validate.notEmpty
      },
      carTableList: [],
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
      couponsTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        roleName: undefined,
        roleCode: undefined,
        status: undefined,
        name: undefined,
        parkId: '',
        category: '',
        isActive: ''
      },
      // 表单数据
      form: {},
      // 是否打开分配权限的弹出层
      selectMenuOpen: false,
      // 菜单树的数据
      menuOptions: [],
      // 当前选中持角色ID
      currentRoleId: undefined,
      benefitForm: {},
      stateOptions: [],
      switchData: {
        id: '',
        isActive: ''
      },
      roleId: '',
      CarList: [],
      laneName: ''
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据  2禁用 1正常
    this.getDataByType('CouponsCategoryDic').then((res) => {
      this.stateOptions = res.data
    })
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据
    this.getDataByType('yesOrNo').then((res) => {
      this.statusOptions = res.data
    })
    this.getCarList()
    // 查询表格数据
    this.getCouponsList()
    // 角色权限
    this.roleId = this.getUserInfo().role
  },
  // 方法
  methods: {
    handleLaneName(val) {
      if (val === '') {
        this.laneName = ''
        this.getCouponsList()
      } else {
        this.getCouponsList()
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
        this.queryParams.parkId = this.roleId === 1 ? '' : res.data[0].id
      }).catch(err => {
        console.log(err)
      })
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.isActive.toString())
    },
    // 查询表格数据
    getCouponsList() {
      this.loading = true // 打开遮罩
      listCouponsForPage(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((res) => {
        this.couponsTableList = res.data.list
        this.total = res.data.total
        this.loading = false // 关闭遮罩
      })
    },
    // 监听 switch 闸口状态的改变
    async gateStateChanged(val, row) {
      this.switchData.id = row.id
      this.switchData.isActive = val
      await openCoupons(this.switchData).then((res) => {
        if (res.code === 200) {
          this.msgSuccess(res.msg)
          this.getCouponsList() // 列表重新查询
        } else {
          this.msgError(res.msg)
        }
      })
    },
    // 条件查询
    handleQuery() {
      this.getCouponsList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      if (this.roleId === 4) {
        this.queryParams.parkId = this.CarList[0].id
      }
      if (this.roleId === 1) {
        this.queryParams.parkId = ''
      }
      this.dateRange = []
      this.getCouponsList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getCouponsList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getCouponsList()
    },

    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加优惠券'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改优惠券'
      this.open = true
      this.reset()
      // 根据dictId查询一个字典信息
      this.loading = true
      getCouponsById({
        id: row.id
      }).then((res) => {
        this.form = res.data
        this.loading = false
      })
    },
    // 多选删除
    // 执行删除
    handleDeletes(row) {
      const userIds = row.id || this.ids
      this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteCouponsId(userIds)
            .then((res) => {
              this.loading = false
              this.msgSuccess(res.msg)
              this.getCouponsList() // 全查询
            })
          this.loading = false
        })
        .catch(() => {
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
          if (this.form.id === undefined) {
            addCoupons(this.form).then((res) => {
              if (res.code === 200) {
                this.msgSuccess(res.msg)
                this.open = false // 关闭弹出层
                this.getCouponsList() // 列表重新查询
              } else {
                this.msgError(res.msg)
              }
            })
            this.loading = false
          } else {
            this.form.category = this.form.category * 1
            // 做修改
            updateCoupons({
              id: this.form.id,
              category: this.form.category,
              name: this.form.name
            })
              .then((res) => {
                if (res.code === 200) {
                  this.msgSuccess(res.msg)
                  this.open = false // 关闭弹出层
                  this.getCouponsList() // 列表重新查询
                } else {
                  this.msgError(res.msg)
                }
              })
            this.loading = false
          }
        }
      })
    },
    // 取消
    cancel() {
      this.open = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleSort: 0,
        remark: undefined,
        status: '0'
      }
    }
  }
}
</script>
