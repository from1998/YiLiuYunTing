<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <div class="right-menu-item">
          <span>{{ Utils() }}</span>
        </div>
        <div>
          <iframe class="right-menu-item hover-effect" width="240px" height="60px" frameborder="0" scrolling="no" hspace="0" src="https://i.tianqi.com/?c=code&a=getcode&id=34&icon=1" />

        </div>
        <el-tooltip content="通知公告" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect">
            <svg-icon icon-class="notice" style="font-weight:700" @click="noticeOpen" />
          </div>
        </el-tooltip>
        <el-tooltip content="便签" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect">
            <i class="el-icon-edit" style="font-weight:700" @click="noteOpen" />
          </div>
        </el-tooltip>

        <!-- <search id="header-search" class="right-menu-item" /> -->

        <el-tooltip content="全屏切换" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="全局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <error-log class="errLog-container right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="require('@/assets/images/logo.png')" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>你好,{{ username }}</el-dropdown-item>
          <!-- <el-dropdown-item divided @click.prevent.stop="guide">操作指引</el-dropdown-item> -->
          <router-link to="/updatePWD">
            <el-dropdown-item divided> 修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="这是通知公告标题"
      width="600px"
      :visible.sync="noticeDialogVisible"
      append-to-body
      center
      :close-on-click-modal="false"
      @closed="noticeDialogVisible = false"
    >
      这里是通知公告内容...
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="noticeDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="便签"
      width="400px"
      :visible.sync="dialogVisible"
      append-to-body
      @closed="saveNotes"
    >
      <el-input
        v-model="notes"
        type="textarea"
        :rows="7"
        placeholder="便签中的内容会存储在本地。
即便您关闭浏览器，下次打开时，依然会读取到上一次的记录。
这是一个小巧实用的本地备忘录。"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from '@/assets/js/steps'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect
    // Search
  },
  data() {
    return {
      username: '',
      dialogVisible: false,
      noticeDialogVisible: false,
      notes: localStorage.getItem('notes'),
      driver: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  mounted() {
    this.driver = new Driver()
  },
  async created() {
    this.username = await this.getUserInfo().realName
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
      this.msgSuccess('ok')
    },
    noteOpen() {
      this.dialogVisible = true
    },
    noticeOpen() {
      this.noticeDialogVisible = true
    },
    saveNotes() {
      localStorage.setItem('notes', this.notes)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: middle;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
