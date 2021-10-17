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
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加商家</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <!-- 查询条件开始 -->
      <el-col :span="14" :offset="0">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="58px">
          <el-form-item label="商户号" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入商户号"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="联系人" prop="realName">
            <el-input
              v-model="queryParams.realName"
              placeholder="请输入联系人"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="queryParams.mobile"
              placeholder="请输入手机号"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <!--          <el-form-item label="类型" prop="isLeave" label-width="70px">-->
          <!--            <el-select v-cloak v-model="queryParams.isLeave" style="width:180px" placeholder="请选择优惠券类型">-->
          <!--              <el-option-->
          <!--                v-for="item in stateOptions"-->
          <!--                :key="item.dictValue"-->
          <!--                :label="item.dictLabel"-->
          <!--                :value="Number(item.dictValue)"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="是否开放" prop="isLeave" label-width="70px">-->
          <!--            <el-select v-cloak v-model="queryParams.isLeave" style="width:180px" placeholder="请选择优惠券是否开放">-->
          <!--              <el-option-->
          <!--                v-for="item in stateOptions"-->
          <!--                :key="item.dictValue"-->
          <!--                :label="item.dictLabel"-->
          <!--                :value="Number(item.dictValue)"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 查询条件结束 -->
      </el-col>
      <el-col :span="4" :offset="3">
        <el-select
          v-cloak
          v-show="getUserInfo().role === 1 || getUserInfo().role=== 3"
          v-model="queryParams.parentId"
          placeholder="请选择车场"
          size="small"
          style="width:220px;margin-left:58px"
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
    <el-table v-loading="loading" border :data="roleTableList" stripe @selection-change="handleSelectionChnage">
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column label="商户号" align="center" prop="username" />
      <el-table-column label="联系人" align="center" prop="realName" />
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="地址" align="center" prop="email" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item
          v-if="roleId === 1 && title === '添加商家' "
          label="车场"
          prop="parentId"
          label-width="70px"
        >
          <el-select
            v-cloak
            v-model="form.parentId"
            style="width:100%"
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
        <el-form-item label="商户号" prop="username">
          <el-input v-model="form.username" placeholder="请输入商家账号" clearable size="small" />
        </el-form-item>
        <el-form-item label="联系人" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入商家联系人" clearable size="small" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入商家手机号" clearable size="small" />
        </el-form-item>
        <el-form-item label="地址" prop="email">
          <el-input v-model="form.email" placeholder="请输入商家地址" clearable size="small" />
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
import { listCouponsMerchantForPage, addMerchant, deleteMerchantId, getMerchantById, updateMerchant } from '@/api/coupons/merchantManger'
import validate from '@/utils/validate'
import { listAll } from '@/api/coupons/couponsManger'
export default {
  // 定义页面数据
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        parentId: validate.notEmpty,
        email: validate.notEmpty,
        realName: validate.notEmpty,
        username: validate.notEmpty,
        mobile: validate.phone
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
        parentId: undefined,
        mobile: undefined,
        realName: '',
        username: ''
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
      CarList: [],
      roleId: '',
      laneName: ''
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据  2禁用 1正常 优惠券类型
    this.getDataByType('CouponsCategoryDic').then((res) => {
      this.stateOptions = res.data
    })
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 查询表格数据
    this.getRoleList()
    // 获取车厂数据
    this.getCarList()
    this.roleId = this.getUserInfo().role
  },
  // 方法
  methods: {
    handleLaneName(val) {
      if (val === '') {
        this.laneName = ''
        this.getRoleList()
      } else {
        this.getRoleList()
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
        this.queryParams.parentId = this.roleId === 1 ? '' : res.data[0].id
      }).catch(err => {
        console.log(err)
      })
    },
    // 翻译类型
    carTypeFormatter(row) {
      return this.selectDictLabel(this.stateOptions, row.category.toString())
    },
    // 查询表格数据
    getRoleList() {
      this.loading = true // 打开遮罩
      listCouponsMerchantForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.roleTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.getRoleList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      if (this.roleId === 4) {
        this.queryParams.parentId = this.CarList[0].id
      }
      if (this.roleId === 1) {
        this.queryParams.parentId = ''
      }
      this.dateRange = []
      this.getRoleList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.id)
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
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加商家'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改商家'
      // const roleId = row.roleId || this.ids
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据dictId查询一个字典信息
      this.loading = true
      getMerchantById({
        id: row.id
      }).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const roleIds = row.id || this.ids
      this.$confirm('此操作将永久删除该角色数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteMerchantId(roleIds).then(res => {
          this.loading = false
          this.msgSuccess(res.msg)
          this.getRoleList()// 全查询
        })
      })
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 做添加
          this.loading = true
          if (this.form.id === undefined) {
            addMerchant(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.resetQuery()
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updateMerchant(this.form).then(res => {
              if (res.code === 200) {
                this.msgSuccess(res.msg)
                this.loading = false
                this.getRoleList()// 列表重新查询
                this.open = false// 关闭弹出层
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
