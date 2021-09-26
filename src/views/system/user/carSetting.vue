<template>
  <div class="content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="车场信息" name="depotInfo" lazy>
        <depot-info :park="parkid" />
      </el-tab-pane>
      <el-tab-pane label="车场配置" name="depotSet" lazy>
        <depot-set />
      </el-tab-pane>
      <el-tab-pane label="收费规则" name="feeRule" lazy>
        <fee-rule />
      </el-tab-pane>
      <el-tab-pane label="新能源收费规则" name="energyRule" lazy>
        <energy-rule />
      </el-tab-pane>
      <el-tab-pane label="岗亭设置" name="watchhouseSet" lazy>
        <watchhouse-set />
      </el-tab-pane>
      <el-tab-pane label="车道设置" name="laneSet" lazy>
        <lane-set />
      </el-tab-pane>
      <el-tab-pane label="保安管理" name="secManger" lazy>
        <sec-manger />
      </el-tab-pane>
      <el-tab-pane label="车位管理" name="portManger" lazy>
        <port-manger />
      </el-tab-pane>
    </el-tabs>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="0" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
<script>
// 导入组件
import depotInfo from './componets/depotInfo'
import depotSet from './componets/depotSet'
import feeRule from './componets/feeRule'
import laneSet from './componets/laneSet'
import portManger from './componets/portManger'
import secManger from './componets/secManger'
import watchhouseSet from './componets/watchhouseSet'
import BackToTop from '@/components/BackToTop'
import energyRule from '@/views/system/user/componets/energyRule'

// import { getDepotById } from '@/api/system/carSetting'

export default {
  components: {
    depotInfo,
    depotSet,
    feeRule,
    laneSet,
    portManger,
    secManger,
    watchhouseSet,
    BackToTop,
    energyRule
  },
  data() {
    return {
      parkid: '',
      activeName: 'depotInfo',
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        className: '车场信息',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  created() {
    this.activeName = window.sessionStorage.getItem('activeName') || 'depotInfo'
    // const managerid = this.$route.params && this.$route.params.id // 路由传参
    // getDepotById({
    //   managerid: managerid
    // }).then(res => {
    //   if (res.data !== null) {
    //     this.parkid = res.data.id
    //     // console.log(this.parkid)
    //   }
    // })
  },
  methods: {
    handleClick(tab) {
      // console.log(tab.paneName)
      window.sessionStorage.setItem('activeName', tab.paneName)
    }

  }
}
</script>
<style lang="scss">
.el-tabs__nav {
  transform: translateX(40px) !important;
}
</style>
