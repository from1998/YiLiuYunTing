const steps = [
  {
    element: '.sidebar-container',
    popover: {
      title: '侧边栏',
      description: '点击侧边栏内的菜单，即可打开对应的页面',
      position: 'right',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#hamburger-container',
    popover: {
      title: '侧边栏开关',
      description: '点击该按钮展开/收缩侧边栏',
      position: 'bottom',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: '面包屑导航',
      description: '指示您当前所在的路径位置',
      position: 'bottom',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#time-container',
    popover: {
      title: '日期与时间',
      description: '指示当前日期与时间',
      position: 'left',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#weather-container',
    popover: {
      title: '天气',
      description: '指示当前所在地气温、天气状态',
      position: 'left',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#notices-container',
    popover: {
      title: '通知公告',
      description: '在这里查看系统推送的通知公告',
      position: 'left',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#note-container',
    popover: {
      title: '便签',
      description: '在这里随时记录您的想法，可用于工作内容备忘、交接',
      position: 'left',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: '全屏切换',
      description: '点击该按钮使页面全屏',
      position: 'left',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#size-select',
    popover: {
      title: '切换尺寸',
      description: '切换全局尺寸',
      position: 'left',
      closeBtnText: '跳过指引', // Text on the close button
      nextBtnText: '下一步', // Next button text
      prevBtnText: '上一步'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: '页面标签',
      description: '在这里显示您浏览过的页面，您可以右键执行相关操作',
      position: 'bottom',
      doneBtnText: '完成', // Text on the last button
      closeBtnText: '关闭', // Text on the close button
      prevBtnText: '上一步'
    },
    padding: 0
  }
]

export default steps
