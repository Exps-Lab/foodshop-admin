import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import router from '@router'
import { userStore } from '@store/user'

import Loading from '@/composables/Loading/index.js'

// API 响应基础类型
interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
}

// 请求配置类型
interface RequestConfig {
  needLoading?: boolean
  timeout?: number
  url?: string
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
  params?: Record<string, any>
  data?: Record<string, any>
  headers?: Record<string, string>
  [key: string]: any
}

// 扩展 axios 配置类型
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    needLoading?: boolean
  }
}

let requestCount = 0
let loadingInstance: ReturnType<typeof Loading> | null = null
let lastShowTimestamp = 0
const LOADING_MIN_TIME_MS = 300

const showLoading = (): void => {
  if (!loadingInstance) {
    loadingInstance = Loading()
    loadingInstance?.showLoading('正在处理中...')
  }
  lastShowTimestamp = Date.now()
  requestCount++
}

const hideLoading = (): void => {
  requestCount = Math.max(requestCount - 1, 0)

  if (requestCount === 0 && loadingInstance) {
    const delay = Math.max(LOADING_MIN_TIME_MS - (Date.now() - lastShowTimestamp), 0)
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

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config?.needLoading !== false) {
      showLoading()
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse): any => {
    if (response?.config?.needLoading !== false) {
      hideLoading()
    }
    const store = userStore()
    const res = response.data
    if (res.code !== 1) {
      // 10002: token 失效
      if ([10002].includes(res.code)) {
        store.logout().then(() => {
          router.push('/login')
        })
      }
      // TODO: 其他错误码，组件提示用户错误信息
      return Promise.reject(response)
    } else {
      return response.data as any
    }
  },
  (error) => {
    if (error?.config?.needLoading !== false) {
      hideLoading()
    }
    console.log('Error:' + error)
    return Promise.reject(error)
  }
)

function handle<T = any>(req: RequestConfig): Promise<ApiResponse<T>> {
  const { needLoading = true, timeout = 60, ...axiosConfig } = req || {}

  if (axiosConfig.params && axiosConfig.params.redirecturi) {
    delete axiosConfig.params.redirecturi
  }

  (axiosConfig as InternalAxiosRequestConfig).needLoading = needLoading

  const timeoutNum = Number(timeout)
  if (!Number.isNaN(timeoutNum) && timeoutNum > 0) {
    axiosConfig.timeout = timeoutNum < 1000 ? timeoutNum * 1000 : timeoutNum
  }

  return service(axiosConfig as AxiosRequestConfig)
}

export default handle
