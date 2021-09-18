<template>
  <div class="app-container">
    <el-row>
      <!-- 表格工具按钮开始 -->
      <el-col :span="6">
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
        :span="18"
        :offset="0"
      >
        <el-form
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="58px"
        >
          <el-form-item
            label="车场"
            prop="parkId"
            label-width="70px"
          >
            <el-select
              v-cloak
              v-model="queryParams.parkId"
              style="width:180px"
              placeholder="请选择车场"
            >
              <el-option
                v-for="(item, index) in CarList"
                :key="index"
                :label="item.name"
                :value="Number(item.id)"
              />
            </el-select>
          </el-form-item>
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
            label-width="70px"
          >
            <el-select
              v-cloak
              v-model="queryParams.category"
              style="width:180px"
              placeholder="请选择优惠券类型"
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
              placeholder="请选择优惠券是否开放"
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
              type="primary"
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
            >重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 查询条件结束 -->
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
        label="名称"
        align="center"
        prop="name"
      />
      <el-table-column
        label="类型"
        align="center"
        prop="category"
        :formatter="carTypeFormatter"
      />
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
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
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
        <el-form-item label="优惠劵">
          <el-select
            v-model="form.category"
            placeholder="请选择优惠劵类型"
            clearable
            size="small"
            style="width:330px"
          >
            <el-option
              v-for="d in stateOptions"
              :key="d.dictValue"
              :label="d.dictLabel"
              :value="Number(d.dictValue)"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item-->
        <!--          v-if="id === '1' "-->
        <!--          label="车厂"-->
        <!--          prop="parkId"-->
        <!--        >-->
        <!--          <el-select-->
        <!--            v-model="form.parkId"-->
        <!--            placeholder="请选择车厂"-->
        <!--            clearable-->
        <!--            size="small"-->
        <!--            style="width:330px"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              v-for="(d,index) in CarList"-->
        <!--              :key="index"-->
        <!--              :label="d.name"-->
        <!--              :value="Number(d.parkId)"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item
          v-if="roleId === '1'"
          label="车场"
          prop="parkId"
          label-width="70px"
        >
          <el-select
            v-cloak
            v-model="form.parkId"
            style="width:180px"
            placeholder="请选择车场"
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
export default {
  // 定义页面数据
  data() {
    return {
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
        name: undefined
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
      CarList: []
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
    // 查询表格数据
    this.getCouponsList()
    // 角色权限
    this.roleId = this.getRoleID()
    this.getCarList()
  },
  // 方法
  methods: {
    // 获取车厂信息
    getCarList() {
      listAll().then(res => {
        console.log(res)
        this.CarList = res.data
        this.queryParams.parkId = this.roleId === '1' ? '' : res.data[0].name
      }).catch(err => {
        console.log(err)
      })
    },
    // 翻译类型
    carTypeFormatter(row) {
      return this.selectDictLabel(this.stateOptions, row.category.toString())
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
        console.log(this.total)
        this.loading = false // 关闭遮罩
      })
    },
    // 监听 switch 闸口状态的改变
    async gateStateChanged(val, row) {
      console.log(val)
      console.log(row)
      this.switchData.id = row.id
      this.switchData.isActive = val
      console.log(this.switchData)
      await openCoupons(this.switchData).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.msgSuccess('操作成功')
          this.getCouponsList() // 列表重新查询
        } else {
          this.msgSuccess('操作失败')
        }
        //   const data = {
        //     id: row.id,
        //     isActive: row.isActive === true ? 1 : 0
        //   }
        //   await openCoupons(data).then((res) => {
        //     console.log(res)
      })
    },
    // 条件查询
    handleQuery() {
      this.getCouponsList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
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
      this.title = '添加优惠券信息'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改优惠券信息'
      // const roleId = row.roleId || this.ids
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据dictId查询一个字典信息
      this.loading = true
      getCouponsById(row.id).then((res) => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    // handleDelete(row) {
    //   const roleIds = row.id || this.ids
    //   this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       this.loading = true
    //       deleteCouponsByIds(roleIds).then((res) => {
    //         console.log(res)
    //         this.loading = false
    //         this.msgSuccess('删除成功')
    //         this.getCouponsList() // 全查询
    //       })
    //     })
    //     .catch(() => {
    //       this.msgError('删除已取消')
    //       this.loading = false
    //     })
    // },
    // 多选删除
    // 执行删除
    handleDeletes(row) {
      const userIds = row.id || this.ids
      this.$confirm('此操作将永久删除该用户数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteCouponsId(userIds)
            .then((res) => {
              this.loading = false
              this.msgSuccess('删除成功')
              this.getCouponsList() // 全查询
            })
            .catch(() => {
              this.msgError('删除失败')
              this.loading = false
            })
        })
        .catch(() => {
          this.msgError('删除已取消')
          this.loading = false
        })
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        console.log(this.form)
        if (valid) {
          // 做添加
          this.loading = true
          if (this.form.id === undefined) {
            addCoupons(this.form).then((res) => {
              if (res.code === 200) {
                this.msgSuccess('保存成功')
                this.open = false // 关闭弹出层

                this.getCouponsList() // 列表重新查询
              } else {
                this.msgSuccess('保存失败')
              }
            })
          } else {
            this.form.category = this.form.category * 1
            // 做修改
            updateCoupons({
              id: this.form.id,
              category: this.form.category,
              name: this.form.name
            })
              .then((res) => {
                console.log(res)
                this.msgSuccess('修改成功')
                this.loading = false
                this.getCouponsList() // 列表重新查询
                this.open = false // 关闭弹出层
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    // 取消
    cancel() {
      this.open = false
      this.title = ''
      this.getCouponsList()
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
