<template>
  <div class="app-container">
    <!-- 标题 -->
    <el-header class="container" height="40px" style="padding:25px 0 45px;font-size:30px;font-weight:700;text-align:center;background-color: #fff;">
      <el-row>
        <el-col :span="4" :offset="10">
          操作指引
        </el-col>
      </el-row>
    </el-header>
    <aside>
      <el-row :gutter="0">
        <el-col :span="22" :offset="2">
          指引对于首次使用该后台管理系统的人是非常有帮助的。它将一步步引领您了解并掌握该系统的相关功能与设置。
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="22" :offset="2">
          我们将持续优化操作指引与该系统，为您带来更好的使用体验。
        </el-col>
      </el-row>
    </aside>
    <el-row :gutter="0">
      <el-col :span="12" :offset="6" style="text-align:center">
        <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
          开始操作指引
        </el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
