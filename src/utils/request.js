import axios from "axios"
import router from '@router'
import { userStore } from '@store/user'

let loading = false
let requestCount = 0
let redirecturi = ''
const host = window.location.origin

const showLoading = () => {
  if (requestCount === 0 && !loading) {
    // TODO: 显示loading组件
    loading = true
    console.log('Loading Start...', Date.now())
  }
  requestCount++
}

const hideLoading = () => {
  requestCount--
  if (requestCount == 0) {
    // TODO: 隐藏loading组件
    loading = false
    console.log('Loading End...', Date.now())
  }
}

const service = axios.create({
  timeout: 5000
})

// Sign in the request interceptors.
service.interceptors.request.use(
  config => {
    showLoading()
    return config
  },
  error => {
    // Do something with request error
    // for debug
    console.log(error)
    Promise.reject(error)
  }
)

// Sign in the response interceptors.
service.interceptors.response.use(
  response => {
    hideLoading()
    const store = userStore()
    const res = response.data
    if (res.code !== 1) {
      // 10002: illegal token
      if ([10002].includes(res.code)) {
        store.logout().then(() => {
          router.push('/login')
        })
      }
      // TODO: 组件提示用户错误信息
      return Promise.reject(response)
    } else {
      return response.data
    }
  },
  error => {
    hideLoading()
    console.log("Error:" + error)
    return Promise.reject(error)
  }
);

function handle(req) {
  if (req.params && req.params.redirecturi) {
    redirecturi = req.params.redirecturi
    delete req.params.redirecturi
  } else {
    redirecturi = ''
  }
  return service(req)
}

export default handle