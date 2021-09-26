<template>
  <div class="app-container">
    <el-row>
      <!-- 表格工具按钮开始 -->
      <el-col :span="6">
        <!--        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加优惠券</el-button>-->
        <!--        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>-->
      </el-col>
      <!-- 查询条件开始 -->
      <el-col :span="20" :offset="0">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
          <el-form-item
            label="车场"
            prop="parkId"
          >
            <el-select
              v-cloak
              v-model="queryParams.parkId"
              placeholder="请选择车场"
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
          <el-form-item label="所属商户" prop="merchantId">
            <el-input
              v-model="queryParams.merchantId"
              placeholder="请输入所属商户"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="优惠类型" prop="category" label-width="70px">
            <el-select v-cloak v-model="queryParams.category" style="width:180px" placeholder="请选择优惠券类型">
              <el-option
                v-for="item in stateOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="使用车牌" prop="carNumber">
            <el-input
              v-model="queryParams.carNumber"
              placeholder="请输入车牌号"
              clearable
              size="small"
              style="width:180px"
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

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="carTableList" stripe>
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="所属商户" align="center" prop="merchantIdString" />
      <el-table-column label="所属优惠券" align="center" prop="couponsIdString" />
      <el-table-column label="优惠类型" align="center" prop="category" :formatter="carTypeFormatter" />
      <el-table-column label="是否使用" align="center" prop="isUsed" :formatter="statusFormatter" />
      <el-table-column label="使用车牌" align="center" prop="carNumber" />
      <el-table-column label="使用时间" align="center" prop="used" />
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
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="权限编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入权限字符" clearable size="small" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" clearable size="small" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入字典备注" clearable size="small" />
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
// import { listRoleForPage } from '@/api/system/role'
import { getListCouponsRecord } from '@/api/coupons/record'
import { listAll } from '@/api/coupons/couponsManger'
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
      roleTableList: [],
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
        parkId: undefined
      },
      // 表单数据
      form: {
        status: '1'
      },
      // 是否打开分配权限的弹出层
      selectMenuOpen: false,
      // 菜单树的数据
      menuOptions: [],
      // 当前选中持角色ID
      currentRoleId: undefined,
      id: '',
      YesOrNo: [],
      stateOptions: [],
      CarList: []
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据  2禁用 1正常
    this.getDataByType('CouponsCategoryDic').then((res) => {
      this.stateOptions = res.data
    })
    // 获取是否字典
    this.getDataByType('yesOrNo').then(res => {
      this.YesOrNo = res.data
      this.dayList = res.data
    })
    // 查询表格数据
    this.getRoleList()
    this.id = this.getID()
    this.getCarList()
    // 角色权限
    this.roleId = this.getRoleID()
  },
  // 方法
  methods: {
    // 获取车厂信息
    getCarList() {
      listAll().then(res => {
        this.CarList = res.data
        this.queryParams.parkId = this.roleId === '1' ? '' : res.data[0].id
      }).catch(err => {
        console.log(err)
      })
    },
    // 查询表格数据
    getRoleList() {
      this.loading = true // 打开遮罩
      getListCouponsRecord(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.carTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 翻译状态 是否立即生效
    statusFormatter(row) {
      return this.selectDictLabel(this.YesOrNo, row.isUsed.toString())
    },
    // 翻译类型
    carTypeFormatter(row) {
      if (row.category !== null) {
        return this.selectDictLabel(this.stateOptions, row.category.toString())
      }
    },
    // 条件查询
    handleQuery() {
      this.getRoleList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      if (this.roleId === '4') {
        this.queryParams.parkId = this.CarList[0].id
      }
      if (this.roleId === '1') {
        this.queryParams.parkId = ''
      }
      this.dateRange = []
      this.getRoleList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
    // 翻译状态
    // statusFormatter(row) {
    //   return this.selectDictLabel(this.statusOptions, row.status)
    // },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加角色信息'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改角色信息'
      this.open = true
      this.reset()
      // 根据dictId查询一个字典信息
      this.loading = true
    },
    // 执行删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该角色数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
      })
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 做添加
          this.loading = true
          if (this.form.roleId === undefined) {
            // addRole(this.form).then(res => {
            //   this.msgSuccess('保存成功')
            //   this.loading = false
            //   this.getRoleList()// 列表重新查询
            //   this.open = false// 关闭弹出层
            // }).catch(() => {
            //   this.loading = false
            // })
          } else { // 做修改
            // updateRole(this.form).then(res => {
            //   this.msgSuccess('修改成功')
            //   this.loading = false
            //   this.getRoleList()// 列表重新查询
            //   this.open = false// 关闭弹出层
            // }).catch(() => {
            //   this.loading = false
            // })
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
