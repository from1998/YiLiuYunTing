import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const MenuKey = 'Admin-Menu'
const UserInfoKey = 'User-Info'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeMenu() {
  return Cookies.remove(MenuKey)
}

export function setMenu(menu) {
  return Cookies.set(MenuKey, menu)
}
export function getMenu() {
  return Cookies.get(MenuKey)
}

export function getUserInfo() {
  return JSON.parse(Cookies.get(UserInfoKey))
}

export function setUserInfo(userInfo) {
  var target = {}
  for (const key in userInfo) {
    if (userInfo[key] !== null) {
      target[key] = userInfo[key]
      if (userInfo[key] instanceof Object) {
        target[key] = {}
        for (const itemKey in userInfo[key]) {
          if (userInfo[key][itemKey] !== null) {
            target[key][itemKey] = userInfo[key][itemKey]
          }
        }
      }
    }
  }
  return Cookies.set(UserInfoKey, JSON.stringify(target))
}

export function removeUserInfo() {
  return Cookies.remove(UserInfoKey)
}
