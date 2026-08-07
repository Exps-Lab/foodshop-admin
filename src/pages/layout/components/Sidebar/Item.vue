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

<script setup lang="ts">
import { computed } from 'vue'

interface MenuItem {
  label: string
  path: string
  icon?: string
  children?: MenuItem[]
}

const props = defineProps<{
  route: MenuItem
}>()
const { route } = props
const hasChild = computed(() => (route.children?.length ?? 0) > 0)
</script>

<style lang="less" scoped>

</style>
