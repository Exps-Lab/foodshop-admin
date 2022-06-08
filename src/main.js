import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './auth'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import "@/styles/index.less"

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(ArcoVue)
app.use(ArcoVueIcon)

app.mount('#app')
