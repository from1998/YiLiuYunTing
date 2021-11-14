<template>
  <div class="container">
    <el-header height="36px" style="padding:15px 0 45px;font-weight:700" align="center">
      车位管理
    </el-header>
    <el-row>
      <!-- 表格工具按钮开始 -->
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <!-- 查询条件开始 -->
      <el-col :span="17" :offset="1">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="层号" prop="tierNumber">
            <el-select v-model="queryParams.tierNumber" placeholder="请选择车位层号" size="small" clearable>
              <el-option
                v-for="item in options.tierNumber"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区域号" prop="areaNumber">
            <el-select v-model="queryParams.areaNumber" placeholder="请选择车位区域号" size="small" clearable>
              <el-option
                v-for="item in options.areaNumber"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-input
              v-model.trim="queryParams.number"
              placeholder="请输入车位编号"
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
    <el-table v-loading="loading" border :data="portList" stripe @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车位层号" align="center" prop="tierNumber" :formatter="tierNumberFormatter" />
      <el-table-column label="车位区域号" align="center" prop="areaNumber" :formatter="areaNumberFormatter" />
      <el-table-column label="车位编号" align="center" prop="number" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
      style="margin-top:10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="层号" prop="tierNumber">
          <el-select v-model="form.tierNumber" placeholder="请选择车位层号" size="small" style="width:370px">
            <el-option
              v-for="item in options.tierNumber"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区域号" prop="areaNumber">
          <el-select v-model="form.areaNumber" placeholder="请选择车位区域号" size="small" style="width:370px">
            <el-option
              v-for="item in options.areaNumber"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model.trim="form.number" placeholder="请输入车位编号" clearable size="small" />
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
import { getSiteListByPage, getSiteById, addCarSite, updateSite, deleteSiteByList } from '@/api/system/carSetting'
import validate from '@/utils/validate'

export default {
  name: 'PortManger', // 和对应路由表中配置的name值一致
  // 定义页面数据
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        tierNumber: validate.notEmpty,
        areaNumber: validate.notEmpty,
        number: validate.notEmpty
      },
      // 用户id备份
      manageridBak: '',
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
      // 表格数据
      portList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        tierNumber: undefined,
        areaNumber: undefined,
        number: undefined,
        managerId: undefined
      },
      // 表单数据
      form: {
        tierNumber: undefined,
        areaNumber: undefined,
        number: undefined,
        remark: ''
      },
      options: {
        tierNumber: [],
        areaNumber: []
      }
    }
  },
  // 勾子
  created() {
    // 获取车位层号字典数据
    this.getDataByType('TierNumberDic').then(res => {
      this.options.tierNumber = res.data
    })
    // 获取车位区域号字典数据
    this.getDataByType('AreaNumberDic').then(res => {
      this.options.areaNumber = res.data
    })
    // 取路由路径上的参数
    this.queryParams.managerId = this.manageridBak = this.form.parentId = this.$route.params && this.$route.params.id // 路由传参
    // 查询表格数据
    this.getPortList()
  },
  // 方法
  methods: {
    // 翻译车位层号
    tierNumberFormatter(row) {
      return this.selectDictLabel(this.options.tierNumber, row.tierNumber.toString())
    },
    // 翻译车位区域号
    areaNumberFormatter(row) {
      return this.selectDictLabel(this.options.areaNumber, row.areaNumber.toString())
    },
    // 查询表格数据
    getPortList() {
      this.loading = true // 打开遮罩
      getSiteListByPage(this.queryParams).then(res => {
        this.portList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 查询
    handleQuery() {
      this.getPortList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.managerId = this.manageridBak
      this.getPortList()
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
      this.getPortList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getPortList()
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加车位'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改车位'
      const id = row.id || this.ids[0]
      this.open = true
      this.reset()
      // 根据id查询岗亭信息
      this.loading = true
      getSiteById({
        id: id
      }).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const id = row.id || this.ids
      this.$confirm('此操作将永久删除该车位数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteSiteByList(id).then(res => {
          this.loading = false
          this.msgSuccess(res.msg)
          this.getPortList()// 重新查询
        })
      }).catch(() => {
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
            addCarSite(this.form).then((res) => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getPortList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updateSite(this.form).then((res) => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getPortList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
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
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.form = {
        tierNumber: '',
        areaNumber: '',
        number: '',
        managerId: this.manageridBak

      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
width: 80%;
margin: 0 auto;
}
</style>

