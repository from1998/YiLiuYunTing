// 项目通用方法的封装

import { getDataByType } from '@/api/system/dict/data'

// 加密解密
export function encode64(input) {
  const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/_' + '='
  let output = ''
  let chr1 = ''
  let chr2 = ''
  let chr3 = ''
  let enc1 = ''
  let enc2 = ''
  let enc3 = ''
  let enc4 = ''
  var i = 0
  do {
    chr1 = input.charCodeAt(i++)
    chr2 = input.charCodeAt(i++)
    chr3 = input.charCodeAt(i++)
    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63
    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }
    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4)
    chr1 = chr2 = chr3 = ''
    enc1 = enc2 = enc3 = enc4 = ''
  } while (i < input.length)
  return output
}

// 查询多个字典数据
export function getDataByMoreType() {
  const vals = []
  for (let index = 0; index < arguments.length; index++) {
    vals.push(getDataByType(arguments[index]).then(res => {
      return {
        name: arguments[index],
        value: res.data
      }
    }))
  }
  return vals
}

// 可以重置任何页面的表单
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}
// 把日期范围构造成beginTime和endTime
export function addDateRange(params, dateRange) {
  var search = params
  search.beginTime = ''
  search.endTime = ''
  if (dateRange != null && dateRange !== '' && dateRange !== undefined) {
    search.beginTime = this.dateRange[0]
    search.endTime = this.dateRange[1]
  }
  return search
}
// 状态翻译 datas是当前状态数据列表 value要翻译的值
export function selectDictLabel(datas, value) {
  const actions = []
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue === value) {
      actions.push(datas[key].dictLabel)
      return false
    }
  })
  return actions.join('')
}
// 角色翻译 datas是角色数据列表 value要翻译的值
export function selectRoleLabel(datas, value) {
  const Roles = []
  Object.keys(datas).map((key) => {
    if (datas[key].roleId === value) {
      Roles.push(datas[key].roleName)
      return false
    }
  })
  return Roles
}

// 翻译车场类型
export function convertCarCategory(arr, val) {
  let convertVal = ''
  arr.forEach(item => {
    if (Number(item.dictValue) === val) {
      convertVal = item.dictLabel
      return
    }
  })
  return convertVal
}

/** *
 * 构造树的数据结构
 * @param data 要构造的数据源
 * @param id 字段ID  默认为id
 * @param parentId 父节点字端  默认为parentId
 * @param children 子节点的字段 默认为children
 * @param rootId 根节点的ID  默认为0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  // 对源数据进行深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有的项目
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回上一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}

export function Utils() {
  const dt = new Date()
  const y = dt.getFullYear()
  const m = dt.getMonth() + 1
  const d = dt.getDate()
  const w = dt.getDay()
  const weeks = ['天', '一', '二', '三', '四', '五', '六']
  return `${y} 年 ${m.toString().padStart(2, '0')} 月 ${d.toString().padStart(2, '0')} 日 星期${weeks[w]}`
}
