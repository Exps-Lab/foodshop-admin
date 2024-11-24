import { defineStore } from 'pinia'
import { login, logout } from '@api/login'
import { authStore } from '@store/auth'
import { removeToken } from "@utils/login_token"

export const userStore = defineStore('user', {
  state: () => ({
    userInfo: {},
  }),
  actions: {
    resetUserInfo () {
      this.userInfo = {}
    },
    setUserInfo (info) {
      Object.keys(info).forEach(key => {
        this.userInfo[key] = info[key]
      })
    },
    login (formData) {
      const { username, password } = formData
      return new Promise((resolve, reject) => {
        login({
          username,
          password: window.btoa(password)
        }).then((res) => {
          const { role, role_name, c_time } = res.data
          this.setUserInfo({
            username,
            role,
            role_name,
            c_time
          })
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    logout () {
      const _authStore = authStore()
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.resetUserInfo()
            _authStore.resetRoutes()
            removeToken()
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    }
  }
})
