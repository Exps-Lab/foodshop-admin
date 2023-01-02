<template>
  <div class="sidebar">
    <img class="logo" :src="logoPath" alt="logo">
    <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-selected-keys="[path]"
      auto-open-selected
      show-collapse-button
      breakpoint="xl"
      @collapse="onCollapse"
    >
      <item v-for="route in list" :key="route.label + route.path" :route="route"></item>
    </a-menu>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue"
  import { useRouter } from "vue-router"
  import Item from './Item.vue'
  import logo from './imgs/logo.png'
  import logoOnly from './imgs/logo-only.png'

  const props = defineProps({
    list: Array
  })
  const router = useRouter()
  const { list } = props
  const collapse = ref(false)

  const path = computed(() => router.currentRoute.value.path)
  const logoPath = computed(() => {
    return collapse.value ? logoOnly : logo
  })
  const onCollapse = (val) => {
    collapse.value = val
    document.querySelector(".app-main").style.maxWidth = val ? 'calc(100vw - 50px - 48px)' : 'calc(100vw - 200px - 48px)'
  }
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  font-size: 0;
  background-color: #FFF;
  z-index: 1001;
  :deep(.arco-menu) {
    height: calc(100% - 50px) !important;
  }
  .logo {
    height: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
    transition: width 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    cursor: pointer;
  }
}
</style>
