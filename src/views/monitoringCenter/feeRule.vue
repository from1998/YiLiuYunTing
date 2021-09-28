<template>
  <div class="content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="收费规则" name="feeRule" lazy>
        <fee-rule />
      </el-tab-pane>
      <el-tab-pane label="新能源收费规则" name="energyRule" lazy>
        <energy-rule />
      </el-tab-pane>
    </el-tabs>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="0" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
<script>
// 导入组件
import feeRule from '@/views/system/user/componets/feeRule'
import energyRule from '@/views/system/user/componets/energyRule'
import BackToTop from '@/components/BackToTop'

export default {
  components: {
    feeRule,
    BackToTop,
    energyRule
  },
  data() {
    return {
      parkid: '',
      activeName: 'feeRule',
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        className: '收费规则',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  created() {
    this.activeName = window.sessionStorage.getItem('activeFreeName') || 'feeRule'
  },
  methods: {
    handleClick(tab) {
      window.sessionStorage.setItem('activeFreeName', tab.paneName)
    }

  }
}
</script>
<style lang="scss">
.el-tabs__nav {
  transform: translateX(40px) !important;
}
</style>

