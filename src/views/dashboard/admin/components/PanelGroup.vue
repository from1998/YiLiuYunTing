<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xl="4" :xs="12" :sm="12" :md="8" :lg="getUserInfo().role === 1 || getUserInfo().role=== 3?8:6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总车位
          </div>
          <count-to :start-val="0" :end-val="val[0]" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xl="4" :xs="12" :sm="12" :lg="getUserInfo().role === 1 || getUserInfo().role=== 3?8:6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="car" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            空闲车位
          </div>
          <count-to :start-val="0" :end-val="val[1]" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xl="4" :md="8" :xs="12" :sm="12" :lg="getUserInfo().role === 1 || getUserInfo().role=== 3?8:6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money-bag" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总收益
          </div>
          <count-to :start-val="0" :end-val="val[2]" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xl="4" :xs="12" :sm="12" :lg="getUserInfo().role === 1 || getUserInfo().role=== 3?8:6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日收益
          </div>
          <count-to :start-val="0" :end-val="val[3]" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <div v-if="getUserInfo().role === 1 || getUserInfo().role=== 3">
      <el-col :xl="4" :md="8" :span="4" :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="ai-profit" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              总分润
            </div>
            <count-to :start-val="0" :end-val="val[4]" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xl="4" :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="money_pay_fill" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              当日分润
            </div>
            <count-to :start-val="0" :end-val="val[5]" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </div>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    val: {
      type: Array,
      required: true
    }
  },
  // created() {
  // this.fetchData()
  // console.log(this.val)
  // },
  methods: {
    // fetchData() {
    //   getPanelGroup.then(response => {
    //     console.log('response', response)
    //     // 列表数据
    //     // this.list = response.data.records
    //     // this.page.total = response.data.total
    //   })
    // }
    // handleSetLineChartData(type) {
    //   this.$emit('handleSetLineChartData', type)
    // }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    cursor: default;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
