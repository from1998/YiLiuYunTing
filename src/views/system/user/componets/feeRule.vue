<template>
  <el-container>
    <el-header class="container" height="36px" style="padding:15px 10px 45px;font-weight:700">
      收费规则
    </el-header>
    <el-container class="container">
      <el-form ref="form" :model="form" label-width="180px" style="width:860px">
        <!-- 车牌类型 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="车牌类型">
              <el-select v-model="form.carNumberCategory" placeholder="请选择车牌类型" style="width:566px">
                <el-option
                  v-for="item in options.carNumberCategory"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 单次停车免费时长(分钟) 及单日封顶价格(元) -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="单次停车免费时长(分钟)">
              <el-tooltip class="item" effect="dark" content="请输入单次停车免费时长(分钟)" placement="right">
                <el-input-number v-model="form.onceFreeTime" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单日封顶价格(元)">
              <el-tooltip class="item" effect="dark" content="请输入单日封顶价格(元)" placement="right">
                <el-input-number v-model="form.priceCaps" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 首停时长及费用 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="首停时长(分钟)">
              <el-tooltip class="item" effect="dark" content="请输入首停时长(分钟)" placement="right">
                <el-input-number v-model="form.firstStoppTimelong" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首停时长费用(元)">
              <el-tooltip class="item" effect="dark" content="请输入首停时长费用(元)" placement="right">
                <el-input-number v-model="form.firstStoppFee" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 续费时长及单价 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="续费时长(分钟)">
              <el-tooltip class="item" effect="dark" content="请输入续费时长(分钟)" placement="right">
                <el-input-number v-model="form.continueTimeLong" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="续费单价(元/分钟)">
              <el-tooltip class="item" effect="dark" content="请输入续费单价(元/分钟)" placement="right">
                <el-input-number v-model="form.continueFee" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分段收费类型 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="分段收费类型">
              <el-radio-group v-model="form.sectionChargeType">
                <el-radio
                  v-for="item in options.sectionChargeType"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 计费时间段 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="计费时间段">
              <!-- 常规计费 -->
              <el-row v-if="form.sectionChargeType ==='0' ">
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
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="收费金额(元)"
                    width="222"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.divisionFee" :precision="2" :step="1" />
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
              <el-row v-if="form.sectionChargeType ==='1' ">
                <el-table
                  :data="form.overlayCountFee"
                  border
                  stripe
                  style="width: 78%"
                >
                  <el-table-column
                    label="时长(分钟)"
                    width="222"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.minutes" :precision="0" :step="1" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="收费金额(元)"
                    width="222"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.overlayFee" :precision="2" :step="1" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                  >
                    <template slot-scope="scope" style="text-align:center">
                      <el-button
                        size="mini"
                        type="danger"
                        @click.native.prevent="deleteRow(scope.$index, form.overlayCountFee)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-tooltip class="item" effect="dark" placement="right" style="margin-top:16px">
                  <div slot="content"><span>注意分钟从低到高。 最大值{{ limitNumber*60 }}（即{{ limitNumber }}小时）。</span><br>最多可添加{{ limitNumber }}组。</div>
                  <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addFeeRule(form.overlayCountFee)">添加计费规则</el-button>
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

export default {
  name: 'FeeRule',
  data() {
    return {
      limitNumber: '24',
      form: {
        carNumberCategory: '',
        onceFreeTime: '',
        priceCaps: '',
        firstStoppTimelong: '',
        firstStoppFee: '',
        continueTimeLong: '',
        continueFee: '',
        sectionChargeType: '',
        // 常规计费
        commonCountFee: [
          {
            timeDur: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
            divisionFee: ''
          },
          {
            timeDur: [new Date(), new Date()],
            divisionFee: ''
          }
        ],
        // 叠加计费
        overlayCountFee: [
          {
            minutes: '',
            overlayFee: ''
          },
          {
            minutes: '',
            overlayFee: ''
          }
        ]
      },
      options: {
        // 车牌类型
        carNumberCategory: [
          {
            value: '0',
            label: '大车'
          }, {
            value: '1',
            label: '小车'
          }, {
            value: '2',
            label: '自行车'
          }
        ],
        // 分段收费类型
        sectionChargeType: [
          {
            value: '0',
            label: '常规'
          }, {
            value: '1',
            label: '叠加'
          }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      // console.log('submit!')
    },
    onReset() {
      // this.$refs['form'].resetFields()
    },
    deleteRow(index, rows) {
      console.log(index, rows)
      rows.splice(index, 1)
    },
    addFeeRule(array) {
      if (array.length + 1 <= Number(this.limitNumber)) {
        if (array === this.form.commonCountFee) {
          array.push({
            timeDur: [new Date(), new Date()],
            divisionFee: ''
          })
        } else {
          array.push({
            minutes: '',
            overlayFee: ''
          })
        }
      } else {
        this.$message({
          message: '最多只能添加' + this.limitNumber + '项计费规则。',
          type: 'warning'
        })
      }
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

