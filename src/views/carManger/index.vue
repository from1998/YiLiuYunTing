<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="6" :offset="9" style="text-align:center;font-weight:700;padding-top:5px">
        <span>{{ laneName }}</span>
      </el-col>
    </el-row>
    <!-- 表格工具按钮开始 -->
    <el-row style="margin-bottom:20px">
      <el-col :span="19">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
        <el-button type="success" icon="el-icon-coin" size="mini" :disabled="single" @click="handleRenew()">续费</el-button>
        <el-button type="primary" icon="el-icon-download" size="mini" @click="handleDownload">模板下载</el-button>
        <el-upload
          v-show="getUserInfo().role === 4"
          style="width:8.2%;display:inline-block;margin-left:0.5%"
          :action="uploadPath"
          accept="xlsx"
          :limit="3"
          :file-list="fileList"
          :headers="headers"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
        >
          <el-button type="success" size="mini">
            <svg-icon icon-class="import" />
            导入车辆
          </el-button>
        </el-upload>
        <el-button type="warning" size="mini" @click="handleExport">
          导出车辆
          <svg-icon icon-class="export" />
        </el-button>
      </el-col>
      <el-col :span="4" :offset="1" style="padding-left:55px">
        <el-select
          v-show="getUserInfo().role === 1 || getUserInfo().role=== 3"
          v-model="queryParams.parkId"
          placeholder="请选择您要查看的车场"
          size="small"
          style="width:220px"
          clearable
          @change="handleLaneName"
        >
          <svg-icon slot="prefix" icon-class="car" style="margin:10px 0 0 6px" />
          <el-option
            v-for="item in options.parkCategory"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            @change="handleParkFocus"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top:20px">
      <el-col :span="24" :offset="0">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="车牌号" prop="carNumber">
            <el-input
              v-model.trim="queryParams.carNumber"
              placeholder="请输入车牌号"
              clearable
              size="small"
            >
              <svg-icon slot="prefix" icon-class="car" style="margin-left:6px" />
            </el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="userName">
            <el-input
              v-model.trim="queryParams.userName"
              prefix-icon="el-icon-user-solid"
              placeholder="请输入车主姓名"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model.trim="queryParams.mobile"
              prefix-icon="el-icon-phone"
              placeholder="请输入车主手机号"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="车位类型" prop="registerType">
            <el-select
              v-model="queryParams.registerType"
              placeholder="请选择车位类型"
              clearable
              size="small"
            >
              <i slot="prefix" class="el-input__icon el-icon-guide" />
              <el-option
                v-for="item in options.depotCategoryOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
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
    <el-table v-loading="loading" border :data="carTableList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车牌号" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制车牌号:<el-tag type="primary" effect="dark" size="mini">{{ scope.row.carNumber }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.carNumberFlag==='临'" v-clipboard:copy="scope.row.carNumber" v-clipboard:success="clipboardSuccess" type="warning" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carNumber }}</el-tag>
              <el-tag v-else-if="scope.row.carNumberFlag==='新'" v-clipboard:copy="scope.row.carNumber" v-clipboard:success="clipboardSuccess" type="success" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carNumber }} 新</el-tag>
              <el-tag v-else v-clipboard:copy="scope.row.carNumber" v-clipboard:success="clipboardSuccess" type="primary" size="mini" effect="dark"><svg-icon icon-class="car" /> {{ scope.row.carNumber }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="车主姓名" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制车主姓名:<el-tag type="primary" effect="dark" size="mini">{{ scope.row.userName }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="scope.row.userName" v-clipboard:success="clipboardSuccess" type="success" size="mini" effect="dark"><i class="el-icon-user-solid" /> {{ scope.row.userName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="车主手机号" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>提示：点击复制车主手机号:<el-tag type="primary" effect="dark" size="mini">{{ scope.row.mobile }}</el-tag></p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="scope.row.mobile" v-clipboard:success="clipboardSuccess" type="info" size="mini" effect="dark"><i class="el-icon-phone" /> {{ scope.row.mobile }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="车辆类型" align="center" prop="carType" :formatter="carTypeFormatter" />
      <el-table-column label="车位类型" align="center" prop="registerType" :formatter="registerTypeFormatter" />
      <el-table-column label="是否在租" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.status===1" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 在租中</el-tag>
          <el-tag v-show="scope.row.status===0" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 不在租</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前续租时间" align="center" prop="workTimeDur" width="280">
        <template slot-scope="scope">
          <el-row v-show="scope.row.registerType===3" :gutter="0" style="width:100%">
            <template>
              <el-popover trigger="hover" placement="top">
                <div style="text-align:center">
                  <el-tag v-show="scope.row.recentRecord!==undefined && scope.row.recentRecord.length===0" effect="dark" size="mini" type="danger">暂无续费记录！</el-tag>
                  <el-tag v-show="scope.row.recentRecord!==undefined && scope.row.recentRecord.length!==0" effect="dark" size="mini" type="primary">最近三条续费记录:</el-tag>
                  <el-tag v-show="scope.row.recentRecord===undefined" effect="dark" size="mini" type="primary">点击查看最近三条续费记录</el-tag>
                  <br>
                  <span v-for="item in scope.row.recentRecord" :key="item.id" style="line-height:2em">
                    <el-tag effect="dark" type="success" size="mini">{{ item.effectiveTime +' -- '+ item.expireTime }}</el-tag>
                    <br>
                  </span>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="small" style="cursor:pointer" @click="handleMouseEnter(scope.row.id)">
                    <el-row v-show="scope.row.effectiveTime!==null && scope.row.effectiveTime!==null" :gutter="0">
                      <el-col :span="11" :offset="0">
                        {{ scope.row.effectiveTime }}
                      </el-col>
                      <el-col :span="2" :offset="1" style="margin-left:4px">
                        --
                      </el-col>
                      <el-col :span="10" :offset="0">
                        {{ scope.row.expireTime }}
                      </el-col>
                    </el-row>
                    <el-row v-show="scope.row.effectiveTime===null && scope.row.effectiveTime===null" :gutter="0">
                      <el-col :span="24" :offset="0">
                        <span>当前时间未在租</span>
                      </el-col>
                    </el-row>
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-row>
          <el-row v-show="scope.row.registerType!==3" :gutter="20">
            <el-col :span="12" :offset="6">
              <el-tag type="success" size="mini" effect="dark"><i class="el-icon-check" /> 该车位长期有效</el-tag>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="车辆地址"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>车辆地址: <el-tag type="primary" effect="dark" size="mini">{{ scope.row.address }}</el-tag></p>
            <div v-show="scope.row.address" slot="reference" class="name-wrapper">
              <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.address }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="备注"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>备注: <el-tag type="primary" effect="dark" size="mini">{{ scope.row.remark }}</el-tag></p>
            <div v-show="scope.row.remark" slot="reference" class="name-wrapper">
              <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.remark }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-show="scope.row.registerType===3" type="text" icon="el-icon-coin" size="mini" @click="handleRenew(scope.row)">
            <span>续费</span>
          </el-button>
          <router-link v-show="scope.row.registerType===3" :to="'/carManger/index/renewHistory/' + scope.row.id" class="link-type">
            <el-button type="text" size="mini" icon="el-icon-tickets">
              <span>续费历史</span>
            </el-button>
          </router-link>
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

    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item
              v-show="getUserInfo().role === 1 || getUserInfo().role === 3"
              label="车场"
              prop="parkId"
            >
              <el-select
                v-cloak
                v-model="form.parkId"
                placeholder="请选择车场"
                size="small"
                clearable
                @change="handleNumberFocus"
              >
                <el-option
                  v-for="item in options.parkCategory"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="getUserInfo().role === 4?24:12" :offset="0">
            <el-form-item label="车牌号" prop="carNumber">
              <el-input v-model.trim="form.carNumber" placeholder="请输入车牌号" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model.trim="form.userName" placeholder="请输入车主姓名" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model.trim="form.mobile" placeholder="请输入车主手机号" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item label="车辆地址" prop="address">
              <el-input v-model.trim="form.address" placeholder="请输入车辆地址" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="车辆类型" prop="carType">
              <el-select
                v-model="form.carType"
                placeholder="请选择车辆类型"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in options.carCategoryOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item label="车位类型" prop="registerType">
              <el-select
                v-model="form.registerType"
                placeholder="请选择车位类型"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in options.depotCategoryOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item v-if="form.registerType===3" label="时长类型" prop="splitType">
              <el-select
                v-model="form.splitType"
                placeholder="请选择时长类型"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in options.timeCategoryOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.splitType===2" :span="12" :offset="0">
            <el-form-item label="开始时间" prop="startSplit">
              <el-time-picker
                v-model="form.startSplit"
                value-format="HH:mm:ss"
                placeholder="开始时间"
                style="width:195px"
                @change="$forceUpdate()"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.splitType===2" :span="12" :offset="0">
            <el-form-item label="结束时间" prop="endSplit">
              <el-time-picker
                v-model="form.endSplit"
                value-format="HH:mm:ss"
                placeholder="结束时间"
                style="width:195px"
                @change="$forceUpdate()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="层号" prop="tierNumber">
              <el-select v-model="form.tierNumber" placeholder="请选择车位层号" size="small" clearable @change="handleNumberFocus">
                <el-option
                  v-for="item in options.tierNumber"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="区域号" prop="areaNumber">
              <el-select v-model="form.areaNumber" placeholder="请选择车位区域号" size="small" clearable @change="handleNumberFocus">
                <el-option
                  v-for="item in options.areaNumber"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="编号" prop="number">
              <el-tooltip class="item" effect="dark" content="请先选择层号、区域号,再选择该字段" placement="bottom">
                <el-select v-model="form.number" placeholder="请选择车位编号" size="small" clearable :disabled="!(form.tierNumber && form.areaNumber)" @change="$forceUpdate()">
                  <el-option
                    v-for="item in options.number"
                    :key="item.id"
                    :label="item.number"
                    :value="item.number"
                  />
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="updateFlag && form.registerType!==12">
          <el-col :span="12" :offset="0">
            <el-form-item label="起租日期" prop="effectiveTime">
              <el-date-picker
                v-model="form.effectiveTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="起租日期"
                style="width:195px"
                type="date"
                @change="handleFormOption"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="截至日期" prop="expireTime">
              <el-date-picker
                v-model="form.expireTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="截至日期"
                style="width:195px"
                type="date"
                :picker-options="pickerOptions"
                @change="$forceUpdate()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" placeholder="请输入备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 续费弹出层开始 -->
    <el-dialog
      title="续费"
      :visible.sync="RenewOpen"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="renewForm" :model="renewform" :rules="rules" label-width="100px">
        <div v-show="showotherFlag">
          <el-form-item label="车牌号">
            <el-input v-model.trim="renewform.carNumber" placeholder="请输入车牌号" clearable size="small" :disabled="true" />
          </el-form-item>
          <el-form-item label="车主姓名" prop="userName">
            <el-input v-model.trim="renewform.userName" placeholder="请输入车主姓名" clearable size="small" :disabled="true" />
          </el-form-item>
        </div>
        <el-form-item v-if="renewform.registerType===3 || !renewform.id" label="续租日期范围" prop="notEmpty">
          <el-row :gutter="0">
            <el-col :span="11" :offset="0">
              <el-form-item prop="effectiveTime" label="" label-width="0">
                <el-date-picker
                  v-model="renewform.effectiveTime"
                  :placeholder="renewform.effectiveTime"
                  style="width:157px"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="handleRenewOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="0">
              --
            </el-col>
            <el-col :span="11" :offset="0">
              <el-form-item prop="expireTime" label="" label-width="0">
                <el-date-picker
                  v-model="renewform.expireTime"
                  placeholder="到期时间"
                  style="width:175px"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerRenewOptions"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <div v-show="showotherFlag">
          <el-form-item label="层号" prop="tierNumber">
            <el-select v-model="renewform.tierNumber" placeholder="请选择车位层号" size="small" style="width:350px" disabled>
              <el-option
                v-for="item in options.tierNumber"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区域号" prop="areaNumber">
            <el-select v-model="renewform.areaNumber" placeholder="请选择车位区域号" size="small" style="width:350px" disabled>
              <el-option
                v-for="item in options.areaNumber"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-select v-model="renewform.number" placeholder="请选择车位编号" size="small" style="width:350px" disabled>
              <el-option
                v-for="item in options.number"
                :key="item.id"
                :label="item.number"
                :value="item.number"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="续费金额" prop="amount">
          <el-tooltip class="item" effect="dark" content="请输入续费金额" placement="bottom">
            <el-input-number v-model="renewform.amount" :precision="2" :step="1" clearable size="small" :min="0" style="width:350px" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="renewform.remark" type="textarea" placeholder="请输入备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRenewSubmit">确 定</el-button>
        <el-button @click="cancelRenew">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入api
import { getPortList, getPortById, addPort, updatePort, deletePort, doRenew, doManyRenew, downloadRegisterCar, exportRegisterCar, getPortRenewHistory } from '@/api/carManger'
import { getSiteByMid } from '@/api/system/carSetting'
import { listAll } from '@/api/coupons/couponsManger'
import { getToken } from '@/utils/auth'
import { setPickOptions } from '@/utils/shortcuts'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import validate from '@/utils/validate.js'
import moment from 'moment'
export default {
  directives: {
    clipboard
  },
  // 定义页面数据
  data() {
    return {
      pickerOptions: {},
      pickerRenewOptions: {},
      timeValue: [],
      laneName: '',
      CarList: [],
      parkId: '',
      flag: false,
      // 默认显示其它非批量时用到的字段
      showotherFlag: true,
      managerId: '',
      // 验证规则
      validate,
      rules: {
        carNumber: validate.carNumber,
        address: validate.notEmpty,
        mobile: validate.phone,
        carType: validate.notEmpty,
        registerType: validate.notEmpty,
        splitType: validate.notEmpty,
        effectiveTime: validate.notEmpty,
        amount: validate.notEmpty,
        expireTime: validate.notEmpty
      },
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      single: true,
      // 分页数据总条数
      total: 0,
      // 车位列表数据
      carTableList: [],
      // 续费历史列表数据
      renewTableList: [],
      // 添加修改弹出层标题
      title: '',
      // 添加修改弹出层
      open: false,
      updateFlag: false,
      // 续费弹出层
      RenewOpen: false,
      // 起租日期禁用标志位
      // renewPickflag: false,
      // 续费历史弹出层
      RenewHistoryOpen: false,
      // 下拉列表数据
      options: {
        carCategoryOptions: [],
        depotCategoryOptions: [],
        timeCategoryOptions: [],
        areaNumber: [],
        tierNumber: [],
        number: [],
        // 车场类型
        parkCategory: [],
        status: []
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        carName: undefined,
        userName: undefined,
        registerType: undefined,
        mobile: undefined
      },
      // 表单数据
      form: {
        startSplit: '',
        endSplit: '',
        number: ''
      },
      renewform: {
        registerId: ''
      },
      // 声明上传路径
      uploadPath: undefined,
      // 上传文件列表
      fileList: [],
      // 头
      headers: undefined
    }
  },
  // 勾子
  created() {
    // 获取是否字典
    this.getDataByType('yesOrNo').then(res => {
      this.options.status = res.data
    })
    // 获取车辆类型字典数据
    this.getDataByType('CarTypeDic').then(res => {
      this.options.carCategoryOptions = res.data
    })
    // 获取时段类型字典数据
    this.getDataByType('RegisterSplitTypeDic').then(res => {
      this.options.timeCategoryOptions = res.data
    })
    // 获取车位层号字典数据
    this.getDataByType('TierNumberDic').then(res => {
      this.options.tierNumber = res.data
    })
    // 获取车位区域号字典数据
    this.getDataByType('AreaNumberDic').then(res => {
      this.options.areaNumber = res.data
    })
    // 获取车位类型数据
    this.getDataByType('CarRegisterTypeDic').then(res => {
      this.options.depotCategoryOptions = res.data
    })
    // 获取车场列表数据
    listAll().then(res => {
      this.options.parkCategory = res.data
      this.parkId = res.data[0].id
    })
    this.managerId = this.getUserInfo().id
    // 查询车位列表数据
    this.getList()
    // 拼接上传路径
    this.uploadPath = process.env.VUE_APP_BASE_API + '/ylyt/car_register/upload'
    // 设置请求头加入token 避免请求认证的问题
    this.headers = { 'token': getToken() }
  },
  methods: {
    // 起租开始时间变动
    handleFormOption(val) {
      this.$forceUpdate()
      this.$set(this.form, 'expireTime', '')
      this.pickerOptions = setPickOptions(val, '未来')
    },
    // 续租开始时间变动
    handleRenewOptions(val) {
      this.$set(this.renewform, 'expireTime', '')
      this.pickerRenewOptions = setPickOptions(val, '续费')
    },
    // 复制成功的回调函数
    clipboardSuccess() {
      this.msgSuccess(`复制成功！`)
    },
    handleParkFocus() {
      this.getList()
    },
    handleSuccess(res) {
      if (res.code === 200) {
        this.msgSuccess(res.msg)
        this.getList()
      } else {
        this.msgErroe(res.msg)
      }
    },
    handleError(res) {
      this.msgErroe(res.msg)
      this.getList()
    },
    handleLaneName(val) {
      if (val === '') {
        this.laneName = ''
        this.getList()
      } else {
        this.getList()
        for (const key in this.options.parkCategory) {
          if (this.options.parkCategory[key].id === val) {
            this.laneName = this.options.parkCategory[key].name
          }
        }
      }
    },
    // 鼠标移入事件
    handleMouseEnter(id) {
    // 查询续费历史记录列表数据三条
      this.loading = true // 打开遮罩
      const query = {
        page: 1,
        size: 3,
        registerId: id
      }
      getPortRenewHistory(query).then(res => {
        this.carTableList.some(val => {
          if (val.id === id) {
            this.$set(val, 'recentRecord', res.data.list)
            // val.recentRecord = res.data.list
            return true
          }
        })
        this.loading = false// 关闭遮罩
        // }
      })
    },
    // 选择框值改变事件
    handleNumberFocus() {
      this.form.number = undefined
      this.options.number = []
      const query = {
        parkId: this.form.parkId || this.parkId,
        tierNumber: this.form.tierNumber,
        areaNumber: this.form.areaNumber
      }
      if ((query.tierNumber !== null && query.tierNumber !== '' && query.tierNumber !== undefined) && (query.areaNumber !== null && query.areaNumber !== '' && query.areaNumber !== undefined)) {
        getSiteByMid(query).then((res) => {
          res.data.map(val => {
            this.options.number.push({
              number: val.number,
              id: val.id
            })
          })
        })
      }
    },
    // 翻译车辆类型
    carTypeFormatter(row) {
      return this.selectDictLabel(this.options.carCategoryOptions, row.carType.toString())
    },
    // 翻译车位类型
    registerTypeFormatter(row) {
      return this.selectDictLabel(this.options.depotCategoryOptions, row.registerType.toString())
    },
    // 查询车位列表数据
    getList() {
      this.loading = true // 打开遮罩
      getPortList(this.queryParams).then(res => {
        this.carTableList = res.data.list
        this.carTableList.map(val => {
          if (val.carNumber.charAt(0) === '临') {
            val.carNumberFlag = '临'
          } else if (val.carNumber.length === 8) {
            val.carNumberFlag = '新'
          }
        })
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    // 重置条件查询
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.page = 1
      this.queryParams.size = 10
      this.queryParams.page = 1
      this.getList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
      this.single = selection.length !== 1 || selection[0].registerType !== 3
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getList()
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加车辆'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改车辆'
      this.open = true
      this.updateFlag = true
      const portIds = row.id || this.ids[0]
      this.reset()
      this.getInfoById(portIds, 'form')
    },
    // 根据id查询车辆信息
    getInfoById(id, form) {
      this.loading = true
      const query = { 'id': id }
      if (id !== this.ids) {
        getPortById(query).then(res => {
          this[form] = res.data
          if (form === 'renewform') {
            let date
            if (this[form].expireTime) {
              date = moment(this[form].expireTime).subtract(-1, 'days').format('YYYY-MM-DD HH:mm:ss')
              // this.renewPickflag = true
            } else {
              date = moment().format('YYYY-MM-DD HH:mm:ss')
              // this.renewPickflag = false
            }
            this.$set(this[form], 'effectiveTime', date)
            this.$set(this[form], 'expireTime', date)
            this.pickerRenewOptions = setPickOptions(this[form].expireTime, '续费')
            this.$set(this[form], 'remark', '')
          } else {
            this.pickerOptions = setPickOptions(res.data.expireTime, '未来')
          }
          this.loading = false
        })
      }
    },
    // 执行删除
    handleDelete(row) {
      const portIds = row.id || this.ids
      this.$confirm('此操作将永久删除该车辆数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deletePort(portIds).then(res => {
          this.msgSuccess(res.msg)
          this.getList()
          this.loading = false
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
          this.loading = true
          if (this.form.id === undefined || this.form.id === null || this.form.id === '') { // 做添加
            addPort(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updatePort(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getList()// 列表重新查询
              this.open = false// 关闭弹出层
              this.updateFlag = false
            }).catch(() => {
              this.loading = false
              this.updateFlag = false
            })
          }
        }
      })
    },
    // 取消添加或修改
    cancel() {
      this.open = false
      this.loading = false
      this.updateFlag = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.form = {}
      this.resetForm('renewform')
    },
    // 打开续费弹出层
    handleRenew(row) {
      this.RenewOpen = true
      this.reset()
      const portIds = row.id || this.ids
      this.getInfoById(portIds, 'renewform')
      if (row === undefined) {
        this.showotherFlag = false
      }
    },
    // 续费确定操作
    handleRenewSubmit() {
      this.$refs['renewForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.renewform.id) {
            this.renewform.registerId = this.renewform.id
            doRenew(this.renewform).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getList()// 列表重新查询
            })
          } else {
            this.renewform.carRegisterId = this.ids.toString()
            doManyRenew(this.renewform).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getList()// 列表重新查询
            })
          }
          this.loading = false
          this.RenewOpen = false// 关闭弹出层
        }
      })
    },
    // 取消续费操作
    cancelRenew() {
      this.RenewOpen = false
    },
    // 模板下载
    async handleDownload() {
      this.loading = true
      downloadRegisterCar().then(res => {
        const fileName = '固定车模板.xls'
        if ('download' in document.createElement('a')) { // 非IE下载
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        }
      })
      this.loading = false
    },
    // 导出车辆
    handleExport() {
      this.loading = true
      var query = this.queryParams
      delete query.page
      delete query.size
      exportRegisterCar(query).then(res => {
        const fileName = '固定车详情及缴费记录.xls'
        if ('download' in document.createElement('a')) { // 非IE下载
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        }
      })
      this.loading = false
    }
  }
}
</script>
