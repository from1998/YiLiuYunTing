import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, removeMenu, removeID, setID, setUserName } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户登陆
  login({ commit }, userInfo) {
    // 从userInfo里面取出username和password以及验证码和验证码id
    const { username, password, verifyCode, uuid } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: verifyCode, verifyCodeId: uuid }).then(response => {
        const { token, user } = response
        commit('SET_TOKEN', token)
        setToken(token)
        setID(user.id)
        setUserName(user.username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { username, picture, roles, permissions } = response

        if (!username) {
          reject('用户未登陆,请登陆.')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          removeMenu()
          resetRouter()// 重置路由
          resolve()
        }
        commit('SET_ROLES', roles)// 用户角色
        commit('SET_NAME', username)// 用户名
        commit('SET_AVATAR', picture)// 头像
        commit('SET_PERMISSIONS', permissions)// 头像
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        removeMenu()
        removeID()
        resetRouter()// 重置路由
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
        window.sessionStorage.clear()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
