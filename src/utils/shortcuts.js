import moment from 'moment'
export function setPickOptions(val) {
  // 如果没传递值，则使用当前时间作为开始时间
  if (!val) {
    val = moment().format('YYYY-MM-DD HH:mm:ss') // 当前时间
  }
  const pickOptions = {
    shortcuts: [{
      text: '续费一月',
      onClick(picker) {
        const start = val
        const end = moment(val).add(1, 'M').format('YYYY-MM-DD HH:mm:ss') // 获取开始时间+1月的时间
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '续费两月',
      onClick(picker) {
        const start = val
        const end = moment(val).add(2, 'M').format('YYYY-MM-DD HH:mm:ss') // 获取开始时间+2月的时间
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '续费三月',
      onClick(picker) {
        const start = val
        const end = moment(val).add(3, 'M').format('YYYY-MM-DD HH:mm:ss') // 获取开始时间+3月的时间
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '续费半年',
      onClick(picker) {
        const start = val
        const end = moment(val).add(6, 'M').format('YYYY-MM-DD HH:mm:ss') // 获取开始时间+6月的时间
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '续费一年',
      onClick(picker) {
        const start = val
        const end = moment(val).add(1, 'Y').format('YYYY-MM-DD HH:mm:ss') // 获取开始时间+1年的时间
        picker.$emit('pick', [start, end])
      }
    }]
  }
  return pickOptions
}
