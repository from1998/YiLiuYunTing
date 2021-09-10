import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const MenuKey = 'Admin-Menu'
const IDKey = 'User-ID'
const userNameKey = 'User-Name'
const RoleIDKey = 'User-RoleID'

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

export function getID() {
  return Cookies.get(IDKey)
}

export function setID(ID) {
  return Cookies.set(IDKey, ID)
}

export function removeID() {
  return Cookies.remove(IDKey)
}

export function getUserName() {
  return Cookies.get(userNameKey)
}

export function setUserName(name) {
  return Cookies.set(userNameKey, name)
}

export function removeUserName() {
  return Cookies.remove(userNameKey)
}
export function getRoleID() {
  return Cookies.get(RoleIDKey)
}

export function setRoleID(roleID) {
  return Cookies.set(RoleIDKey, roleID)
}

export function removeRoleID() {
  return Cookies.remove(RoleIDKey)
}

