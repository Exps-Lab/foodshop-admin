import { createApp, ref } from 'vue'
import Loading from './index.vue'

export default function useLoading() {
  let LoadingIns = ref(null)
  const container = document.createElement("div")
  document.body.appendChild(container)
  
  const showLoading = (text = '加载中...') => {
    LoadingIns.value = createApp(Loading, {
      text
    })
    LoadingIns.value.mount(container)
  }

  const hideLoading = () => {
    if (LoadingIns.value) {
      LoadingIns.value.unmount()
      LoadingIns.value = null
      document.body.removeChild(container)
    }
  }

  return {
    showLoading,
    hideLoading
  }
}