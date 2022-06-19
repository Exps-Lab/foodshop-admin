<template>
  <div class="sidebar">
    <img :class="['logo', collapse ? 'only' : 'all']" :src="logoPath" alt="logo">
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

  const props = defineProps({
    list: Array
  })
  const router = useRouter()
  const { list } = props
  let collapse = ref(false)

  let path = computed(() => router.currentRoute.value.path)
  let logoPath = computed(() => {
    const url = collapse.value ? './imgs/logo-only.png' : './imgs/logo.png'
    return new URL(url, import.meta.url).href
  })

  const onCollapse = (val, type) => {
    collapse.value = val
  }
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  background-color: #FFF;
  z-index: 1001;
  :deep(.arco-menu) {
    height: calc(100% - 91px) !important;
  }
  .logo {
    margin-left: 50%;
    transform: translateX(-50%);
    &.only {
      width: 50px;
    }
    &.all {
      width: 91px;
    }
  }
}
</style>
