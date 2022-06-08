import { defineStore } from 'pinia'
import { login, logout } from '@api/login'

export const userStore = defineStore('user', {
  state: () => ({
    userInfo: {},
  }),
  actions: {
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
          console.log(res.data)
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

    }
  }
})
