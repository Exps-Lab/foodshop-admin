<template>
  <div class="sidebar">
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
  import { computed } from "vue"
  import { useRouter } from "vue-router"
  import Item from './Item.vue'

  const props = defineProps({
    list: Array
  })
  const router = useRouter()
  const { list } = props
  let path = computed(() => router.currentRoute.value.path)
  const onCollapse = (val, type) => {}
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  background-color: #FFF;
  z-index: 1001;
}
</style>
