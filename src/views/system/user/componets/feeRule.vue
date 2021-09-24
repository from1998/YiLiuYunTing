<template>
  <el-container>
    <el-header class="container" height="36px" style="padding:15px 10px 45px;font-weight:700">
      收费规则
    </el-header>
    <el-container class="container">
      <el-form ref="freeRuleForm" :model="form" label-width="180px" style="width:860px" :rules="rules" :disabled="flag">
        <!-- 车牌类型 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="车牌类型" prop="numbertype">
              <el-select v-model="form.numbertype" placeholder="请选择车牌类型" style="width:566px" disabled>
                <el-option
                  v-for="item in options.carNumberCategory"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 单次停车免费时长(分钟) 及单日封顶价格(元) -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="单次停车免费时长(分钟)" prop="freeperiod">
              <el-tooltip class="item" effect="dark" content="请输入单次停车免费时长(分钟)" placement="right">
                <el-input-number v-model="form.freeperiod" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单日封顶价格(元)" prop="daypriceup">
              <el-tooltip class="item" effect="dark" content="请输入单日封顶价格(元)" placement="right">
                <el-input-number v-model="form.daypriceup" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 首停时长及费用 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="首停时长(分钟)" prop="yduration">
              <el-tooltip class="item" effect="dark" content="请输入首停时长(分钟)" placement="right">
                <el-input-number v-model="form.yduration" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首停时长费用(元)" prop="ymoney">
              <el-tooltip class="item" effect="dark" content="请输入首停时长费用(元)" placement="right">
                <el-input-number v-model="form.ymoney" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 续费时长及单价 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="续费时长(分钟)" prop="overunit">
              <el-tooltip class="item" effect="dark" content="请输入续费时长(分钟)" placement="right">
                <el-input-number v-model="form.overunit" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="续费单价(元/分钟)" prop="overmoney">
              <el-tooltip class="item" effect="dark" content="请输入续费单价(元/分钟)" placement="right">
                <el-input-number v-model="form.overmoney" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分段收费类型 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="收费类型" prop="splittype">
              <el-radio-group v-model="form.splittype">
                <el-radio
                  v-for="item in options.sectionChargeType"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 计费时间段 -->
        <el-row v-if="form.splittype !==1 ">
          <el-col :span="24">
            <el-form-item label="计费时间段">
              <!-- 分段计费 -->
              <el-row v-if="form.splittype ===3 ">
                <el-table
                  :data="form.commonCountFee"
                  border
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    label="时间范围"
                    width="372"
                  >
                    <template slot-scope="scope">
                      <el-time-picker
                        v-model="scope.row.timeDur"
                        is-range
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围"
                        value-format="HH-mm-ss"
                        @input="$forceUpdate()"
                        @change="timeChange(scope.row,scope.row.timeDur)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="收费金额(元)"
                    width="222"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.amount" :precision="2" :step="1" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                  >
                    <template slot-scope="scope" style="text-align:center">
                      <el-button
                        size="mini"
                        type="danger"
                        @click.native.prevent="deleteRow(scope.$index, form.commonCountFee)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-tooltip class="item" effect="dark" placement="right" style="margin-top:16px">
                  <div slot="content"><span>注意正确的时间格式 例:07:00:00，时间段从低到高。</span><br>最多可添加{{ limitNumber }}个时间段,时段计费优先其他计费。</div>
                  <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addFeeRule(form.commonCountFee)">添加计费规则</el-button>
                </el-tooltip>
              </el-row>
              <!-- 叠加计费 -->
              <el-row v-if="form.splittype ===2 ">
                <el-table
                  :data="form.splittimejsonDto"
                  border
                  stripe
                  style="width: 78%"
                >
                  <el-table-column
                    label="时长(分钟)"
                    width="222"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.duration" :precision="0" :step="1" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="收费金额(元)"
                    width="222"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.amount" :precision="2" :step="1" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                  >
                    <template slot-scope="scope" style="text-align:center">
                      <el-button
                        size="mini"
                        type="danger"
                        @click.native.prevent="deleteRow(scope.$index, form.splittimejsonDto)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-tooltip class="item" effect="dark" placement="right" style="margin-top:16px">
                  <div slot="content"><span>注意分钟从低到高。 最大值{{ limitNumber*60 }}（即{{ limitNumber }}小时）。</span><br>最多可添加{{ limitNumber }}组。</div>
                  <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addFeeRule(form.splittimejsonDto)">添加计费规则</el-button>
                </el-tooltip>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-form-item>
            <div class="footer">
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button type="danger" @click="onReset">重置</el-button>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </el-container>
  </el-container>

</template>
<script>

import { getParkfeeByMid, addParkfee, updateParkfee } from '@/api/system/carSetting'
import validate from '@/utils/validate'

export default {
  name: 'FeeRule',
  data() {
    return {
      flag: false,
      // 验证规则
      validate,
      rules: {
        numbertype: validate.notEmpty,
        daypriceup: validate.notEmpty,
        freeperiod: validate.notEmpty,
        yduration: validate.notEmpty,
        ymoney: validate.notEmpty,
        overunit: validate.notEmpty,
        overmoney: validate.notEmpty,
        splittype: validate.notEmpty
      },
      limitNumber: '24',
      // formBak: {},
      form: {
        roleId: '',
        // 用户id
        managerid: '',
        numbertype: 0,
        daypriceup: '',
        freeperiod: '',
        yduration: '',
        ymoney: '',
        overunit: '',
        overmoney: '',
        // 默认常规计费
        splittype: 1,
        splittimejsonDto: [],
        // 分段计费
        commonCountFee: [
          {
            timeDur: [],
            amount: ''
          }
        ]
      },
      options: {
        // 车牌类型
        carNumberCategory: [],
        // 收费类型
        sectionChargeType: []
      }
    }
  },
  created() {
    this.form.managerid = this.$route.params && this.$route.params.id // 路由传参
    // this.formBak = this.form
    this.init(this.form.managerid)
    // 获取收费规则车辆类型字典数据
    this.getDataByType('FeeNumberTypeDic').then(res => {
      this.options.carNumberCategory = res.data
    })
    // 获取分段收费类型字典数据
    this.getDataByType('FeeSplitTypeDic').then(res => {
      this.options.sectionChargeType = res.data
    })
  },
  methods: {
    async init(id) {
      if (id === undefined) {
        id = this.getID()
        this.roleId = this.getRoleID()
        console.log(this.roleId)
        // b保安的roleID是6
        if (this.roleId === '6') {
          this.flag = true
          console.log(this.flag)
        }
      }
      this.loading = true // 打开遮罩
      await getParkfeeByMid({
        managerid: id
      }).then(res => {
        this.resdata = res.data
        if (res.data !== null) {
          this.form = res.data
          // 常规
          if (res.data.splittype === 1) {
            this.form.splittimejsonDto = []
            this.form.commonCountFee = []
            // 分段
          } else if (res.data.splittype === 3) {
            if (res.data.splittimejsonDto !== null) {
              this.handletime()
            } else {
              this.form.splittimejsonDto = []
              this.form.commonCountFee = []
            }
          } else {
            this.form.commonCountFee = []
          }
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      this.$refs['freeRuleForm'].validate((valid) => {
        if (valid) {
          // 如果是分段计费
          if (this.form.splittype === 3) {
            this.form.splittimejsonDto = this.form.commonCountFee
            // delete this.form.commonCountFee
            // this.form.splittimejsonDto.forEach(ele => {
            //   delete ele.timeDur
            // })
          }
          if (this.resdata === null) {
            this.loading = true // 打开遮罩
            addParkfee(this.form).then(res => {
              if (res.code === 200) {
                this.msgSuccess('添加成功')
                this.init()
                this.loading = false // 关闭遮罩
              } else {
                this.loading = false // 关闭遮罩
              }
            })
          } else {
            this.loading = true // 打开遮罩
            updateParkfee(this.form).then(() => {
              this.msgSuccess('修改成功')
              this.init()
              this.loading = false // 关闭遮罩
            }).catch(() => {
              this.msgError('修改失败')
              this.loading = false // 关闭遮罩
            })
          }
        }
      })
    },
    onReset() {
      this.$confirm('确定重置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.form = this.formBak
        this.clear()
        this.msgSuccess('重置成功')
      }).catch(() => {
        this.msgError('重置已取消')
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // 添加计费规则
    addFeeRule(array) {
      if (array.length + 1 <= Number(this.limitNumber)) {
        if (array === this.form.commonCountFee) {
          array.push({
            timeDur: [],
            amount: ''
          })
        } else {
          array.push({
            duration: '',
            amount: ''
          })
        }
      } else {
        this.$message({
          message: '最多只能添加' + this.limitNumber + '项计费规则。',
          type: 'warning'
        })
      }
    },
    // 处理请求到的分段计费
    handletime() {
      this.form.commonCountFee = this.form.splittimejsonDto.map(val => {
        return {
          amount: val.amount,
          // 回显的值需要保留，以待再次提交
          start: val.start,
          end: val.end,
          timeDur: [val.start, val.end]
        }
      })
      this.form.splittimejsonDto = []
    },
    // 处理待发送的时间
    timeChange(row, val) {
      row.start = val[0]
      row.end = val[1]
    },
    clear() {
      var data = {
        // 用户id
        managerid: '',
        numbertype: 0,
        daypriceup: '',
        freeperiod: '',
        yduration: '',
        ymoney: '',
        overunit: '',
        overmoney: '',
        // 默认常规计费
        splittype: 1,
        splittimejsonDto: [],
        // 分段计费
        commonCountFee: [
          {
            timeDur: [],
            amount: ''
          }
        ]
      }
      this.form = data
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
    display: -webkit-box;
     -webkit-box-pack:center;
}
.footer {
    margin-left: 50%;
    transform: translateX(-50%);
}
.el-table__header {
  tr {
    height: 25px;
    th {
      padding: 0!important;
      text-align: center;
    }
  }
}
.el-table td {
  text-align: center;
}
</style>

