<template>
  <div class="content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="车场信息" name="first">
        <depot-info />
      </el-tab-pane>
      <el-tab-pane label="车场配置" name="second">
        <depot-set />
      </el-tab-pane>
      <el-tab-pane label="收费规则" name="third">
        <fee-rule />
      </el-tab-pane>
      <el-tab-pane label="岗亭设置" name="fourth">
        <watchhouse-set />
      </el-tab-pane>
      <el-tab-pane label="车道设置" name="second">
        <lane-set />
      </el-tab-pane>
      <el-tab-pane label="保安管理" name="third">
        <sec-manger />
      </el-tab-pane>
      <el-tab-pane label="车位管理" name="fourth">
        <port-manger />
      </el-tab-pane>
    </el-tabs>
    <span>hello</span>
  </div>
</template>
<script>
// todo 停车端个人中心与车厂配置待完成
// import test1 from './componets/test1'
import depotInfo from './componets/depotInfo.vue'
import depotSet from './componets/depotSet'
import feeRule from './componets/feeRule'
import laneSet from './componets/laneSet'
import portManger from './componets/portManger'
import secManger from './componets/secManger'
import watchhouseSet from './componets/watchhouseSet'
export default {
  components: {
    depotInfo,
    depotSet,
    feeRule,
    laneSet,
    portManger,
    secManger,
    watchhouseSet
  }
}
</script>
<style lang="scss">
.content {
  height: 100%;
    .el-tabs {
    height: 100%!important;
    .test1 {
      height: 100%;
      min-height: 100%;
    }
  }
}
</style>
