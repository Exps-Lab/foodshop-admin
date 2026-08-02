import axios from "axios"
import router from '@router'
import { userStore } from '@store/user'

import Loading from '@/composables/Loading/index.js'

let requestCount = 0
let loadingInstance = null
let lastShowTimestamp = 0
const LOADING_MIN_TIME_MS = 300

const showLoading = () => {
  if (!loadingInstance) {
    loadingInstance = Loading()
    loadingInstance?.showLoading('正在处理中...')
  }
  lastShowTimestamp = Date.now()
  requestCount++
}

const hideLoading = () => {
  requestCount = Math.max(requestCount - 1, 0)

  if (requestCount === 0 && loadingInstance) {
    const delay = Math.max(LOADING_MIN_TIME_MS - Date.now() - lastShowTimestamp, 0);
    const clearTimer = setTimeout(() => {
      clearTimeout(clearTimer)
      loadingInstance?.hideLoading()
      loadingInstance = null
    }, delay)
  }
}

const service = axios.create({
  timeout: 60 * 1000
})

// Sign in the request interceptors.
service.interceptors.request.use(
  config => {
    if (config?.needLoading !== false) {
      showLoading()
    }
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
    if (response?.config?.needLoading !== false) {
      hideLoading()
    }
    const store = userStore()
    const res = response.data
    if (res.code !== 1) {
      // 10002: illegal token
      if ([10002].includes(res.code)) {
        store.logout().then(() => {
          router.push('/login')
        })
      }
      // TODO: 其他错误码，组件提示用户错误信息
      return Promise.reject(response)
    } else {
      return response.data
    }
  },
  error => {
    if (error?.config?.needLoading !== false) {
      hideLoading()
    }
    console.log("Error:" + error)
    return Promise.reject(error)
  }
);

function handle(req) {
  const { needLoading = true, timeout = 60, ...axiosConfig } = req || {}

  if (axiosConfig.params && axiosConfig.params.redirecturi) {
    delete axiosConfig.params.redirecturi
  }

  axiosConfig.needLoading = needLoading;

  const timeoutNum = Number(timeout)
  if (!Number.isNaN(timeoutNum) && timeoutNum > 0) {
    axiosConfig.timeout = timeoutNum < 1000 ? timeoutNum * 1000 : timeoutNum
  }

  return service(axiosConfig)
}

export default handle
