<template>
  <div class="menu-item">
    <router-link v-if="!hasChild" :to="route.path">
      <a-menu-item :key="route.path">
        <component :is="`icon-${route.icon}`"></component>{{ route.label }}
      </a-menu-item>
    </router-link>
    <a-sub-menu v-else>
      <template #icon>
        <component :is="`icon-${route.icon}`"></component>
      </template>
      <template #title>{{ route.label }}</template>
      <item v-for="child in route.children" :key="child.label + child.path" :route="child"></item>
    </a-sub-menu>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  route: Object
})
const { route } = props
const hasChild = computed(() => {
  const children = JSON.parse(route.children || '[]')
  return children.children
})
</script>

<style lang="less" scoped>

</style>
