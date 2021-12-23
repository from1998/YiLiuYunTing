<template>
  <div class="app-container">
    <!-- 表格工具按钮开始 -->
    <el-row :gutter="0" style="margin-bottom: 8px;">
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="18">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" align="right">
          <el-form-item label="标题" prop="noticeTitle">
            <el-input
              v-model="queryParams.noticeTitle"
              placeholder="请输入通知公告标题"
              clearable
              size="small"
            >
              <svg-icon slot="prefix" icon-class="notice" style="margin-left:6px" />
            </el-input>
          </el-form-item>
          <el-form-item label="类型" prop="noticeType">
            <el-select
              v-model="queryParams.noticeType"
              placeholder="请选择类型"
              clearable
              size="small"
            >
              <i slot="prefix" class="el-input__icon el-icon-guide" />
              <el-option
                v-for="dict in noticeTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              size="small"
            >
              <i slot="prefix" class="el-input__icon el-icon-guide" />
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="noticeTableList" stripe @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand" label="备注" width="60px" align="center">
        <template slot-scope="scope">
          <div style="margin-left:20px">
            <el-tag v-if="scope.row.remark" type="info" size="mini" effect="dark"> 备注： {{ scope.row.remark }} </el-tag>
            <el-tag v-else type="info" size="mini" effect="dark"> <svg-icon icon-class="notice" /> 暂无备注 </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制标题:<el-tag type="primary" effect="dark" size="mini">{{ scope.row.noticeTitle }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="scope.row.noticeTitle" v-clipboard:success="clipboardSuccess" style="max-width:100%;margin-top:8px;overflow:hidden;text-overflow:ellipsis;" type="info" size="mini" effect="dark"> <svg-icon icon-class="notice" /> {{ scope.row.noticeTitle }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" style="max-width:100%;margin-top:8px;overflow:hidden;text-overflow:ellipsis;"> {{ scope.row.noticeContent }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="noticeType" align="center" :formatter="noticeTypeFormatter" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.status==='1'" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 正常</el-tag>
          <el-tag v-show="scope.row.status==='2'" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布者" align="center">
        <template slot-scope="scope">
          <el-tag size="mini"> <i class="el-icon-user-solid" /> {{ scope.row.createBy }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" width="170" sortable prop="createTime">
        <template slot-scope="scope">
          <el-tag size="mini" type="primary"> <i class="el-icon-time" /> {{ scope.row.createTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center">
        <template slot-scope="scope">
          <el-tag size="mini"> <i class="el-icon-user-solid" /> {{ scope.row.updateBy }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="170" sortable prop="updateTime">
        <template slot-scope="scope">
          <el-tag size="mini" type="primary"> <i class="el-icon-time" /> {{ scope.row.updateTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="primary" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据表格结束 -->
    <!-- 分页控件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.pageSize"
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
      width="940px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="50px">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入通知公告标题" clearable size="small">
                <svg-icon slot="prefix" icon-class="notice" style="margin-left:6px" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :value="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="noticeType">
              <el-radio-group v-model="form.noticeType">
                <el-radio
                  v-for="dict in noticeTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :value="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="noticeContent">
              <vue-editor
                ref="noticeContent"
                v-model="form.noticeContent"
                height="300px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改弹出层结束 -->

    <!--公告内容 弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="noticeContentOpen"
      width="900px"
      center
      append-to-body
    >
      <vue-editor
        ref="noticeContent"
        v-model="noticeContent"
        @focus="focus($event)"
      />
    </el-dialog>
    <!-- 公告内容弹出层结束 -->

  </div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
// 引入api
import { listNoticeForPage, addNotice, updateNotice, getNoticeById, deleteNoticeByIds } from '@/api/system/notice'
import validate from '@/utils/validate.js'

export default {
  components: {
    VueEditor
  },
  // 定义页面数据
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        noticeTitle: validate.notEmpty,
        status: validate.notEmpty,
        noticeType: validate.notEmpty,
        noticeContent: validate.notEmpty
      },
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 字典表格数据
      noticeTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,

      // 状态数据字典
      statusOptions: [],
      // 公告类型
      noticeTypeOptions: [],
      // 场景
      noticeSceneOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        noticeType: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 查看内容的弹出层
      noticeContentOpen: false,
      // 查看内容
      noticeContent: undefined
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    this.getDataByType('sys_notice_type').then(res => {
      this.noticeTypeOptions = res.data
    })
    this.getDataByType('XCW_NoticeUseType').then(res => {
      this.noticeSceneOptions = res.data
    })
    // 查询表格数据
    this.getNoticeList()
  },
  // 方法
  methods: {
    // 获取焦点事件
    focus(event) {
      event.enable(false) // 设置富文本编辑器不可编辑
    },
    // 复制成功的回调函数
    clipboardSuccess() {
      this.msgSuccess(`复制成功！`)
    },
    // 查询表格数据
    getNoticeList() {
      this.loading = true // 打开遮罩
      listNoticeForPage(this.queryParams, this.dateRange).then(res => {
        this.noticeTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.getNoticeList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.page = 1
      this.queryParams.size = 10
      this.dateRange = []
      this.getNoticeList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.noticeId)
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getNoticeList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getNoticeList()
    },
    // 翻译类型
    noticeTypeFormatter(row) {
      return this.selectDictLabel(this.noticeTypeOptions, row.noticeType)
    },
    // 翻译场景
    noticeSceneFormatter(row) {
      if (row.useType) {
        return this.selectDictLabel(this.noticeSceneOptions, row.useType.toString())
      }
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.form.status = '1'
      this.title = '添加通知公告'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改通知公告'
      const noticeId = row.noticeId || this.ids
      this.open = true
      this.reset()
      // 根据noticeId查询一个公告信息
      this.loading = true
      getNoticeById(noticeId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const noticeIds = row.noticeId || this.ids
      this.$confirm('此操作将删除该通知公告, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteNoticeByIds(noticeIds).then(res => {
          this.msgSuccess(res.msg)
          this.getNoticeList()// 全查询
        })
        this.loading = false
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
          if (this.form.noticeId === undefined) {
            addNotice(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getNoticeList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updateNotice(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getNoticeList()// 列表重新查询
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
        noticeId: undefined,
        noticeTitle: undefined,
        noticeContent: undefined,
        noticeType: '0',
        status: '0',
        remark: undefined
      }
    },
    // 打开修改的弹出层
    handleView(row) {
      this.title = row.noticeTitle
      this.noticeContentOpen = true
      this.noticeContent = row.noticeContent
    }
  }
}
</script>
